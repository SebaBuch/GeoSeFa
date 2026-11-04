function duelSetupTemplate(player, gameOptionsHtml) {
    return `
        <section class="panel setup">
            <div class="title-row">
                <h1>Duell gegen ${player.name}</h1>
                <button class="back-button" onclick="showPlayers()">← Alle Spieler</button>
            </div>
            <p>Ihr bekommt genau dieselben Fragen. Wer mehr Punkte hat, gewinnt ${DUEL_WIN_COINS} Coins.</p>
            <label class="setting">Spiel
                <select id="duel-game">${gameOptionsHtml}</select>
            </label>
            <label class="setting">Art
                <select id="duel-mode">
                    <option value="live">Live – ihr spielt gleichzeitig</option>
                    <option value="challenge">Herausforderung – ${player.name} spielt später</option>
                </select>
            </label>
            <div class="button-row">
                <button class="button" onclick="createDuel()">Duell starten</button>
            </div>
        </section>
    `;
}

function duelWaitingTemplate(matchId, opponentName, gameTitle, minutes) {
    return `
        <section class="panel center">
            <h1>Warte auf ${opponentName}</h1>
            <div class="spinner"></div>
            <p id="duel-waiting-text">${opponentName} bekommt eine Einladung zu <b>${gameTitle}</b>. Die Einladung gilt ${minutes} Minuten. Sobald sie angenommen wird, geht es los.</p>
            <div class="button-row">
                <button class="button button-secondary" onclick="cancelDuelWaiting('${matchId}')">Abbrechen</button>
            </div>
        </section>
    `;
}

function duelPanelTemplate(gameTitle, me, opponent, opponentStatus, resultText, rematchHtml) {
    return `
        <span class="duel-panel-title">Duell · ${gameTitle}</span>
        <div class="duel-scores">
            <span class="duel-score"><span>${me.name} (du)</span><b>${me.score}</b></span>
            <span class="duel-vs">VS</span>
            <span class="duel-score"><span>${opponent.name}</span><b>${opponent.score}</b><small>${opponentStatus}</small></span>
        </div>
        <span class="duel-result">${resultText}</span>
        ${rematchHtml}
        <div class="duel-panel-buttons">
            <button class="link-button" onclick="showDuels()">Zu den Duellen</button>
            <button class="link-button" onclick="closeDuelPanel()">Ausblenden</button>
        </div>
    `;
}

function duelRematchTemplate(matchId) {
    return `<button class="button" onclick="rematchDuel('${matchId}')">Revanche</button>`;
}

function duelsPageTemplate(sectionsHtml) {
    return `
        <section class="panel">
            <div class="title-row">
                <h1>Duelle</h1>
                ${backButtonTemplate()}
            </div>
            <p>Fordere andere Spieler über die Spielerliste heraus. Sieg: +${DUEL_WIN_COINS} Coins, Unentschieden: +${DUEL_DRAW_COINS} Coins.</p>
            <div class="button-row">
                <button class="button" onclick="showPlayers()">Neues Duell</button>
                <button class="button button-secondary" onclick="showDuels()">Aktualisieren</button>
            </div>
            <div id="duel-sections">${sectionsHtml}</div>
        </section>
    `;
}

function duelSectionTemplate(title, itemsHtml) {
    return `
        <h2 class="profile-section-title">${title}</h2>
        <div class="duel-list">${itemsHtml}</div>
    `;
}

function duelItemTemplate(title, infoText, actionsHtml) {
    return `
        <div class="duel-item">
            <span class="duel-item-title">${title}</span>
            <span class="duel-item-info">${infoText}</span>
            <span class="duel-item-actions">${actionsHtml}</span>
        </div>
    `;
}

function duelInviteActionsTemplate(matchId) {
    return `
        <button class="button" onclick="acceptInvite('${matchId}')">Annehmen</button>
        <button class="button button-secondary" onclick="declineInvite('${matchId}')">Ablehnen</button>
    `;
}

function duelPlayActionTemplate(matchId) {
    return `<button class="button" onclick="playChallenge('${matchId}')">Jetzt spielen</button>`;
}

function inviteBannerTemplate(matchId, fromName, gameTitle) {
    return `
        <span><b>${fromName}</b> fordert dich live zu <b>${gameTitle}</b> heraus!</span>
        <button class="button" onclick="acceptInvite('${matchId}')">Annehmen</button>
        <button class="button button-secondary" onclick="declineInvite('${matchId}')">Ablehnen</button>
    `;
}
