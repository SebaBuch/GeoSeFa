let previewOutfit = null;
let shopSlot = 'hair';

function buildProfileAvatar(profile, frame, sizeClass) {
    return avatarTemplate(buildAvatarSvg(profile.outfit, false), frame, sizeClass);
}

function buildAvatarSvg(outfit, isFullBody) {
    return avatarSvgTemplate(buildAvatarParts(outfit), isFullBody ? '0 0 100 168' : '0 0 100 100');
}

function buildAvatarParts(outfit) {
    const parts = {
        background: getItemPart(outfit, 'background', 'svg'),
        accessoryBack: getItemPart(outfit, 'accessory', 'svgBack'),
        hairBack: getItemPart(outfit, 'hair', 'svgBack'),
        skin: shopService.getOutfitItem(outfit, 'skin').color,
        flag: buildFlagPin(shopService.getOutfitItem(outfit, 'flag'))
    };
    return addClothingParts(parts, outfit);
}

function addClothingParts(parts, outfit) {
    const slots = ['hair', 'accessory', 'top', 'pants', 'shoes', 'glasses', 'hat', 'pet'];
    for (let i = 0; i < slots.length; i++) {
        parts[slots[i]] = getItemPart(outfit, slots[i], 'svg');
    }
    return parts;
}

function getItemPart(outfit, slot, key) {
    const item = shopService.getOutfitItem(outfit, slot);
    const svg = item[key] || '';
    return item.colorable ? paintSvg(svg, shopService.getSlotHex(outfit, slot, item)) : svg;
}

function paintSvg(svg, hex) {
    const mainPainted = svg.replaceAll('{{c}}', hex);
    return mainPainted.replaceAll('{{d}}', darkenColor(hex));
}

function darkenColor(hex) {
    let result = '#';
    for (let i = 1; i < 7; i += 2) {
        const value = Math.round(parseInt(hex.slice(i, i + 2), 16) * 0.7);
        result += value.toString(16).padStart(2, '0');
    }
    return result;
}

function buildFlagPin(flagItem) {
    const country = flagItem.code ? countryService.getCountry(flagItem.code) : null;
    return country && country.flag ? flagPinTemplate(country.flag) : '';
}

function showShop() {
    if (!profileService.hasProfile()) {
        return;
    }
    stopCurrentGame();
    setTheme('home');
    previewOutfit = { ...profileService.getCurrent().outfit };
    shopSlot = 'hair';
    renderShop();
}

function renderShop() {
    const profile = profileService.getCurrent();
    const previewHtml = bodyTemplate(buildAvatarSvg(previewOutfit, true), 'body-large');
    showContent(shopPageTemplate(previewHtml, profile.coins, buildBuyArea(), buildShopTabs(), buildShopItems(), buildShopPicker()));
}

function buildShopPicker() {
    if (shopSlot === 'flag') {
        return shopFlagPickerTemplate(buildFlagOptions());
    }
    const item = shopService.getOutfitItem(previewOutfit, shopSlot);
    if (!COLOR_SLOTS.includes(shopSlot) || !item.colorable) {
        return '';
    }
    return shopColorPickerTemplate(item.name, buildColorOptions());
}

function buildColorOptions() {
    const chosenHex = shopService.getSlotHex(previewOutfit, shopSlot, shopService.getOutfitItem(previewOutfit, shopSlot));
    let html = '';
    for (let i = 0; i < SHOP_COLORS.length; i++) {
        const color = SHOP_COLORS[i];
        const activeClass = color.hex === chosenHex ? 'active' : '';
        html += shopColorTemplate(color, activeClass, getColorLabel(color));
    }
    return html;
}

function getColorLabel(color) {
    if (shopService.isOwned(color)) {
        return '';
    }
    return shopService.isLevelReached(color) ? color.price + ' C' : 'Lv ' + color.level;
}

function chooseShopColor(colorId) {
    previewOutfit.colors = { ...previewOutfit.colors, [shopSlot]: colorId };
    shopService.wearOwned(previewOutfit);
    updateHeader();
    renderShop();
}

function buildShopTabs() {
    let html = '';
    for (let i = 0; i < SHOP_SLOTS.length; i++) {
        html += shopTabTemplate(SHOP_SLOTS[i], SHOP_SLOTS[i].key === shopSlot ? 'active' : '');
    }
    return html;
}

