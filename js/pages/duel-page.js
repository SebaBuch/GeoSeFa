let duelSession = null;
let duelOpponent = null;
let duelWaitingId = null;
let inviteWatcherId = null;

function getDuelGame(key) {
    const matches = DUEL_GAMES.filter(game => game.key === key);
    return matches[0];
}

function showDuelSetup(uid) {
    const player = findPlayer(uid);
    if (!player) {
        return showPlayers();
    }
    duelOpponent = player;
    stopCurrentGame();
    setTheme('home');
    showContent(duelSetupTemplate(player, buildDuelGameOptions()));
}

function buildDuelGameOptions() {
    let html = '';
    for (let i = 0; i < DUEL_GAMES.length; i++) {
        html += selectOptionTemplate(DUEL_GAMES[i].key, DUEL_GAMES[i].title);
    }
    return html;
}

async function createDuel() {
    const gameKey = readValue('duel-game');
    const mode = readValue('duel-mode');
    showContent(loadingTemplate('Erstelle Duell ...'));
    const match = await duelService.createMatch(duelOpponent, gameKey, mode);
    if (!match) {
        return showContent(onlineErrorTemplate());
    }
    if (mode === 'live') {
        showDuelWaiting(match);
    } else {
        startDuelGame(match);
    }
}

function showDuelWaiting(match) {
    const opponentName = match.players[duelService.getOpponentUid(match)].name;
    showContent(duelWaitingTemplate(match.id, opponentName, getDuelGame(match.game).title, DUEL_INVITE_MINUTES));
    stopDuelWaiting();
    duelWaitingId = setInterval(() => checkDuelWaiting(match.id), 2000);
}

function stopDuelWaiting() {
    clearInterval(duelWaitingId);
    duelWaitingId = null;
}

async function checkDuelWaiting(id) {
    const match = await duelService.getMatch(id);
    if (!match || duelWaitingId === null) {
        return;
    }
    if (match.status === 'running') {
        stopDuelWaiting();
        return startDuelGame(match);
    }
    if (match.status === 'declined' || duelService.isExpired(match)) {
        await endDuelWaiting(match);
    }
}

async function endDuelWaiting(match) {
    stopDuelWaiting();
    const isDeclined = match.status === 'declined';
    await duelService.setStatus(match.id, isDeclined ? 'declined' : 'expired');
    document.getElementById('duel-waiting-text').innerHTML = isDeclined ? 'Die Einladung wurde abgelehnt.' : 'Die Einladung ist abgelaufen.';
}

async function cancelDuelWaiting(id) {
    stopDuelWaiting();
    await duelService.setStatus(id, 'cancelled');
    showDuels();
}

function startDuelGame(match) {
    stopCurrentGame();
    closeDuelPanel();
    const config = getDuelGame(match.game);
    setTheme(config.game);
    const game = createGame(config.game);
    game.seeded = new SeededRandom(match.id);
    duelSession = new DuelSession(match, duelService);
    game.duel = duelSession;
    currentGame = game;
    launchDuelGame(game, config);
    duelSession.start();
}

function launchDuelGame(game, config) {
    if (config.category) {
        game.chooseCategory(config.category);
    } else {
        game.start();
    }
}

function renderDuelPanel(match, outcome) {
    const uid = authService.getUid();
    const me = match.players[uid];
    const opponent = match.players[duelService.getOpponentUid(match)];
    const config = getDuelGame(match.game);
    const opponentStatus = opponent.finished ? 'fertig' : 'spielt noch';
    const panel = document.getElementById('duel-panel');
    panel.innerHTML = duelPanelTemplate(config.title, me, opponent, opponentStatus, getOutcomeText(outcome, me, opponent));
    panel.classList.remove('hidden');
}

function getOutcomeText(outcome, me, opponent) {
    if (outcome === 'win') {
        return 'Du hast gewonnen! +' + DUEL_WIN_COINS + ' Coins';
    }
    if (outcome === 'draw') {
        return 'Unentschieden! +' + DUEL_DRAW_COINS + ' Coins';
    }
    if (outcome === 'loss') {
        return opponent.name + ' hat gewonnen.';
    }
    return me.finished ? 'Warte auf ' + opponent.name + ' ...' : '';
}

function closeDuelPanel() {
    document.getElementById('duel-panel').classList.add('hidden');
    if (duelSession) {
        duelSession.stopPolling();
    }
}

function rewardDuel(match, outcome) {
    const results = storageService.load('duel-results', {});
    if (results[match.id]) {
        return;
    }
    results[match.id] = outcome;
    storageService.save('duel-results', results);
    payDuelReward(outcome);
}

