function loginTemplate(avatarOptionsHtml, legacyHtml) {
    return `
        <section class="intro login-intro">
            <h1>Willkommen bei GeoSeFa</h1>
            <p>Melde dich an, damit dein Spielstand online gespeichert wird und du in der Rangliste mitspielst.</p>
        </section>
        <div class="login-layout">
            <section class="panel login-box">
                <h2>Anmelden</h2>
                <form class="login-form" onsubmit="submitLogin(event)">
                    <input id="login-email" type="email" placeholder="E-Mail" autocomplete="email">
                    <input id="login-password" type="password" placeholder="Passwort" autocomplete="current-password">
                    <button class="button" type="submit">Anmelden</button>
                </form>
                <button class="link-button" onclick="sendPasswordMail()">Passwort vergessen?</button>
                <div id="login-message" class="message"></div>
            </section>
            <section class="panel login-box">
                <h2>Konto erstellen</h2>
                <form class="login-form" onsubmit="submitRegister(event)">
                    <input id="register-name" maxlength="20" placeholder="Dein Name im Spiel" autocomplete="nickname">
                    <input id="register-email" type="email" placeholder="E-Mail" autocomplete="email">
                    <input id="register-password" type="password" placeholder="Passwort (mind. 6 Zeichen)" autocomplete="new-password">
                    ${legacyHtml}
                    <button class="button" type="submit">Konto erstellen</button>
                </form>
                <div id="register-message" class="message"></div>
                <h3 class="login-subtitle">Hautfarbe (alles andere später im Shop)</h3>
                <div id="start-avatars" class="profile-options">${avatarOptionsHtml}</div>
            </section>
        </div>
    `;
}

function legacySelectTemplate(optionsHtml) {
    return `
        <label class="setting">Bisherigen Spielstand übernehmen
            <select id="register-legacy">
                <option value="">Nein, neu anfangen</option>
                ${optionsHtml}
            </select>
        </label>
    `;
}

function onlineErrorTemplate() {
    return `
        <section class="panel center">
            <h1>Keine Verbindung</h1>
            <p>Die Online-Daten konnten nicht geladen werden. Prüfe deine Internetverbindung.</p>
            <div class="button-row">
                <button class="button" onclick="showHome()">Startseite</button>
            </div>
        </section>
    `;
}

function rankingTemplate(dailyHtml, listsHtml, playerCount) {
    return `
        <section class="panel">
            <div class="title-row">
                <h1>Rangliste</h1>
                ${backButtonTemplate()}
            </div>
            <p>${playerCount} Spieler · Gezeigt werden die Top 3. Bist du nicht dabei, siehst du deinen Platz darunter. Klick auf einen Spieler für sein Profil.</p>
            <span class="online-updated">Aktualisiert: <b id="online-updated">gerade eben</b> · lädt alle 30 Sekunden neu</span>
            <div class="top-lists">
                ${dailyHtml}
                ${listsHtml}
            </div>
        </section>
    `;
}

function rankingListTemplate(title, rowsHtml) {
    return `
        <div class="top-list">
            <h2>${title}</h2>
            ${rowsHtml}
        </div>
    `;
}

function rankingRowTemplate(uid, place, avatarHtml, name, valueText, meClass) {
    return `
        <div class="top-row ranking-row place-${place} ${meClass}" onclick="showPlayerProfile('${uid}')">
            <span class="top-place">${place}.</span>
            ${avatarHtml}
            <span class="ranking-name">${name}</span>
            <span class="top-score">${valueText}</span>
        </div>
    `;
}

function rankingGapTemplate() {
    return `<div class="ranking-gap">…</div>`;
}

