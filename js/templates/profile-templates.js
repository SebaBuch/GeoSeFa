function avatarTemplate(svgHtml, frame, sizeClass) {
    return `
        <span class="avatar-frame frame-${frame} ${sizeClass}">
            <span class="avatar">${svgHtml}</span>
        </span>
    `;
}

function profileChipTemplate(avatarHtml, name, level, coins) {
    return `
        ${avatarHtml}
        <span class="profile-chip-name">${name}</span>
        <span class="profile-chip-level">Lv. ${level}</span>
        <span class="profile-chip-coins"><span class="coin-icon"></span>${coins}</span>
    `;
}

function levelToastTemplate(toastId, level, rewardText) {
    return `
        <div id="${toastId}" class="toast toast-level">
            <span class="toast-label">Level aufgestiegen!</span>
            <span class="toast-title">Level ${level}</span>
            <span class="toast-text">Neu: ${rewardText}</span>
        </div>
    `;
}

function startAvatarTemplate(item, avatarHtml, selectedClass) {
    return `
        <button class="profile-option ${selectedClass}" onclick="selectStartAvatar('${item.id}')">
            ${avatarHtml}
            <span class="profile-option-label">${item.name}</span>
        </button>
    `;
}

function settingsTemplate(percent) {
    return `
        <h2 class="profile-section-title">Einstellungen</h2>
        <div class="settings-row">
            <label class="setting volume-setting">Lautstärke: <span id="volume-value">${percent} %</span>
                <input type="range" min="0" max="100" value="${percent}" oninput="changeVolume(this.value)">
            </label>
            <button class="button button-secondary" onclick="testSound()">Ton testen</button>
        </div>
    `;
}

function accountTemplate(email) {
    return `
        <div class="account-row">
            <span>Angemeldet als <b>${email}</b>. Dein Spielstand wird automatisch online gespeichert.</span>
            <button class="button button-secondary" onclick="logout()">Abmelden</button>
            <button class="button button-danger" onclick="showDeleteAccount()">Konto löschen</button>
        </div>
        <div id="delete-area"></div>
    `;
}

function deleteAccountTemplate() {
    return `
        <div class="delete-box">
            <h3>Konto wirklich löschen?</h3>
            <p>Dein Spielstand, deine Erfolge, Coins und dein Eintrag in der Rangliste werden <b>endgültig</b> gelöscht. Danach ist deine E-Mail-Adresse wieder frei. Das kann nicht rückgängig gemacht werden.</p>
            <form class="login-form" onsubmit="confirmDeleteAccount(event)">
                <input id="delete-password" type="password" placeholder="Zur Bestätigung dein Passwort" autocomplete="current-password">
                <div class="button-row">
                    <button class="button button-danger" type="submit">Endgültig löschen</button>
                    <button class="button button-secondary" type="button" onclick="hideDeleteAccount()">Abbrechen</button>
                </div>
            </form>
            <div id="delete-message" class="message"></div>
        </div>
    `;
}

function profilePageTemplate(cardHtml, sectionsHtml, accountHtml, settingsHtml) {
    return `
        <section class="panel">
            <div class="title-row">
                <h1>Profil</h1>
                ${backButtonTemplate()}
            </div>
            ${cardHtml}
            <div class="button-row">
                <button class="button" onclick="showShop()">Avatar &amp; Shop</button>
                <button class="button" onclick="showLeaderboard()">Meine Bestenliste</button>
                <button class="button" onclick="showRanking()">Rangliste</button>
                <button class="button" onclick="showPlayers()">Spieler</button>
                <button class="button" onclick="showDuels()">Duelle</button>
                <button class="button" onclick="showAchievements()">Erfolge</button>
                <button class="button" onclick="showStats()">Statistik</button>
            </div>
            ${sectionsHtml}
            ${settingsHtml}
            <h2 class="profile-section-title">Konto</h2>
            ${accountHtml}
        </section>
    `;
}

function profileCardTemplate(profile, avatarHtml, rankTitle, rankText, level, percent, xpText) {
    return `
        <div class="profile-card">
            ${avatarHtml}
            <div class="profile-card-info">
                <span class="profile-card-name">${profile.name}</span>
                <span class="profile-card-title">${profile.title}</span>
                <span class="profile-rank">Rang: <b>${rankTitle}</b></span>
                <span class="profile-rank-text">${rankText}</span>
                <span class="profile-level">Level ${level}</span>
                <div class="xp-bar"><div class="xp-fill" style="width: ${percent}%"></div></div>
                <span class="profile-xp-text">${xpText}</span>
            </div>
        </div>
    `;
}

function profileSectionTemplate(title, optionsHtml) {
    return `
        <h2 class="profile-section-title">${title}</h2>
        <div class="profile-options">${optionsHtml}</div>
    `;
}

function profileOptionTemplate(option, previewHtml, selectedClass) {
    return `
        <button class="profile-option ${selectedClass}" onclick="chooseProfileOption('${option.type}', '${option.value}')">
            ${previewHtml}
            <span class="profile-option-label">${option.label}</span>
        </button>
    `;
}

function profileOptionLockedTemplate(option, previewHtml, lockText) {
    return `
        <div class="profile-option locked">
            ${previewHtml}
            <span class="profile-option-label">${option.label}</span>
            <span class="profile-option-lock">${lockText}</span>
        </div>
    `;
}

function themePreviewTemplate(theme) {
    return `<span class="theme-preview preview-${theme}"></span>`;
}

function leaderboardTemplate(listsHtml) {
    return `
        <section class="panel">
            <div class="title-row">
                <h1>Meine Bestenliste</h1>
                ${backButtonTemplate()}
            </div>
            <p>Deine 10 besten Ergebnisse pro Spiel. Tages-Aufgaben zählen nur in der Tages-Challenge-Liste.</p>
            <div class="top-lists">${listsHtml}</div>
        </section>
    `;
}

function topListTemplate(title, rowsHtml) {
    return `
        <div class="top-list">
            <h2>${title}</h2>
            ${rowsHtml}
        </div>
    `;
}

function topRowTemplate(place, scoreText, detail, dateText) {
    return `
        <div class="top-row place-${place}">
            <span class="top-place">${place}.</span>
            <span class="top-score">${scoreText}</span>
            <span class="top-detail">${detail}</span>
            <span class="top-date">${dateText}</span>
        </div>
    `;
}

function topEmptyTemplate() {
    return `<p class="top-empty">Noch keine Einträge.</p>`;
}

