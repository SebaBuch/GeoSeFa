const RANKING_TOP_COUNT = 3;
let playersCache = [];

function buildPublicSummary() {
    const profile = profileService.getCurrent();
    const values = {};
    for (let i = 0; i < COMPARE_ROWS.length; i++) {
        values[COMPARE_ROWS[i].id] = getCompareValue(profile, COMPARE_ROWS[i]);
    }
    const summary = { name: profile.name, title: profile.title, frame: profile.frame, outfit: profile.outfit, values: values };
    return { ...summary, ...getDailySummary(), achievements: storageService.load('achievements', {}), updatedAt: Date.now() };
}

function getDailySummary() {
    const dailyResults = storageService.load('daily-' + getDateKey(new Date()), {});
    const daily = new DailyChallenge();
    return { dailyDate: getDateKey(new Date()), dailyTotal: daily.getTotal(dailyResults), dailyDone: daily.countDone(dailyResults) };
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
    const players = await loadPlayers('Lade Rangliste ...');
    if (!players) {
        return;
    }
    achievementService.unlockIf(players.length >= 4, 'hidden-family');
    showContent(rankingTemplate(buildDailyRanking(players), buildRankingLists(players), players.length));
}

function buildDailyRanking(players) {
    const today = getDateKey(new Date());
    const playedToday = players.filter(player => player.dailyDate === today && player.dailyDone > 0);
    const entries = playedToday.map(player => ({ player: player, value: player.dailyTotal }));
    return rankingListTemplate('Tages-Challenge heute', buildRankingRows(entries, ' / 300'));
}

function buildRankingLists(players) {
    let html = '';
    for (let i = 0; i < COMPARE_ROWS.length; i++) {
        const row = COMPARE_ROWS[i];
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
    const players = await loadPlayers('Lade Spieler ...');
    if (players) {
        showContent(playersTemplate(buildPlayerCards(''), players.length));
    }
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
    const player = findPlayer(uid);
    if (!player) {
        return showPlayers();
    }
    stopCurrentGame();
    setTheme('home');
    const avatarHtml = bodyTemplate(buildAvatarSvg(player.outfit || DEFAULT_OUTFIT, true), 'body-profile');
    const achievements = player.achievements || {};
    const achievementsHtml = buildAchievementCategories(achievements, false);
    showContent(playerProfileTemplate(player, avatarHtml, getPlayerRank(player), Object.keys(achievements).length, buildPlayerCompare(player), achievementsHtml));
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
