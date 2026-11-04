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
            <p>${playerCount} Spieler · Deine Zeile ist markiert. Die Werte werden nach jedem Spiel automatisch aktualisiert.</p>
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

function rankingRowTemplate(place, avatarHtml, name, valueText, meClass) {
    return `
        <div class="top-row ranking-row place-${place} ${meClass}">
            <span class="top-place">${place}.</span>
            ${avatarHtml}
            <span class="ranking-name">${name}</span>
            <span class="top-score">${valueText}</span>
        </div>
    `;
}

function compareTemplate(headHtml, rowsHtml) {
    return `
        <section class="panel">
            <div class="title-row">
                <h1>Profilvergleich</h1>
                ${backButtonTemplate()}
            </div>
            <div class="compare-table">
                <div class="compare-row compare-head">
                    <span class="compare-label"></span>
                    ${headHtml}
                </div>
                ${rowsHtml}
            </div>
        </section>
    `;
}

function compareHeadTemplate(player, avatarHtml) {
    return `
        <span class="compare-cell compare-profile">
            ${avatarHtml}
            <b>${player.name}</b>
        </span>
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
