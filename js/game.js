let storageService;
let countryService;
let shapeService;
let worldMap;
let soundService;
let achievementService;
let profileService;
let questService;
let authService;
let cloudService;
let syncService;
let duelService;
let nameService;
let toastCounter = 0;
let countdownIntervalId = null;
let shopService;
let footballService;
let currentGame = null;
let lastQuizSettings = null;

const GAMES = [
    { key: 'georoute', title: 'GeoRoute', description: 'Finde den kürzesten Landweg vom Start- zum Zielland.', statsType: 'win' },
    { key: 'geosize', title: 'GeoSize', description: 'Schätze, wie groß zwei Länder im Vergleich sind.', statsType: 'score' },
    { key: 'geodecide', title: 'GeoDecide', description: 'Mehr oder weniger? Halte deine Serie so lange wie möglich.', statsType: 'streak' },
    { key: 'geodle', title: 'Geodle', description: 'Finde das gesuchte Land mit Hilfe von Hinweisen.', statsType: 'win' },
    { key: 'geoconnections', title: 'GeoConnections', description: 'Finde die 4 Gruppen, die zum selben Land gehören.', statsType: 'win' },
    { key: 'geodistance', title: 'GeoDistanz', description: 'Finde ein Land, dessen Hauptstadt so weit von der Start-Hauptstadt entfernt ist wie angegeben.', statsType: 'score' },
    { key: 'borderchain', title: 'Grenz-Kette', description: 'Nenne in 90 Sekunden so viele Nachbarländer wie möglich.', statsType: 'score' },
    { key: 'blitz', title: 'Blitzrunde', description: '60 Sekunden: so viele Flaggen, Hauptstädte oder Umrisse wie möglich.', statsType: 'blitz' }
];

const FOOTBALL_GAMES = [
    { key: 'crestquiz', title: 'Wappen-Quiz', description: 'Erkenne den Verein am verschwommenen Wappen. Jeder Fehler macht es schärfer.', statsType: 'score' },
    { key: 'stadiumduel', title: 'Stadion-Quiz', description: 'Welches Stadion hat mehr oder weniger Plätze? Halte deine Serie.', statsType: 'streak' },
    { key: 'playerwordle', title: 'Spieler-Wordle', description: 'Finde den gesuchten Spieler mit Hinweisen zu Verein, Position, Nation und mehr.', statsType: 'win' },
    { key: 'valueduel', title: 'Wer ist mehr wert?', description: 'Welcher Spieler hat den höheren Marktwert? Halte deine Serie.', statsType: 'streak' },
    { key: 'squadduel', title: 'Welcher Kader ist mehr wert?', description: 'Welcher Verein hat den wertvolleren Kader? Halte deine Serie.', statsType: 'streak' },
    { key: 'footballblitz', title: 'Blitzrunde Fußball', description: '60 Sekunden: Spieler, Wappen oder Stadien dem richtigen Verein zuordnen.', statsType: 'fbblitz' }
];

const QUIZ_CATEGORIES = [
    { key: 'countries', title: 'Länder', description: 'Karte, Eintippen und Umrisse' },
    { key: 'flags', title: 'Flaggen', description: 'Auswählen und Zuordnen' },
    { key: 'capitals', title: 'Hauptstädte', description: 'Auswählen, Karte und Zuordnen' }
];

async function init() {
    createServices();
    updateSoundButton();
    if (!authService.isLoggedIn()) {
        profileService.clearCurrent();
    }
    await loadData(false);
}

function createOnlineServices() {
    authService = new AuthService(storageService);
    cloudService = new CloudService(authService);
    syncService = new SyncService(storageService, profileService, cloudService, authService);
    duelService = new DuelService(cloudService, authService, profileService);
    nameService = new NameService(cloudService, authService);
}

function createServices() {
    storageService = new StorageService();
    profileService = new ProfileService(storageService);
    createOnlineServices();
    countryService = new CountryService(storageService);
    shapeService = new ShapeService(countryService);
    worldMap = new WorldMap(shapeService);
    shopService = new ShopService(profileService, countryService);
    footballService = new FootballService();
    questService = new QuestService(storageService, profileService);
    soundService = new SoundService(storageService);
    achievementService = new AchievementService(storageService, profileService);
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
    await startOnline();
}

