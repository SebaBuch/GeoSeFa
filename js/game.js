let storageService;
let countryService;
let shapeService;
let worldMap;
let soundService;
let achievementService;
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
    countryService = new CountryService(storageService);
    shapeService = new ShapeService(countryService);
    worldMap = new WorldMap(shapeService);
    soundService = new SoundService();
    achievementService = new AchievementService(storageService);
    updateAchievementButton();
    await loadData(false);
}

async function loadData(forceReload) {
    const hasCache = storageService.load('countries', null) !== null;
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
    stopCurrentGame();
    setTheme('home');
    showContent(homeTemplate(buildDailyCard(), buildGameCards(), buildQuizCards(), countryService.countries.length));
}

function setTheme(name) {
    document.body.className = 'theme-' + name;
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
    return dailyCardTemplate(daily.countDone(results), daily.getTotal(results), formatDays(daily.getStreak()));
}

function showImpressum() {
    stopCurrentGame();
    setTheme('home');
    showContent(impressumTemplate());
}

function updateAchievementButton() {
    const button = document.getElementById('achievement-button');
    if (button) {
        button.innerHTML = 'Erfolge ' + achievementService.getUnlockedCount() + ' / ' + ACHIEVEMENTS.length;
    }
}

function showAchievements() {
    if (!countryService || countryService.countries.length === 0) {
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