function playersTemplate(cardsHtml, playerCount) {
    return `
        <section class="panel">
            <div class="title-row">
                <h1>Spieler</h1>
                ${backButtonTemplate()}
            </div>
            <p>${playerCount} Spieler angemeldet. Klick auf einen Spieler, um sein Profil zu sehen und dich zu vergleichen.</p>
            <span class="online-updated">Aktualisiert: <b id="online-updated">gerade eben</b> · lädt alle 30 Sekunden neu</span>
            <form class="guess-form" onsubmit="event.preventDefault()">
                <input id="player-search" placeholder="Spieler suchen ..." autocomplete="off" oninput="filterPlayers(this.value)">
            </form>
            <div id="player-cards" class="player-cards">${cardsHtml}</div>
        </section>
    `;
}

function playerCardTemplate(player, avatarHtml, level, rankTitle, meClass) {
    return `
        <button class="player-card ${meClass}" onclick="showPlayerProfile('${player.uid}')">
            ${avatarHtml}
            <span class="player-card-info">
                <b>${player.name}</b>
                <span>${player.title || ''}</span>
                <span>Level ${level} · ${rankTitle}</span>
            </span>
        </button>
    `;
}

function playerProfileTemplate(player, avatarHtml, rankTitle, achievementCount, compareHtml, achievementsHtml, duelButtonHtml, favoritesHtml) {
    return `
        <section class="panel">
            <div class="title-row">
                <h1>Profil von ${player.name}</h1>
                <button class="back-button" onclick="showPlayers()">← Alle Spieler</button>
            </div>
            ${duelButtonHtml}
            <span class="online-updated">Aktualisiert: <b id="online-updated">gerade eben</b> · lädt alle 30 Sekunden neu</span>
            <div class="profile-card">
                ${avatarHtml}
                <div class="profile-card-info">
                    <span class="profile-card-name">${player.name}</span>
                    <span class="profile-card-title">${player.title || ''}</span>
                    <span class="profile-rank">Rang: <b>${rankTitle}</b></span>
                    <span class="profile-level">Erfolge: ${achievementCount} / ${ACHIEVEMENTS.length}</span>
                </div>
            </div>
            ${favoritesHtml}
            <h2 class="profile-section-title">Rekorde</h2>
            <div class="compare-table">${compareHtml}</div>
            <h2 class="profile-section-title">Erfolge</h2>
            ${achievementsHtml}
        </section>
    `;
}

function compareHeadRowTemplate(playerName, myName) {
    return `
        <div class="compare-row compare-head">
            <span class="compare-label"></span>
            <span class="compare-cell"><b>${playerName}</b></span>
            <span class="compare-cell"><b>${myName} (du)</b></span>
        </div>
    `;
}

function compareRowTemplate(label, cellsHtml) {
    return `
        <div class="compare-row">
            <span class="compare-label">${label}</span>
            ${cellsHtml}
        </div>
    `;
}

function compareCellTemplate(value, className) {
    return `<span class="compare-cell ${className}">${value}</span>`;
}

function championsTemplate(dayText, monthName, monthText, lastMonthName, lastMonthText) {
    return `
        <span class="champion"><span class="champion-label">Tagessieger gestern</span><b>${dayText}</b></span>
        <span class="champion"><span class="champion-label">Führend im ${monthName}</span><b>${monthText}</b></span>
        <span class="champion"><span class="champion-label">Sieger im ${lastMonthName}</span><b>${lastMonthText}</b></span>
    `;
}

function duelButtonTemplate(uid) {
    return `<button class="button" onclick="showDuelSetup('${uid}')">Zum Duell herausfordern</button>`;
}

function renameTemplate() {
    return `
        <div class="login-layout">
            <section class="panel login-box">
                <h1>Neuer Name nötig</h1>
                <p>Dein bisheriger Name ist nicht erlaubt. Bitte wähl einen neuen Namen, dann kannst du weiterspielen. Dein Spielstand bleibt erhalten.</p>
                <form class="login-form" onsubmit="submitRename(event)">
                    <input id="rename-name" maxlength="20" placeholder="Neuer Name" autocomplete="nickname">
                    <button class="button" type="submit">Name speichern</button>
                </form>
                <div id="rename-message" class="message"></div>
            </section>
        </div>
    `;
}