async function startOnline() {
    if (!authService.isConfigured()) {
        return showError('Trage zuerst FIREBASE_API_KEY und FIREBASE_DB_URL in js/config.js ein.');
    }
    if (authService.isLoggedIn()) {
        await finishLogin();
    } else {
        showLogin();
    }
}

function scheduleCloudSync() {
    if (syncService) {
        syncService.schedule();
    }
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
    stopOnlineView();
    stopDuelWaiting();
    if (currentGame) {
        currentGame.stop();
        currentGame = null;
    }
}

function showHome() {
    if (!canShowHome()) {
        return;
    }
    stopCurrentGame();
    setTheme('home');
    updateHeader();
    showContent(homeTemplate(buildSectionTabs(), buildSectionHtml(), countryService.countries.length));
    startHomeExtras();
}

function canShowHome() {
    if (!countryService || countryService.countries.length === 0) {
        return false;
    }
    if (!authService.isLoggedIn() || !profileService.hasProfile()) {
        showLogin();
        return false;
    }
    if (!nameService.isAllowed(profileService.getCurrent().name)) {
        showRename();
        return false;
    }
    return true;
}

function getSection() {
    return storageService.loadGlobal('section', 'geo');
}

function selectSection(section) {
    storageService.saveGlobal('section', section);
    showHome();
}

function buildSectionTabs() {
    const isFootball = getSection() === 'football';
    return sectionTabsTemplate(isFootball ? '' : 'active', isFootball ? 'active' : '');
}

function buildSectionHtml() {
    if (getSection() === 'football') {
        return footballSectionTemplate(buildGameCards(FOOTBALL_GAMES), footballService.clubs.length, Object.keys(FOOTBALL_LEAGUES).length, footballService.players.length);
    }
    return geoSectionTemplate(buildDailyCard() + buildWeeklyCard(), buildGameCards(GAMES), buildQuizCards());
}

function startHomeExtras() {
    startDailyCountdown();
    loadChampions();
    checkLoginBonus();
}

function checkLoginBonus() {
    const today = getDateKey(new Date());
    const bonus = storageService.load('login-bonus', { last: '', streak: 0 });
    if (bonus.last === today) {
        return;
    }
    const yesterday = getDateKey(new Date(Date.now() - 86400000));
    const streak = bonus.last === yesterday ? bonus.streak + 1 : 1;
    const coins = Math.min(LOGIN_BONUS_BASE + (streak - 1) * LOGIN_BONUS_STEP, LOGIN_BONUS_MAX);
    storageService.save('login-bonus', { last: today, streak: streak });
    showLoginBonus(streak, coins);
}

function showLoginBonus(streak, coins) {
    profileService.addCoins(coins);
    achievementService.unlockIf(streak >= 7, 'login-7');
    achievementService.unlockIf(streak >= 30, 'login-30');
    const toastId = createToastId();
    showToast(toastId, loginBonusToastTemplate(toastId, streak, coins));
}

function startDailyCountdown() {
    clearInterval(countdownIntervalId);
    updateDailyCountdown();
    countdownIntervalId = setInterval(() => updateDailyCountdown(), 1000);
}

function updateDailyCountdown() {
    const elements = document.getElementsByClassName('daily-countdown');
    if (elements.length === 0) {
        return clearInterval(countdownIntervalId);
    }
    const seconds = getSecondsUntilMidnight();
    for (let i = 0; i < elements.length; i++) {
        elements[i].innerHTML = formatCountdown(seconds);
    }
    if (seconds === 0) {
        clearInterval(countdownIntervalId);
        setTimeout(() => refreshAfterMidnight(), 2000);
    }
}

function refreshAfterMidnight() {
    if (currentGame instanceof DailyChallenge) {
        showDaily();
    } else if (currentGame === null) {
        showHome();
    }
}

function setTheme(name) {
    const profile = profileService.getCurrent();
    const color = profile ? profile.theme : 'standard';
    document.body.className = 'theme-' + name + ' color-' + color;
}

function updateHeader() {
    updateAchievementButton();
    updateProfileButton();
    updateSoundButton();
}

function updateSoundButton() {
    document.getElementById('sound-button').innerHTML = soundService.settings.muted ? 'Ton: aus' : 'Ton: an';
}

