function statsPageTemplate(tilesHtml, gameRowsHtml, continentRowsHtml, mistakeRowsHtml) {
    return `
        <section class="panel">
            <div class="title-row">
                <h1>Statistik</h1>
                ${backButtonTemplate()}
            </div>
            <div class="stat-tiles">${tilesHtml}</div>
            <h2 class="profile-section-title">Spiele</h2>
            <div class="stat-table">
                <div class="stat-row stat-head">
                    <span class="stat-name">Spiel</span>
                    <span class="stat-cell">Gespielt</span>
                    <span class="stat-cell">Gewonnen</span>
                    <span class="stat-cell">Highscore</span>
                    <span class="stat-cell">Beste Serie</span>
                </div>
                ${gameRowsHtml}
            </div>
            <div class="stat-columns">
                <div class="stat-column">
                    <h2 class="profile-section-title">Trefferquote nach Kontinent</h2>
                    <p class="settings-hint">Gezählt werden Antworten aus Quiz und Blitzrunde.</p>
                    ${continentRowsHtml}
                </div>
                <div class="stat-column">
                    <h2 class="profile-section-title">Deine häufigsten Fehler</h2>
                    <p class="settings-hint">Jede richtige Antwort im Quiz streicht einen Fehler wieder.</p>
                    ${mistakeRowsHtml}
                </div>
            </div>
        </section>
    `;
}

function statTileTemplate(label, value) {
    return `
        <div class="stat-tile">
            <span class="stat-value">${value}</span>
            <span class="stat-label">${label}</span>
        </div>
    `;
}

function statGameRowTemplate(title, played, won, highscore, bestStreak) {
    return `
        <div class="stat-row">
            <span class="stat-name">${title}</span>
            <span class="stat-cell">${played}</span>
            <span class="stat-cell">${won}</span>
            <span class="stat-cell">${highscore}</span>
            <span class="stat-cell">${bestStreak}</span>
        </div>
    `;
}

function statContinentRowTemplate(continent, percent, percentText, total) {
    return `
        <div class="stat-bar-row">
            <span class="stat-bar-label">${continent}</span>
            <span class="stat-bar"><span class="stat-bar-fill" style="width: ${percent}%"></span></span>
            <span class="stat-bar-value">${percentText} <small>(${total})</small></span>
        </div>
    `;
}

function statMistakeRowTemplate(country, count) {
    return `
        <div class="stat-bar-row">
            <span class="stat-bar-label"><img class="stat-flag" src="${country.flag}" alt="">${country.name}</span>
            <span class="stat-bar-value">${count}× falsch</span>
        </div>
    `;
}
