function buildPublicSummary() {
    const profile = profileService.getCurrent();
    const values = {};
    for (let i = 0; i < COMPARE_ROWS.length; i++) {
        values[COMPARE_ROWS[i].id] = getCompareValue(profile, COMPARE_ROWS[i]);
    }
    const dailyResults = storageService.load('daily-' + getDateKey(new Date()), {});
    const daily = new DailyChallenge();
    return {
        name: profile.name, title: profile.title, frame: profile.frame, outfit: profile.outfit, values: values,
        dailyDate: getDateKey(new Date()), dailyTotal: daily.getTotal(dailyResults), dailyDone: daily.countDone(dailyResults), updatedAt: Date.now()
    };
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
    if (!players) {
        showContent(onlineErrorTemplate());
    }
    return players;
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
        const player = sorted[i].player;
        const meClass = player.uid === authService.getUid() ? 'me' : '';
        html += rankingRowTemplate(i + 1, buildPlayerAvatar(player), player.name, formatNumber(sorted[i].value) + suffix, meClass);
    }
    return html;
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

async function showCompare() {
    const players = await loadPlayers('Lade Profilvergleich ...');
    if (!players) {
        return;
    }
    let headHtml = '';
    for (let i = 0; i < players.length; i++) {
        headHtml += compareHeadTemplate(players[i], buildPlayerAvatar(players[i]));
    }
    showContent(compareTemplate(headHtml, buildCompareRows(players)));
}

function buildCompareRows(players) {
    let html = '';
    for (let i = 0; i < COMPARE_ROWS.length; i++) {
        const values = players.map(player => player.values ? player.values[COMPARE_ROWS[i].id] || 0 : 0);
        const best = Math.max(...values);
        let cellsHtml = '';
        for (let j = 0; j < values.length; j++) {
            cellsHtml += compareCellTemplate(formatNumber(values[j]), values[j] === best && best > 0 ? 'best' : '');
        }
        html += compareRowTemplate(COMPARE_ROWS[i].label, cellsHtml);
    }
    return html;
}
