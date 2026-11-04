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

function profileCreateTemplate(avatarOptionsHtml, cancelHtml) {
    return `
        <section class="panel profile-create">
            <h1>Profil erstellen</h1>
            <p>Dein Profil wird nur in diesem Browser gespeichert. Jedes Profil hat eigene Erfolge, XP und Rekorde.</p>
            <form class="guess-form" onsubmit="createProfile(event)">
                <input id="profile-name" maxlength="20" placeholder="Dein Name" autocomplete="off">
                <button class="button" type="submit">Profil erstellen</button>
            </form>
            <div id="message" class="message"></div>
            <h2 class="profile-section-title">Wähle deine Hautfarbe</h2>
            <p>Frisur, Kleidung und mehr kannst du danach im Shop ändern.</p>
            <div id="start-avatars" class="profile-options">${avatarOptionsHtml}</div>
            ${cancelHtml}
        </section>
    `;
}

function profileCancelTemplate() {
    return `
        <div class="button-row">
            <button class="button button-secondary" onclick="showProfile()">Abbrechen</button>
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
        <h2 class="profile-section-title">Einstellungen &amp; Sicherung</h2>
        <div class="settings-row">
            <label class="setting volume-setting">Lautstärke: <span id="volume-value">${percent} %</span>
                <input type="range" min="0" max="100" value="${percent}" oninput="changeVolume(this.value)">
            </label>
            <button class="button button-secondary" onclick="testSound()">Ton testen</button>
        </div>
        <div class="settings-row">
            <button class="button" onclick="exportProfile()">Profil sichern</button>
            <label class="button button-secondary">Profil laden
                <input class="hidden" type="file" accept=".json,application/json" onchange="importProfile(this)">
            </label>
        </div>
        <p class="settings-hint">„Profil sichern“ lädt eine Datei mit allem herunter (Coins, Erfolge, Rekorde, Avatar). Mit „Profil laden“ holst du es zurück, auch auf einem anderen Gerät.</p>
        <div id="settings-message" class="message"></div>
    `;
}

function profilePageTemplate(cardHtml, sectionsHtml, profileListHtml, settingsHtml) {
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
                <button class="button" onclick="showCompare()">Profilvergleich</button>
                <button class="button" onclick="showAchievements()">Erfolge</button>
            </div>
            ${sectionsHtml}
            <h2 class="profile-section-title">Profile auf diesem Gerät</h2>
            <div class="profile-list">${profileListHtml}</div>
            ${settingsHtml}
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

function profileOptionLockedTemplate(option, previewHtml) {
    return `
        <div class="profile-option locked">
            ${previewHtml}
            <span class="profile-option-label">${option.label}</span>
            <span class="profile-option-lock">ab Level ${option.level}</span>
        </div>
    `;
}

function themePreviewTemplate(theme) {
    return `<span class="theme-preview preview-${theme}"></span>`;
}

function profileListItemTemplate(profile, avatarHtml, level) {
    return `
        <button class="profile-list-item" onclick="switchProfile('${profile.id}')">
            ${avatarHtml}
            <span>${profile.name} · Level ${level}</span>
        </button>
    `;
}

function profileListCurrentTemplate(profile, avatarHtml, level) {
    return `
        <div class="profile-list-item current">
            ${avatarHtml}
            <span>${profile.name} · Level ${level} (aktiv)</span>
        </div>
    `;
}

function profileNewButtonTemplate() {
    return `<button class="profile-list-item new" onclick="showProfileCreate()">+ Neues Profil</button>`;
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

function compareTemplate(headHtml, rowsHtml, hintHtml) {
    return `
        <section class="panel">
            <div class="title-row">
                <h1>Profilvergleich</h1>
                ${backButtonTemplate()}
            </div>
            ${hintHtml}
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

function compareHeadTemplate(profile, avatarHtml) {
    return `
        <span class="compare-cell compare-profile">
            ${avatarHtml}
            <b>${profile.name}</b>
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

function compareHintTemplate() {
    return `<p class="message">Auf diesem Gerät gibt es nur ein Profil. Lege über die Profilseite ein zweites an (oder lade die Sicherung deines Bruders), um zu vergleichen.</p>`;
}
