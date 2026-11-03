let storageService;
let countryService;
let shapeService;
let worldMap;
let soundService;
let achievementService;
let profileService;
let toastCounter = 0;
let selectedStartAvatar = 'skin-1';
let shopService;
let previewOutfit = null;
let shopSlot = 'hair';
let currentGame = null;
let lastQuizSettings = null;

const GAMES = [
    { key: 'georoute', title: 'GeoRoute', description: 'Finde den kürzesten Landweg vom Start- zum Zielland.', statsType: 'win' },
    { key: 'geosize', title: 'GeoSize', description: 'Schätze, wie groß zwei Länder im Vergleich sind.', statsType: 'score' },
    { key: 'geodecide', title: 'GeoDecide', description: 'Mehr oder weniger? Halte deine Serie so lange wie möglich.', statsType: 'streak' },
    { key: 'geodle', title: 'Geodle', description: 'Finde das gesuchte Land mit Hilfe von Hinweisen.', statsType: 'win' },
    { key: 'geoconnections', title: 'GeoConnections', description: 'Finde die 4 Gruppen, die zum selben Land gehören.', statsType: 'win' },
    { key: 'blitz', title: 'Blitzrunde', description: '60 Sekunden: so viele Flaggen, Hauptstädte oder Umrisse wie möglich.', statsType: 'blitz' }
];

const QUIZ_CATEGORIES = [
    { key: 'countries', title: 'Länder', description: 'Karte, Eintippen und Umrisse' },
    { key: 'flags', title: 'Flaggen', description: 'Auswählen und Zuordnen' },
    { key: 'capitals', title: 'Hauptstädte', description: 'Auswählen, Karte und Zuordnen' }
];

async function init() {
    storageService = new StorageService();
    profileService = new ProfileService(storageService);
    countryService = new CountryService(storageService);
    shapeService = new ShapeService(countryService);
    worldMap = new WorldMap(shapeService);
    shopService = new ShopService(profileService, countryService);
    soundService = new SoundService();
    achievementService = new AchievementService(storageService, profileService);
    await loadData(false);
}

async function loadData(forceReload) {
    const hasCache = storageService.loadGlobal('countries', null) !== null;
    if ((!hasCache || forceReload) && API_KEY.startsWith('HIER')) {
        return showError('Trage zuerst deinen API-Key in js/config.js ein.');
    }
    showContent(loadingTemplate('Lade Länderdaten ...'));
    if (!await countryService.loadCountries(forceReload)) {
        return showError(countryService.lastError);
    }
    if (!await shapeService.loadShapes()) {
        return showError('Die Datei data/countries.geojson konnte nicht geladen werden.');
    }
    showHome();
}

async function reloadData() {
    stopCurrentGame();
    await loadData(true);
}

function showContent(html) {
    document.getElementById('content').innerHTML = html;
}

function showError(text) {
    showContent(errorTemplate(text));
}

function stopCurrentGame() {
    soundService.stop();
    if (currentGame) {
        currentGame.stop();
        currentGame = null;
    }
}

function showHome() {
    if (!countryService || countryService.countries.length === 0) {
        return;
    }
    if (!profileService.hasProfile()) {
        return showProfileCreate();
    }
    stopCurrentGame();
    setTheme('home');
    updateHeader();
    showContent(homeTemplate(buildDailyCard(), buildGameCards(), buildQuizCards(), countryService.countries.length));
}

function setTheme(name) {
    const profile = profileService.getCurrent();
    const color = profile ? profile.theme : 'standard';
    document.body.className = 'theme-' + name + ' color-' + color;
}

function updateHeader() {
    updateAchievementButton();
    updateProfileButton();
}

function updateProfileButton() {
    const button = document.getElementById('profile-button');
    const profile = profileService.getCurrent();
    if (!profile || countryService.countries.length === 0) {
        button.classList.add('hidden');
        return;
    }
    button.classList.remove('hidden');
    const level = profileService.getLevelInfo(profile.xp).level;
    button.innerHTML = profileChipTemplate(buildProfileAvatar(profile, profile.frame, 'avatar-small'), profile.name, level, profile.coins);
}