function buildShopItems() {
    const items = shopService.getItemsForSlot(shopSlot);
    let html = '';
    for (let i = 0; i < items.length; i++) {
        const outfit = { ...previewOutfit, [shopSlot]: items[i].id };
        const previewHtml = buildShopPreview(outfit);
        html += shopItemTemplate(items[i], previewHtml, getItemStateText(items[i]), getItemStateClass(items[i]), getSeasonText(items[i]));
    }
    return html;
}

function buildShopPreview(outfit) {
    const portraitSlots = ['skin', 'hair', 'hat', 'glasses', 'flag'];
    if (shopSlot === 'pet') {
        return avatarTemplate(avatarSvgTemplate(buildAvatarParts(outfit), '58 118 48 48'), 'none', 'avatar-medium');
    }
    if (portraitSlots.includes(shopSlot)) {
        return avatarTemplate(buildAvatarSvg(outfit, false), 'none', 'avatar-medium');
    }
    return bodyTemplate(buildAvatarSvg(outfit, true), 'body-small');
}

function getItemStateText(item) {
    if (profileService.getCurrent().outfit[item.slot] === item.id) {
        return 'Angelegt';
    }
    if (shopService.isOwned(item)) {
        return item.price === 0 ? 'Gratis' : 'Im Besitz';
    }
    if (item.achievement) {
        return item.achievement === 'all-done' ? 'Alle Erfolge' : 'Geheimer Erfolg';
    }
    return shopService.isLevelReached(item) ? item.price + ' Coins' : 'ab Level ' + item.level;
}

function getSeasonText(item) {
    if (!item.seasonStart) {
        return '';
    }
    const parts = item.seasonEnd.split('-');
    return item.seasonName + ' · bis ' + parts[1] + '.' + parts[0] + '.';
}

function getItemStateClass(item) {
    const triedClass = previewOutfit[item.slot] === item.id ? 'tried ' : '';
    const specialClass = item.special ? 'special ' : '';
    const seasonClass = item.seasonStart ? 'seasonal ' : '';
    if (shopService.isOwned(item)) {
        return triedClass + specialClass + seasonClass + 'owned';
    }
    const isBuyable = shopService.isLevelReached(item) && !item.achievement;
    return triedClass + specialClass + seasonClass + (isBuyable ? 'buyable' : 'locked');
}

function buildFlagOptions() {
    const names = countryService.getSortedNames();
    const owned = profileService.getCurrent().owned;
    let html = '';
    for (let i = 0; i < names.length; i++) {
        const country = countryService.findByName(names[i]);
        if (country && country.flag && !owned.includes('flag-' + country.code)) {
            html += selectOptionTemplate('flag-' + country.code, names[i]);
        }
    }
    return html;
}

function buildBuyArea() {
    const pending = shopService.getPendingItems(previewOutfit);
    if (pending.length === 0) {
        return shopSavedTemplate();
    }
    let names = '';
    for (let i = 0; i < pending.length; i++) {
        names += (i > 0 ? ', ' : '') + pending[i].name;
    }
    const total = shopService.getTotalPrice(pending);
    const disabledText = shopService.canBuyAll(pending) ? '' : 'disabled';
    return shopBuyTemplate(names, total, disabledText, getBuyHint(pending, total));
}

function getBuyHint(pending, total) {
    const secretItems = pending.filter(item => item.achievement);
    if (secretItems.length > 0) {
        return secretItems[0].name + ' gibt es nur über einen geheimen Erfolg.';
    }
    const lockedItems = pending.filter(item => !shopService.isLevelReached(item));
    if (lockedItems.length > 0) {
        return lockedItems[0].name + ' gibt es erst ab Level ' + lockedItems[0].level + '.';
    }
    const missing = total - profileService.getCurrent().coins;
    return missing > 0 ? 'Dir fehlen noch ' + missing + ' Coins.' : '';
}

function selectShopSlot(slotKey) {
    shopSlot = slotKey;
    renderShop();
}

function tryShopItem(itemId) {
    if (itemId === '') {
        return;
    }
    const item = shopService.getItem(itemId);
    previewOutfit[item.slot] = item.id;
    shopService.wearOwned(previewOutfit);
    updateHeader();
    renderShop();
}

function buyPreviewOutfit() {
    if (shopService.buyAndWear(previewOutfit)) {
        updateHeader();
    }
    renderShop();
}

function resetPreviewOutfit() {
    previewOutfit = { ...profileService.getCurrent().outfit };
    renderShop();
}