function payDuelReward(outcome) {
    achievementService.increase('duels-played', 1);
    if (outcome === 'win') {
        achievementService.increase('duel-wins', 1);
        profileService.addCoins(DUEL_WIN_COINS);
    } else if (outcome === 'draw') {
        profileService.addCoins(DUEL_DRAW_COINS);
    }
}

async function showDuels() {
    if (!profileService.hasProfile()) {
        return;
    }
    stopCurrentGame();
    setTheme('home');
    showContent(loadingTemplate('Lade Duelle ...'));
    const entries = await duelService.loadInbox();
    const matches = await duelService.loadMatches(entries);
    showContent(duelsPageTemplate(buildDuelSections(matches)));
}

function buildDuelSections(matches) {
    const groups = { invites: '', toPlay: '', waiting: '', results: '' };
    for (let i = 0; i < matches.length; i++) {
        const group = getDuelGroup(matches[i]);
        groups[group] += buildDuelItem(matches[i], group);
    }
    let html = duelSectionTemplate('Einladungen', groups.invites || topEmptyTemplate());
    html += duelSectionTemplate('Deine Herausforderungen', groups.toPlay || topEmptyTemplate());
    html += duelSectionTemplate('Warten auf den Gegner', groups.waiting || topEmptyTemplate());
    return html + duelSectionTemplate('Ergebnisse', groups.results || topEmptyTemplate());
}

function getDuelGroup(match) {
    const me = match.players[authService.getUid()];
    const isMine = match.createdBy === authService.getUid();
    if (match.status === 'invited' && !duelService.isExpired(match)) {
        return isMine ? 'waiting' : 'invites';
    }
    if (match.status !== 'running') {
        return 'results';
    }
    if (!me.finished) {
        return 'toPlay';
    }
    return duelService.getOutcome(match) === '' ? 'waiting' : 'results';
}

function buildDuelItem(match, group) {
    const opponent = match.players[duelService.getOpponentUid(match)];
    const title = getDuelGame(match.game).title + ' gegen ' + opponent.name;
    const modeText = match.mode === 'live' ? 'Live' : 'Herausforderung';
    if (group === 'invites') {
        return duelItemTemplate(title, modeText, duelInviteActionsTemplate(match.id));
    }
    if (group === 'toPlay') {
        return duelItemTemplate(title, modeText, duelPlayActionTemplate(match.id));
    }
    return duelItemTemplate(title, getDuelStateText(match, opponent), '');
}

function getDuelStateText(match, opponent) {
    const outcome = duelService.getOutcome(match);
    const me = match.players[authService.getUid()];
    if (outcome !== '') {
        rewardDuel(match, outcome);
        return DUEL_OUTCOME_LABELS[outcome] + ' · ' + me.score + ' : ' + opponent.score;
    }
    return DUEL_STATUS_TEXTS[match.status] || (me.finished ? 'Du: ' + me.score + ' · ' + opponent.name + ' spielt noch' : 'Wartet auf Annahme');
}

async function acceptInvite(id) {
    const match = await duelService.getMatch(id);
    hideInviteBanner();
    if (!match || match.status !== 'invited' || duelService.isExpired(match)) {
        return showDuels();
    }
    await duelService.setStatus(id, 'running');
    startDuelGame({ ...match, status: 'running' });
}

async function declineInvite(id) {
    hideInviteBanner();
    await duelService.setStatus(id, 'declined');
    if (document.getElementById('duel-sections')) {
        showDuels();
    }
}

async function playChallenge(id) {
    const match = await duelService.getMatch(id);
    if (match) {
        startDuelGame(match);
    }
}

function startInviteWatcher() {
    clearInterval(inviteWatcherId);
    inviteWatcherId = setInterval(() => checkInvites(), 10000);
    checkInvites();
}

async function checkInvites() {
    if (!authService.isLoggedIn() || !profileService.hasProfile()) {
        return clearInterval(inviteWatcherId);
    }
    const entries = await duelService.loadInbox();
    const fresh = entries.filter(entry => entry.mode === 'live' && entry.fromUid !== authService.getUid() && Date.now() - entry.createdAt < DUEL_INVITE_MINUTES * 60000);
    const match = fresh.length > 0 ? await duelService.getMatch(fresh[0].id) : null;
    if (match && match.status === 'invited') {
        showInviteBanner(match, fresh[0].fromName);
    } else {
        hideInviteBanner();
    }
}

function showInviteBanner(match, fromName) {
    const banner = document.getElementById('invite-banner');
    banner.innerHTML = inviteBannerTemplate(match.id, fromName, getDuelGame(match.game).title);
    banner.classList.remove('hidden');
}

function hideInviteBanner() {
    document.getElementById('invite-banner').classList.add('hidden');
}