function buildProfileAvatar(profile, frame, sizeClass) {
    return avatarTemplate(buildAvatarSvg(profile.outfit), frame, sizeClass);
}

function buildAvatarSvg(outfit) {
    const hair = shopService.getOutfitItem(outfit, 'hair');
    return avatarSvgTemplate({
        background: shopService.getOutfitItem(outfit, 'background').svg,
        hairBack: hair.svgBack || '',
        top: shopService.getOutfitItem(outfit, 'top').svg,
        skin: shopService.getOutfitItem(outfit, 'skin').color,
        hair: hair.svg,
        glasses: shopService.getOutfitItem(outfit, 'glasses').svg,
        hat: shopService.getOutfitItem(outfit, 'hat').svg,
        accessory: shopService.getOutfitItem(outfit, 'accessory').svg,
        flag: buildFlagPin(shopService.getOutfitItem(outfit, 'flag'))
    });
}

function buildFlagPin(flagItem) {
    const country = flagItem.code ? countryService.getCountry(flagItem.code) : null;
    return country && country.flag ? flagPinTemplate(country.flag) : '';
}

function createToastId() {
    toastCounter++;
    return 'toast-' + toastCounter;
}

function showToast(toastId, html) {
    document.getElementById('toast-area').insertAdjacentHTML('beforeend', html);
    setTimeout(() => removeToast(toastId), 4500);
}

function removeToast(toastId) {
    const toast = document.getElementById(toastId);
    if (toast) {
        toast.remove();
    }
}

function showProfileCreate() {
    stopCurrentGame();
    setTheme('home');
    updateHeader();
    selectedStartAvatar = 'skin-1';
    const cancelHtml = profileService.hasProfile() ? profileCancelTemplate() : '';
    showContent(profileCreateTemplate(buildStartAvatarOptions(), cancelHtml));
}

function buildStartAvatarOptions() {
    const skins = SHOP_ITEMS.filter(item => item.slot === 'skin' && item.price === 0);
    let html = '';
    for (let i = 0; i < skins.length; i++) {
        const selectedClass = skins[i].id === selectedStartAvatar ? 'selected' : '';
        const outfit = { ...DEFAULT_OUTFIT, skin: skins[i].id };
        html += startAvatarTemplate(skins[i], avatarTemplate(buildAvatarSvg(outfit), 'none', 'avatar-medium'), selectedClass);
    }
    return html;
}

function selectStartAvatar(skinId) {
    selectedStartAvatar = skinId;
    document.getElementById('start-avatars').innerHTML = buildStartAvatarOptions();
}

function createProfile(event) {
    event.preventDefault();
    const name = escapeHtml(document.getElementById('profile-name').value.trim());
    if (name === '') {
        document.getElementById('message').innerHTML = 'Bitte gib einen Namen ein.';
        return;
    }
    profileService.createProfile(name, selectedStartAvatar);
    changeProfileData();
}

function switchProfile(profileId) {
    profileService.select(profileId);
    changeProfileData();
}

function changeProfileData() {
    achievementService = new AchievementService(storageService, profileService);
    lastQuizSettings = null;
    showHome();
}

function showProfile() {
    if (!profileService.hasProfile()) {
        return;
    }
    stopCurrentGame();
    setTheme('home');
    showContent(profilePageTemplate(buildProfileCard(), buildOptionSections(), buildProfileList()));
}

function buildProfileCard() {
    const profile = profileService.getCurrent();
    const info = profileService.getLevelInfo(profile.xp);
    const isMax = info.level >= MAX_LEVEL;
    const percent = isMax ? 100 : Math.round(info.current / info.needed * 100);
    const xpText = isMax ? 'Maximales Level erreicht · ' + profile.xp + ' XP' : info.current + ' / ' + info.needed + ' XP bis Level ' + (info.level + 1);
    const bestStreak = profileService.getBestStreak();
    const rankIndex = profileService.getRankIndex(bestStreak);
    const avatarHtml = buildProfileAvatar(profile, profile.frame, 'avatar-large');
    return profileCardTemplate(profile, avatarHtml, RANKS[rankIndex].title, getRankText(rankIndex, bestStreak), info.level, percent, xpText);
}

