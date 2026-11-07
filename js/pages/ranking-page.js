const RANKING_TOP_COUNT = 3;
let playersCache = [];
let onlineView = { type: '', uid: '' };
let onlineRefreshId = null;
let lastOnlineUpdate = 0;
let isOnlineRefreshing = false;
const ONLINE_REFRESH_SECONDS = 30;

function buildPublicSummary() {
    const profile = profileService.getCurrent();
    const values = {};
    for (let i = 0; i < COMPARE_ROWS.length; i++) {
        values[COMPARE_ROWS[i].id] = getCompareValue(profile, COMPARE_ROWS[i]);
    }
    const summary = { name: profile.name, title: profile.title, frame: profile.frame, outfit: profile.outfit, values: values };
    return { ...summary, ...getDailySummary(), achievements: storageService.load('achievements', {}), favorites: getFavorites(), updatedAt: Date.now() };
}

function getDailySummary() {
    const today = getDateKey(new Date());
    const daily = new DailyChallenge();
    const dailyResults = daily.getResults(today);
    const yesterday = addDaysToKey(today, -1);
    const summary = { dailyDate: today, dailyTotal: daily.getTotal(dailyResults), dailyDone: daily.countDone(dailyResults) };
    return { ...summary, ...getMonthSummary(daily), yesterdayDate: yesterday, yesterdayTotal: daily.getTotal(daily.getResults(yesterday)) };
}

function getMonthSummary(daily) {
    const now = new Date();
    const monthKey = getMonthKey(now);
    const lastMonthKey = getPreviousMonthKey(now);
    return { monthKey: monthKey, monthPoints: sumMonthPoints(daily, monthKey), lastMonthKey: lastMonthKey, lastMonthPoints: sumMonthPoints(daily, lastMonthKey) };
}

function sumMonthPoints(daily, monthKey) {
    let total = 0;
    for (let day = 1; day <= 31; day++) {
        total += daily.getTotal(daily.getResults(monthKey + '-' + padNumber(day)));
    }
    return total;
}

function getCompareValue(profile, row) {
    if (row.source === 'level') {
        return profileService.getLevelInfo(profile.xp).level;
    }
    if (row.source === 'profile') {
        return profile[row.key] || 0;
    }
    if (row.source === 'achievements') {
        return Object.keys(storageService.load('achievements', {})).length;
    }
    return getStoredCompareValue(row);
}

function getStoredCompareValue(row) {
    if (row.source === 'storage') {
        return storageService.load(row.key, 0);
    }
    if (row.source === 'counter') {
        return storageService.load('achievement-counters', {})[row.key] || 0;
    }
    return storageService.load('stats-' + row.key, {})[row.field] || 0;
}

async function loadPlayers(loadingText) {
    if (!profileService.hasProfile()) {
        return null;
    }
    stopCurrentGame();
    setTheme('home');
    showContent(loadingTemplate(loadingText));
    await syncService.publishSummary();
    const players = await syncService.loadPublicProfiles();
    playersCache = players || [];
    return players ? players : showContent(onlineErrorTemplate());
}

async function showRanking() {
    if (await loadPlayers('Lade Rangliste ...')) {
        startOnlineView('ranking', '');
    }
}

function renderRanking() {
    achievementService.unlockIf(playersCache.length >= 4, 'hidden-family');
    const topHtml = buildDailyRanking(playersCache) + buildMonthRanking(playersCache);
    showContent(rankingTemplate(topHtml, buildRankingLists(playersCache), playersCache.length));
}

function startOnlineView(type, uid) {
    onlineView = { type: type, uid: uid };
    lastOnlineUpdate = Date.now();
    renderOnlineView();
    clearInterval(onlineRefreshId);
    onlineRefreshId = setInterval(() => tickOnlineView(), 1000);
}

function stopOnlineView() {
    clearInterval(onlineRefreshId);
    onlineView = { type: '', uid: '' };
}

function renderOnlineView() {
    if (onlineView.type === 'ranking') {
        renderRanking();
    } else if (onlineView.type === 'players') {
        renderPlayers();
    } else {
        renderPlayerProfile(onlineView.uid);
    }
}