function toggleSound() {
    soundService.toggleMute();
    updateSoundButton();
}

function changeVolume(percent) {
    soundService.setPercent(Number(percent));
    document.getElementById('volume-value').innerHTML = percent + ' %';
}

function testSound() {
    soundService.playCorrectSound();
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

function showDaily() {
    stopCurrentGame();
    setTheme('daily');
    currentGame = new DailyChallenge();
    currentGame.start();
    startDailyCountdown();
}

function buildDailyCard() {
    const daily = new DailyChallenge();
    const results = daily.getResults(daily.dateKey);
    return dailyCardTemplate(daily.countDone(results), daily.getTotal(results), formatDays(daily.updateBestStreak()));
}

function buildWeeklyCard() {
    const quests = questService.getQuests();
    const state = questService.getState();
    let html = '';
    for (let i = 0; i < quests.length; i++) {
        const progress = Math.min(state.progress[quests[i].id] || 0, quests[i].goal);
        const percent = Math.round(progress / quests[i].goal * 100);
        const doneClass = state.done.includes(quests[i].id) ? 'done' : '';
        html += questRowTemplate(quests[i], progress, percent, doneClass);
    }
    return weeklyCardTemplate(html, formatDays(questService.getDaysLeft()), getWeeklyBonusText(state));
}

function getWeeklyBonusText(state) {
    return state.bonus ? 'Bonus abgeholt' : 'Alle geschafft: +' + WEEKLY_BONUS_COINS + ' Coins';
}

function showImpressum() {
    stopCurrentGame();
    setTheme('home');
    showContent(impressumTemplate());
}

function buildGameCards(games) {
    let html = '';
    for (let i = 0; i < games.length; i++) {
        const stats = storageService.getGameStats(games[i].key);
        html += gameCardTemplate(games[i], getStatsText(games[i].statsType, stats));
    }
    return html;
}

function getStatsText(statsType, stats) {
    if (statsType === 'blitz' || statsType === 'fbblitz') {
        return statsType === 'blitz' ? getBlitzStatsText() : getFootballBlitzStatsText();
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

function getFootballBlitzStatsText() {
    const playersBest = storageService.getGameStats('footballblitz-players').highscore;
    const crestsBest = storageService.getGameStats('footballblitz-crests').highscore;
    const stadiumsBest = storageService.getGameStats('footballblitz-stadiums').highscore;
    return 'Rekorde: Spieler ' + playersBest + ' · Wappen ' + crestsBest + ' · Stadien ' + stadiumsBest;
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
    }
    return createOtherGame(key);
}

function createOtherGame(key) {
    if (key === 'geodle') {
        return new Geodle();
    } else if (key === 'blitz') {
        return new BlitzRound();
    } else if (key === 'geodistance') {
        return new GeoDistance();
    } else if (key === 'borderchain') {
        return new BorderChain();
    } else if (key === 'geoconnections') {
        return new GeoConnections();
    }
    return createFootballGame(key);
}

function createFootballGame(key) {
    if (key === 'crestquiz') {
        return new CrestQuiz();
    } else if (key === 'stadiumduel') {
        return new StadiumDuel();
    } else if (key === 'playerwordle') {
        return new PlayerWordle();
    } else if (key === 'valueduel') {
        return new ValueDuel();
    } else if (key === 'squadduel') {
        return new SquadDuel();
    }
    return new FootballBlitz();
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
    return html + selectOptionTemplate(TRAINING_REGION, 'Meine Fehler (Training)');
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
    const trainingHtml = settings.region === TRAINING_REGION ? mistakeCountTemplate(getMistakeCount(settings.mode)) : '';
    document.getElementById('quiz-best').innerHTML = quizBestTemplate(best.played, best.bestPercent, formatTime(best.bestTime)) + trainingHtml;
}

function getMistakeCount(mode) {
    return storageService.getMistakeCodes(QUIZ_MODES[mode].category).length;
}

function startQuiz() {
    const settings = readQuizSettings();
    if (settings.region === TRAINING_REGION && getMistakeCount(settings.mode) === 0) {
        document.getElementById('quiz-best').innerHTML = mistakeEmptyTemplate();
        return;
    }
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