function getRankText(rankIndex, bestStreak) {
    const bestText = 'Beste Tages-Serie: ' + formatDays(bestStreak);
    if (rankIndex === RANKS.length - 1) {
        return bestText + ' · Höchster Rang erreicht';
    }
    const nextRank = RANKS[rankIndex + 1];
    return bestText + ' · Nächster Rang: ' + nextRank.title + ' ab ' + formatDays(nextRank.days);
}

function buildOptionSections() {
    let html = '';
    for (let i = 0; i < PROFILE_OPTION_TYPES.length; i++) {
        const type = PROFILE_OPTION_TYPES[i];
        const options = PROFILE_OPTIONS.filter(option => option.type === type.key);
        html += profileSectionTemplate(type.title, buildOptionButtons(options));
    }
    return html;
}

function buildOptionButtons(options) {
    const profile = profileService.getCurrent();
    let html = '';
    for (let i = 0; i < options.length; i++) {
        const preview = buildOptionPreview(options[i], profile);
        const selectedClass = profile[options[i].type] === options[i].value ? 'selected' : '';
        const isUnlocked = profileService.isOptionUnlocked(options[i]);
        html += isUnlocked ? profileOptionTemplate(options[i], preview, selectedClass) : profileOptionLockedTemplate(options[i], preview);
    }
    return html;
}

function buildOptionPreview(option, profile) {
    if (option.type === 'frame') {
        return buildProfileAvatar(profile, option.value, 'avatar-medium');
    }
    return option.type === 'theme' ? themePreviewTemplate(option.value) : '';
}

function chooseProfileOption(type, value) {
    profileService.chooseOption(type, value);
    updateHeader();
    showProfile();
}

function buildProfileList() {
    let html = '';
    for (let i = 0; i < profileService.profiles.length; i++) {
        const profile = profileService.profiles[i];
        const avatarHtml = buildProfileAvatar(profile, profile.frame, 'avatar-small');
        const level = profileService.getLevelInfo(profile.xp).level;
        const isCurrent = profile.id === profileService.currentId;
        html += isCurrent ? profileListCurrentTemplate(profile, avatarHtml, level) : profileListItemTemplate(profile, avatarHtml, level);
    }
    return html + profileNewButtonTemplate();
}

function showLeaderboard() {
    if (!profileService.hasProfile()) {
        return;
    }
    stopCurrentGame();
    setTheme('home');
    showContent(leaderboardTemplate(buildTopLists()));
}

function buildTopLists() {
    let html = '';
    for (let i = 0; i < TOP_LISTS.length; i++) {
        const entries = storageService.getTopScores(TOP_LISTS[i].key);
        html += topListTemplate(TOP_LISTS[i].title, buildTopRows(entries, TOP_LISTS[i].unit));
    }
    return html;
}

function buildTopRows(entries, unit) {
    if (entries.length === 0) {
        return topEmptyTemplate();
    }
    let html = '';
    for (let i = 0; i < entries.length; i++) {
        html += topRowTemplate(i + 1, entries[i].score + ' ' + unit, entries[i].detail, formatDateGerman(entries[i].date));
    }
    return html;
}

function showDaily() {
    stopCurrentGame();
    setTheme('daily');
    currentGame = new DailyChallenge();
    currentGame.start();
}

function buildDailyCard() {
    const daily = new DailyChallenge();
    const results = daily.getResults(daily.dateKey);
    return dailyCardTemplate(daily.countDone(results), daily.getTotal(results), formatDays(daily.updateBestStreak()));
}

function showImpressum() {
    stopCurrentGame();
    setTheme('home');
    showContent(impressumTemplate());
}

function updateAchievementButton() {
    const button = document.getElementById('achievement-button');
    if (button) {
        button.classList.toggle('hidden', !profileService.hasProfile());
        button.innerHTML = 'Erfolge ' + achievementService.getUnlockedCount() + ' / ' + ACHIEVEMENTS.length;
    }
}