function tickOnlineView() {
    const seconds = Math.floor((Date.now() - lastOnlineUpdate) / 1000);
    const element = document.getElementById('online-updated');
    if (element) {
        element.innerHTML = seconds < 5 ? 'gerade eben' : 'vor ' + seconds + ' Sekunden';
    }
    if (seconds >= ONLINE_REFRESH_SECONDS && !isOnlineRefreshing) {
        refreshOnlineView();
    }
}

async function refreshOnlineView() {
    isOnlineRefreshing = true;
    await syncService.publishSummary();
    const players = await syncService.loadPublicProfiles();
    isOnlineRefreshing = false;
    lastOnlineUpdate = Date.now();
    if (players && onlineView.type !== '') {
        playersCache = players;
        renderOnlineView();
    }
}

function buildDailyRanking(players) {
    const today = getDateKey(new Date());
    const playedToday = players.filter(player => player.dailyDate === today && player.dailyDone > 0);
    const entries = playedToday.map(player => ({ player: player, value: player.dailyTotal }));
    return rankingListTemplate('Tages-Challenge heute', buildRankingRows(entries, ' / 300'));
}

function buildMonthRanking(players) {
    const monthKey = getMonthKey(new Date());
    const entries = players.map(player => ({ player: player, value: getPeriodPoints(player, 'month', monthKey) || 0 }));
    const active = entries.filter(entry => entry.value > 0);
    return rankingListTemplate('Monatswertung ' + getMonthName(monthKey), buildRankingRows(active, ' Punkte'));
}

function buildRankingLists(players) {
    const rows = COMPARE_ROWS.filter(row => row.ranking !== false);
    let html = '';
    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const entries = players.map(player => ({ player: player, value: player.values ? player.values[row.id] || 0 : 0 }));
        html += rankingListTemplate(row.label, buildRankingRows(entries, ''));
    }
    return html;
}

function buildRankingRows(entries, suffix) {
    if (entries.length === 0) {
        return topEmptyTemplate();
    }
    const sorted = sortByValue(entries);
    let html = '';
    for (let i = 0; i < sorted.length; i++) {
        html += buildRankingRow(sorted[i], i + 1, suffix);
    }
    return html;
}

function buildRankingRow(entry, place, suffix) {
    const player = entry.player;
    const isMe = player.uid === authService.getUid();
    if (place > RANKING_TOP_COUNT && !isMe) {
        return '';
    }
    const gapHtml = place > RANKING_TOP_COUNT ? rankingGapTemplate() : '';
    return gapHtml + rankingRowTemplate(player.uid, place, buildPlayerAvatar(player), player.name, formatNumber(entry.value) + suffix, isMe ? 'me' : '');
}

function sortByValue(entries) {
    const sorted = [];
    for (let i = 0; i < entries.length; i++) {
        let position = sorted.length;
        for (let j = sorted.length - 1; j >= 0; j--) {
            position = sorted[j].value < entries[i].value ? j : position;
        }
        sorted.splice(position, 0, entries[i]);
    }
    return sorted;
}

function buildPlayerAvatar(player) {
    const outfit = player.outfit || DEFAULT_OUTFIT;
    return avatarTemplate(buildAvatarSvg(outfit, false), player.frame || 'none', 'avatar-small');
}

async function showPlayers() {
    if (await loadPlayers('Lade Spieler ...')) {
        startOnlineView('players', '');
    }
}

function renderPlayers() {
    const search = readValue('player-search');
    showContent(playersTemplate(buildPlayerCards(normalizeText(search)), playersCache.length));
    document.getElementById('player-search').value = search;
}

function filterPlayers(text) {
    document.getElementById('player-cards').innerHTML = buildPlayerCards(normalizeText(text));
}

function buildPlayerCards(search) {
    const players = playersCache.filter(player => normalizeText(player.name).includes(search));
    let html = '';
    for (let i = 0; i < players.length; i++) {
        const level = players[i].values ? players[i].values.level : 1;
        const meClass = players[i].uid === authService.getUid() ? 'me' : '';
        html += playerCardTemplate(players[i], buildPlayerAvatar(players[i]), level, getPlayerRank(players[i]), meClass);
    }
    return html === '' ? topEmptyTemplate() : html;
}

