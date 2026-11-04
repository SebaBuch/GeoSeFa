class ShopService {
    constructor(profiles, countries) {
        this.profiles = profiles;
        this.countries = countries;
    }

    getItem(id) {
        if (id.startsWith('flag-') && id !== 'flag-none') {
            return this.getFlagItem(id.slice(5));
        }
        const matches = SHOP_ITEMS.filter(item => item.id === id);
        return matches[0];
    }

    getOutfitItem(outfit, slot) {
        const item = outfit[slot] ? this.getItem(outfit[slot]) : undefined;
        return item ? item : this.getItem(DEFAULT_OUTFIT[slot]);
    }

    getFlagItem(code) {
        const country = this.countries.getCountry(code);
        const name = country ? country.name : code;
        return { id: 'flag-' + code, slot: 'flag', name: name, price: FLAG_PRICE, level: 1, code: code };
    }

    getItemsForSlot(slot) {
        if (slot === 'flag') {
            return this.getOwnedFlagItems();
        }
        return SHOP_ITEMS.filter(item => item.slot === slot);
    }

    getOwnedFlagItems() {
        const items = [this.getItem('flag-none')];
        const owned = this.profiles.getCurrent().owned;
        for (let i = 0; i < owned.length; i++) {
            if (owned[i].startsWith('flag-')) {
                items.push(this.getItem(owned[i]));
            }
        }
        return items;
    }

    isOwned(item) {
        if (item.achievement) {
            return achievementService.isUnlocked(item.achievement);
        }
        return item.price === 0 || this.profiles.getCurrent().owned.includes(item.id);
    }

    isLevelReached(item) {
        return this.profiles.getLevelInfo(this.profiles.getCurrent().xp).level >= item.level;
    }

    getPendingItems(outfit) {
        const pending = [];
        for (let i = 0; i < SHOP_SLOTS.length; i++) {
            const item = this.getOutfitItem(outfit, SHOP_SLOTS[i].key);
            if (!this.isOwned(item)) {
                pending.push(item);
            }
        }
        return pending;
    }

    getTotalPrice(items) {
        let total = 0;
        for (let i = 0; i < items.length; i++) {
            total += items[i].price;
        }
        return total;
    }

    canBuyAll(items) {
        const blocked = items.filter(item => !this.isLevelReached(item) || item.achievement);
        return blocked.length === 0 && this.getTotalPrice(items) <= this.profiles.getCurrent().coins;
    }

    buyAndWear(outfit) {
        const pending = this.getPendingItems(outfit);
        if (!this.canBuyAll(pending)) {
            return false;
        }
        const profile = this.profiles.getCurrent();
        profile.coins -= this.getTotalPrice(pending);
        for (let i = 0; i < pending.length; i++) {
            profile.owned.push(pending[i].id);
        }
        this.recordPurchase(pending);
        this.wearOwned(outfit);
        return true;
    }

    recordPurchase(items) {
        const flags = items.filter(item => item.slot === 'flag');
        const specials = items.filter(item => item.special);
        achievementService.increase('items-bought', items.length - flags.length);
        achievementService.increase('flags-bought', flags.length);
        achievementService.increase('specials-bought', specials.length);
        achievementService.increase('coins-spent', this.getTotalPrice(items));
    }

    wearOwned(outfit) {
        const profile = this.profiles.getCurrent();
        const isChanged = JSON.stringify(outfit) !== JSON.stringify(profile.outfit);
        if (this.getPendingItems(outfit).length > 0 || !isChanged) {
            return;
        }
        profile.outfit = { ...outfit };
        this.profiles.saveProfiles();
        achievementService.increase('outfit-changes', 1);
        achievementService.unlockIf(this.isMidasOutfit(outfit), 'hidden-midas');
    }

    isMidasOutfit(outfit) {
        const isGold = outfit.top === 'top-gold' && outfit.pants === 'pants-gold' && outfit.shoes === 'shoes-gold';
        return isGold && outfit.hat === 'hat-crown';
    }
}