function showAchievements() {
    if (!profileService.hasProfile()) {
        return;
    }
    stopCurrentGame();
    setTheme('home');
    const unlockedCount = achievementService.getUnlockedCount();
    showContent(achievementsPageTemplate(unlockedCount, ACHIEVEMENTS.length, buildAchievementCategories()));
}

function buildAchievementCategories() {
    let html = '';
    for (let i = 0; i < ACHIEVEMENT_CATEGORIES.length; i++) {
        const category = ACHIEVEMENT_CATEGORIES[i];
        const items = ACHIEVEMENTS.filter(achievement => achievement.category === category);
        const unlocked = items.filter(achievement => achievementService.isUnlocked(achievement.id));
        html += achievementCategoryTemplate(category, unlocked.length, items.length, buildAchievementItems(items));
    }
    return html;
}

function buildAchievementItems(items) {
    let html = '';
    for (let i = 0; i < items.length; i++) {
        const isUnlocked = achievementService.isUnlocked(items[i].id);
        const className = isUnlocked ? 'unlocked achievement-' + items[i].tier : 'locked';
        const statusText = isUnlocked ? 'Seit ' + formatDateGerman(achievementService.unlocked[items[i].id]) : getProgressText(items[i]);
        html += achievementItemTemplate(items[i], className, statusText);
    }
    return html;
}

function getProgressText(achievement) {
    if (!achievement.counter) {
        return 'Gesperrt';
    }
    const current = Math.min(achievementService.getCounter(achievement.counter), achievement.goal);
    return 'Fortschritt: ' + current + ' / ' + achievement.goal;
}

function buildGameCards() {
    let html = '';
    for (let i = 0; i < GAMES.length; i++) {
        const stats = storageService.getGameStats(GAMES[i].key);
        html += gameCardTemplate(GAMES[i], getStatsText(GAMES[i].statsType, stats));
    }
    return html;
}

function getStatsText(statsType, stats) {
    if (statsType === 'blitz') {
        return getBlitzStatsText();
    }
    if (statsType === 'score') {
        return 'Gespielt: ' + stats.played + ' · Highscore: ' + stats.highscore;
    }
    if (statsType === 'streak') {
        return 'Gespielt: ' + stats.played + ' · Rekord: ' + stats.highscore;
    }
    return 'Gespielt: ' + stats.played + ' · Gewonnen: ' + stats.won + ' · Serie: ' + stats.streak + ' (Rekord ' + stats.bestStreak + ')';
}

function getBlitzStatsText() {
    const flagsBest = storageService.getGameStats('blitz-flags').highscore;
    const capitalsBest = storageService.getGameStats('blitz-capitals').highscore;
    const outlinesBest = storageService.getGameStats('blitz-outlines').highscore;
    return 'Rekorde: Flaggen ' + flagsBest + ' · Hauptstädte ' + capitalsBest + ' · Umrisse ' + outlinesBest;
}

function buildQuizCards() {
    let html = '';
    for (let i = 0; i < QUIZ_CATEGORIES.length; i++) {
        html += quizCardTemplate(QUIZ_CATEGORIES[i]);
    }
    return html;
}

function startGame(key) {
    stopCurrentGame();
    setTheme(key);
    currentGame = createGame(key);
    currentGame.start();
}

function createGame(key) {
    if (key === 'georoute') {
        return new GeoRoute();
    } else if (key === 'geosize') {
        return new GeoSize();
    } else if (key === 'geodecide') {
        return new GeoDecide();
    } else if (key === 'geodle') {
        return new Geodle();
    } else if (key === 'blitz') {
        return new BlitzRound();
    }
    return new GeoConnections();
}

function showQuizSetup(categoryKey) {
    stopCurrentGame();
    setTheme(categoryKey);
    const matches = QUIZ_CATEGORIES.filter(item => item.key === categoryKey);
    const category = matches[0];
    showContent(quizSetupTemplate(category.title, buildModeOptions(categoryKey), buildRegionOptions()));
    applyLastSettings(categoryKey);
    updateQuizBest();
}

