function loadingTemplate(text) {
    return `
        <section class="panel center">
            <div class="spinner"></div>
            <p>${text}</p>
        </section>
    `;
}

function errorTemplate(text) {
    return `
        <section class="panel">
            <h1>Etwas ist schiefgelaufen</h1>
            <p class="message error">${text}</p>
            <ul class="hint-list">
                <li>API-Key steht in <code>js/config.js</code> und ist für diese Adresse (z. B. 127.0.0.1) freigeschaltet.</li>
                <li>Leaflet liegt in <code>libs/leaflet/</code> (leaflet.js und leaflet.css).</li>
                <li>Die Umrisse liegen als <code>data/countries.geojson</code> im Projekt.</li>
                <li>Das Projekt läuft über Live Server und nicht per Doppelklick auf die Datei.</li>
            </ul>
            <button class="button" onclick="loadData(true)">Erneut versuchen</button>
        </section>
    `;
}

function homeTemplate(gameCardsHtml, quizCardsHtml, countryCount) {
    return `
        <section class="intro">
            <span class="intro-badge">Ohne Tageslimit</span>
            <h1>Willkommen bei GeoSeFa</h1>
            <p>Geografie-Spiele und Quiz für zwischendurch. Spiel, so oft du willst.</p>
        </section>
        <h2 class="section-title">Spiele</h2>
        <section class="card-list">${gameCardsHtml}</section>
        <h2 class="section-title">Quiz</h2>
        <section class="card-list">${quizCardsHtml}</section>
        <footer class="home-footer">
            <span>${countryCount} Länder geladen</span>
            <div class="footer-links">
                <button class="link-button" onclick="reloadData()">Länderdaten neu laden</button>
                <button class="link-button" onclick="showImpressum()">Impressum</button>
            </div>
        </footer>
    `;
}

function gameCardTemplate(game, statsText) {
    return `
        <button class="card card-${game.key}" onclick="startGame('${game.key}')">
            <span class="card-title">${game.title}</span>
            <span class="card-text">${game.description}</span>
            <span class="card-stats">${statsText}</span>
            <span class="card-play">Spielen →</span>
        </button>
    `;
}

function quizCardTemplate(category) {
    return `
        <button class="card card-quiz card-${category.key}" onclick="showQuizSetup('${category.key}')">
            <span class="card-title">${category.title}</span>
            <span class="card-text">${category.description}</span>
            <span class="card-play">Zum Quiz →</span>
        </button>
    `;
}

function quizSetupTemplate(title, modeOptionsHtml, regionOptionsHtml) {
    return `
        <section class="panel setup">
            <h1>Quiz: ${title}</h1>
            <label class="setting">Spielmodus
                <select id="setting-mode" onchange="updateQuizBest()">${modeOptionsHtml}</select>
            </label>
            <label class="setting">Region
                <select id="setting-region" onchange="updateQuizBest()">${regionOptionsHtml}</select>
            </label>
            <label class="setting">Anzahl Länder
                <select id="setting-amount" onchange="updateQuizBest()">
                    <option value="25">25 %</option>
                    <option value="50">50 %</option>
                    <option value="75">75 %</option>
                    <option value="100">100 %</option>
                </select>
            </label>
            <label class="setting">Zeitlimit
                <select id="setting-time">
                    <option value="0">Ohne Limit</option>
                    <option value="5">5 Minuten</option>
                    <option value="10">10 Minuten</option>
                    <option value="15">15 Minuten</option>
                </select>
            </label>
            <div id="quiz-best" class="quiz-best"></div>
            <div class="button-row">
                <button class="button" onclick="startQuiz()">Quiz starten</button>
                <button class="button button-secondary" onclick="showHome()">Zurück</button>
            </div>
        </section>
    `;
}

function selectOptionTemplate(value, label) {
    return `<option value="${value}">${label}</option>`;
}

function quizBestTemplate(played, bestPercent, bestTime) {
    return `
        <span>Gespielt: ${played}</span>
        <span>Bestes Ergebnis: ${bestPercent} %</span>
        <span>Zeit dafür: ${bestTime}</span>
    `;
}

function impressumTemplate() {
    return `
        <section class="panel legal">
            <div class="title-row">
                <h1>Impressum</h1>
                ${backButtonTemplate()}
            </div>

            <h2>Angaben gemäß § 5 DDG</h2>
            <p>
                Sebastian Buchholz<br>
                Bahnweg 6a<br>
                53773 Hennef
            </p>

            <h2>Kontakt</h2>
            <p>E-Mail: <a href="mailto:sebastian.buchholz98@gmail.com">sebastian.buchholz98@gmail.com</a></p>

            <h2>Hinweis</h2>
            <p>GeoSeFa ist ein privates, nicht-kommerzielles Hobbyprojekt. Es gibt keine Werbung und keine Bezahlinhalte.</p>

            <h2>Quellen</h2>
            <ul class="legal-list">
                <li>Länderdaten und Flaggen: <a href="https://restcountries.com" target="_blank">REST Countries</a></li>
                <li>Länderumrisse: <a href="https://www.naturalearthdata.com" target="_blank">Natural Earth</a> (gemeinfrei)</li>
                <li>Karte: <a href="https://leafletjs.com" target="_blank">Leaflet</a> (BSD-2-Clause-Lizenz)</li>
            </ul>
        </section>
    `;
}