function getPlayerRank(player) {
    const bestStreak = player.values ? player.values['best-streak'] || 0 : 0;
    return RANKS[profileService.getRankIndex(bestStreak)].title;
}

function findPlayer(uid) {
    const matches = playersCache.filter(player => player.uid === uid);
    return matches[0];
}

function showPlayerProfile(uid) {
    if (!findPlayer(uid)) {
        return showPlayers();
    }
    stopCurrentGame();
    setTheme('home');
    startOnlineView('profile', uid);
}

function renderPlayerProfile(uid) {
    const player = findPlayer(uid);
    if (!player) {
        return renderPlayers();
    }
    const avatarHtml = bodyTemplate(buildAvatarSvg(player.outfit || DEFAULT_OUTFIT, true), 'body-profile');
    const achievements = player.achievements || {};
    const achievementsHtml = buildAchievementCategories(achievements, false);
    const duelHtml = player.uid === authService.getUid() ? '' : duelButtonTemplate(player.uid);
    const favoritesHtml = buildFavoritesHtml(player.favorites || {}, achievements);
    showContent(playerProfileTemplate(player, avatarHtml, getPlayerRank(player), Object.keys(achievements).length, buildPlayerCompare(player), achievementsHtml, duelHtml, favoritesHtml));
}

function buildPlayerCompare(player) {
    const me = { ...buildPublicSummary(), uid: authService.getUid() };
    const isMe = me.uid === player.uid;
    let html = isMe ? '' : compareHeadRowTemplate(player.name, me.name);
    for (let i = 0; i < COMPARE_ROWS.length; i++) {
        const value = player.values ? player.values[COMPARE_ROWS[i].id] || 0 : 0;
        const myValue = me.values[COMPARE_ROWS[i].id] || 0;
        html += isMe ? compareRowTemplate(COMPARE_ROWS[i].label, compareCellTemplate(formatNumber(value), '')) : buildCompareRow(COMPARE_ROWS[i].label, value, myValue);
    }
    return html;
}

function buildCompareRow(label, value, myValue) {
    const valueClass = value > myValue ? 'best' : '';
    const myClass = myValue > value ? 'best' : '';
    return compareRowTemplate(label, compareCellTemplate(formatNumber(value), valueClass) + compareCellTemplate(formatNumber(myValue), myClass));
}

async function loadChampions() {
    const players = await syncService.loadPublicProfiles();
    const element = document.getElementById('champions');
    if (!players || !element) {
        return;
    }
    const yesterday = addDaysToKey(getDateKey(new Date()), -1);
    const monthKey = getMonthKey(new Date());
    const lastMonthKey = getPreviousMonthKey(new Date());
    const dayText = buildChampionText(findWinner(players, 'day', yesterday));
    const monthText = buildChampionText(findWinner(players, 'month', monthKey));
    const lastText = buildChampionText(findWinner(players, 'month', lastMonthKey));
    element.innerHTML = championsTemplate(dayText, getMonthName(monthKey), monthText, getMonthName(lastMonthKey), lastText);
}

function getPeriodPoints(player, type, key) {
    if (type === 'day') {
        const isYesterday = player.yesterdayDate === key ? player.yesterdayTotal : 0;
        return player.dailyDate === key ? player.dailyTotal : isYesterday;
    }
    const isLastMonth = player.lastMonthKey === key ? player.lastMonthPoints : 0;
    return player.monthKey === key ? player.monthPoints : isLastMonth;
}

function findWinner(players, type, key) {
    let winner = null;
    for (let i = 0; i < players.length; i++) {
        const points = getPeriodPoints(players[i], type, key) || 0;
        if (points > 0 && (!winner || points > winner.points)) {
            winner = { name: players[i].name, points: points };
        }
    }
    return winner;
}

function buildChampionText(winner) {
    return winner ? winner.name + ' (' + formatNumber(winner.points) + ' Punkte)' : 'noch niemand';
}