function applyLastSettings(categoryKey) {
    if (!lastQuizSettings || QUIZ_MODES[lastQuizSettings.mode].category !== categoryKey) {
        return;
    }
    document.getElementById('setting-mode').value = lastQuizSettings.mode;
    document.getElementById('setting-region').value = lastQuizSettings.region;
    document.getElementById('setting-amount').value = String(lastQuizSettings.amount);
    document.getElementById('setting-time').value = String(lastQuizSettings.timeLimit);
}

function buildModeOptions(categoryKey) {
    const modeKeys = Object.keys(QUIZ_MODES);
    let html = '';
    for (let i = 0; i < modeKeys.length; i++) {
        if (QUIZ_MODES[modeKeys[i]].category === categoryKey) {
            html += selectOptionTemplate(modeKeys[i], QUIZ_MODES[modeKeys[i]].title);
        }
    }
    return html;
}

function buildRegionOptions() {
    let html = '';
    for (let i = 0; i < REGIONS.length; i++) {
        html += selectOptionTemplate(REGIONS[i], REGIONS[i]);
    }
    return html;
}

function readQuizSettings() {
    return {
        mode: document.getElementById('setting-mode').value,
        region: document.getElementById('setting-region').value,
        amount: Number(document.getElementById('setting-amount').value),
        timeLimit: Number(document.getElementById('setting-time').value)
    };
}

function updateQuizBest() {
    const settings = readQuizSettings();
    const usesAmount = QUIZ_MODES[settings.mode].usesAmount;
    document.getElementById('setting-amount').disabled = !usesAmount;
    settings.amount = usesAmount ? settings.amount : 100;
    const best = storageService.getQuizBest(settings.mode + '-' + settings.region + '-' + settings.amount);
    document.getElementById('quiz-best').innerHTML = quizBestTemplate(best.played, best.bestPercent, formatTime(best.bestTime));
}

function startQuiz() {
    const settings = readQuizSettings();
    settings.amount = QUIZ_MODES[settings.mode].usesAmount ? settings.amount : 100;
    lastQuizSettings = settings;
    restartQuiz();
}

function restartQuiz() {
    stopCurrentGame();
    setTheme(QUIZ_MODES[lastQuizSettings.mode].category);
    currentGame = createQuiz(lastQuizSettings.mode);
    currentGame.start(lastQuizSettings);
}

function createQuiz(mode) {
    if (mode === 'map-click' || mode === 'map-type' || mode === 'capital-map') {
        return new MapQuiz();
    }
    if (mode === 'shape-guess') {
        return new ShapeQuiz();
    }
    if (mode === 'flag-match' || mode === 'capital-match') {
        return new MatchQuiz();
    }
    return new ChoiceQuiz();
}

function backToQuizSetup() {
    showQuizSetup(QUIZ_MODES[lastQuizSettings.mode].category);
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
    const previewHtml = avatarTemplate(buildAvatarSvg(previewOutfit), profile.frame, 'avatar-shop');
    const flagPickerHtml = shopSlot === 'flag' ? shopFlagPickerTemplate(buildFlagOptions()) : '';
    showContent(shopPageTemplate(previewHtml, profile.coins, buildBuyArea(), buildShopTabs(), buildShopItems(), flagPickerHtml));
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
        const outfit = { ...previewOutfit };
        outfit[shopSlot] = items[i].id;
        const previewHtml = avatarTemplate(buildAvatarSvg(outfit), 'none', 'avatar-medium');
        html += shopItemTemplate(items[i], previewHtml, getItemStateText(items[i]), getItemStateClass(items[i]));
    }
    return html;
}

function getItemStateText(item) {
    if (profileService.getCurrent().outfit[item.slot] === item.id) {
        return 'Angelegt';
    }
    if (shopService.isOwned(item)) {
        return item.price === 0 ? 'Gratis' : 'Im Besitz';
    }
    return shopService.isLevelReached(item) ? item.price + ' Coins' : 'ab Level ' + item.level;
}

function getItemStateClass(item) {
    const triedClass = previewOutfit[item.slot] === item.id ? 'tried ' : '';
    if (shopService.isOwned(item)) {
        return triedClass + 'owned';
    }
    return triedClass + (shopService.isLevelReached(item) ? 'buyable' : 'locked');
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
