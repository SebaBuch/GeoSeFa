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

function homeTemplate(dailyCardHtml, gameCardsHtml, quizCardsHtml, countryCount) {
    return `
        <section class="intro">
            <span class="intro-badge">Ohne Tageslimit</span>
            <h1>Willkommen bei GeoSeFa</h1>
            <p>Geografie-Spiele und Quiz für zwischendurch. Spiel, so oft du willst.</p>
            <div class="intro-buttons">
                <button class="intro-button" onclick="showRanking()">Rangliste</button>
                <button class="intro-button" onclick="showCompare()">Profilvergleich</button>
            </div>
        </section>
        ${dailyCardHtml}
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

function dailyCardTemplate(doneCount, total, streakText) {
    return `
        <button class="daily-card" onclick="showDaily()">
            <span class="daily-card-badge">Jeden Tag neu</span>
            <span class="daily-card-title">Tages-Challenge</span>
            <span class="daily-card-text">Heute erledigt: <b>${doneCount} / 3</b> · Punkte: <b>${total} / 300</b> · Serie: <b>${streakText}</b></span>
            <span class="card-play">Zur Challenge →</span>
        </button>
    `;
}

function dailyTemplate(dateText, tasksHtml, total, streakText, calendarHtml) {
    return `
        <section class="panel">
            <div class="title-row">
                <h1>Tages-Challenge vom ${dateText}</h1>
                ${backButtonTemplate()}
            </div>
            <p>Drei Aufgaben, jede einmal pro Tag. Alle Spieler bekommen am selben Tag dieselben Aufgaben. Wer eine Aufgabe startet und abbricht, bekommt dafür 0 Punkte.</p>
            <div class="status-row">
                <span>Punkte heute: <b>${total} / 300</b></span>
                <span>Serie: <b>${streakText}</b></span>
            </div>
            <div class="daily-tasks">${tasksHtml}</div>
            <div class="button-row">
                <button class="button" onclick="currentGame.copyResult()">Ergebnis kopieren</button>
            </div>
            <div class="center-text">
                <div id="message" class="message"></div>
            </div>
            <h2 class="daily-calendar-title">Die letzten 14 Tage</h2>
            <div class="daily-calendar">${calendarHtml}</div>
        </section>
    `;
}

function dailyTaskOpenTemplate(task) {
    return `
        <button class="daily-task daily-task-${task.key}" onclick="currentGame.startTask('${task.key}')">
            <span class="daily-task-title">${task.title}</span>
            <span class="daily-task-text">${task.description}</span>
            <span class="card-play">Jetzt spielen →</span>
        </button>
    `;
}

function dailyTaskDoneTemplate(task, score) {
    return `
        <div class="daily-task daily-task-${task.key} done">
            <span class="daily-task-title">${task.title}</span>
            <span class="daily-task-text">Heute schon gespielt</span>
            <span class="daily-task-score">${score} / 100</span>
        </div>
    `;
}

function dailyDayTemplate(dateText, totalText, className) {
    return `
        <div class="daily-day ${className}">
            <span class="daily-day-date">${dateText}</span>
            <span class="daily-day-total">${totalText}</span>
        </div>
    `;
}

function dailyEndTemplate(text, score) {
    return `
        <div class="end-box">
            <p><b>${text}</b></p>
            <p class="big-number">${score} / 100 Punkte</p>
            <div class="button-row">
                <button class="button" onclick="showDaily()">Zur Tages-Challenge</button>
            </div>
        </div>
    `;
}

function dailyResultPageTemplate(title, text, score) {
    return `
        <section class="panel center">
            <h1>${title} beendet</h1>
            <p>${text}</p>
            <p class="big-number">${score} / 100 Punkte</p>
            <div class="button-row">
                <button class="button" onclick="showDaily()">Zur Tages-Challenge</button>
            </div>
        </section>
    `;
}

function achievementToastTemplate(toastId, achievement) {
    return `
        <div id="${toastId}" class="toast toast-${achievement.tier}">
            <span class="toast-label">Erfolg freigeschaltet!</span>
            <span class="toast-title">${achievement.title}</span>
            <span class="toast-text">${achievement.description}</span>
        </div>
    `;
}

function achievementsPageTemplate(unlockedCount, total, categoriesHtml) {
    return `
        <section class="panel">
            <div class="title-row">
                <h1>Erfolge</h1>
                ${backButtonTemplate()}
            </div>
            <p class="achievement-summary">Freigeschaltet: <b>${unlockedCount} / ${total}</b></p>
            ${categoriesHtml}
        </section>
    `;
}

function achievementCategoryTemplate(title, unlockedCount, total, itemsHtml) {
    return `
        <h2 class="achievement-category">${title} <span>${unlockedCount} / ${total}</span></h2>
        <div class="achievement-list">${itemsHtml}</div>
    `;
}

function achievementItemTemplate(achievement, className, statusText) {
    return `
        <div class="achievement ${className}">
            <span class="achievement-tier">${statusText}</span>
            <span class="achievement-title">${achievement.title}</span>
            <span class="achievement-text">${achievement.description}</span>
        </div>
    `;
}

function mistakeCountTemplate(count) {
    return `<span class="mistake-info">In deiner Fehlerliste: <b>${count}</b> (jede richtige Antwort streicht einen Fehler)</span>`;
}

function mistakeEmptyTemplate() {
    return `<span class="mistake-info">Du hast in dieser Kategorie noch keine Fehler gesammelt. Spiel erst ein normales Quiz oder eine Blitzrunde.</span>`;
}

function weeklyCardTemplate(questsHtml, daysLeftText, bonusText) {
    return `
        <section class="weekly-card">
            <div class="weekly-head">
                <span class="weekly-title">Wochenaufgaben</span>
                <span class="weekly-info">Noch ${daysLeftText} · ${bonusText}</span>
            </div>
            <div class="weekly-list">${questsHtml}</div>
        </section>
    `;
}

function questRowTemplate(quest, progress, percent, doneClass) {
    return `
        <div class="quest-row ${doneClass}">
            <span class="quest-text">${quest.text}</span>
            <div class="quest-bar"><div class="quest-fill" style="width: ${percent}%"></div></div>
            <span class="quest-progress">${progress} / ${quest.goal}</span>
            <span class="quest-reward"><span class="coin-icon"></span>${quest.reward}</span>
        </div>
    `;
}

function questToastTemplate(toastId, text, reward) {
    return `
        <div id="${toastId}" class="toast toast-quest">
            <span class="toast-label">Wochenaufgabe geschafft!</span>
            <span class="toast-title">${text}</span>
            <span class="toast-text">+${reward} Coins</span>
        </div>
    `;
}
