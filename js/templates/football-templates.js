function footballOptionTemplate(code, label) {
    return `<button id="option-${code}" class="option" onclick="currentGame.choose('${code}')">${label}</button>`;
}

function crestQuizTemplate() {
    return `
        <section class="panel">
            ${gameHeaderTemplate('Wappen-Quiz', 'Welcher Verein ist das? Das Wappen startet stark verschwommen. Jeder falsche Tipp macht es schärfer – aber es gibt weniger Punkte: 10, 7, 4 oder 2.')}
            <div id="crest-info" class="status-row"></div>
            <div id="crest-area" class="crest-area"></div>
            <form class="guess-form" onsubmit="currentGame.submitGuess(event)">
                <input id="crest-input" oninput="currentGame.showSuggestions(this)" placeholder="Verein eingeben ..." autocomplete="off">
                <button class="button" type="submit">Raten</button>
                <button class="button button-secondary" type="button" onclick="currentGame.skip()">Auflösen</button>
            </form>
            <div id="suggestions" class="suggestions"></div>
            <div id="message" class="message"></div>
        </section>
    `;
}

function crestImageTemplate(logo, blur) {
    return `<img class="crest-image" src="${logo}" alt="Gesuchtes Wappen" draggable="false" style="filter: blur(${blur}px)">`;
}

function crestInfoTemplate(round, totalRounds, score, pointsText) {
    return `
        <span>Runde: <b>${round} / ${totalRounds}</b></span>
        <span>Punkte: <b>${score}</b></span>
        <span>${pointsText}</span>
    `;
}

function playerWordleTemplate() {
    return `
        <section class="panel">
            ${gameHeaderTemplate('Spieler-Wordle', 'Errate den gesuchten Spieler in 8 Versuchen. Grün = richtig, Rot = falsch. Bei Alter, Nummer und Marktwert zeigt der Pfeil, ob der gesuchte Wert höher oder niedriger ist. Jedes Feld, das grün wird, gibt Punkte – je früher, desto mehr.')}
            <form class="guess-form" onsubmit="currentGame.submitGuess(event)">
                <input id="wordle-input" oninput="currentGame.showSuggestions(this)" placeholder="Spieler eingeben ..." autocomplete="off">
                <button class="button" type="submit">Raten</button>
            </form>
            <div id="suggestions" class="suggestions"></div>
            <div id="message" class="message"></div>
            <div class="geodle-table wordle-table">
                <div class="geodle-row geodle-head wordle-row">
                    <span>Spieler</span>
                    <span>Liga</span>
                    <span>Verein</span>
                    <span>Position</span>
                    <span>Nation</span>
                    <span>Alter</span>
                    <span>Nummer</span>
                    <span>Marktwert</span>
                </div>
                <div id="wordle-rows"></div>
            </div>
            <div id="wordle-info" class="route-info"></div>
        </section>
    `;
}

function wordleRowTemplate(row) {
    return `
        <div class="geodle-row wordle-row">
            <span class="geodle-country">${row.player.name}</span>
            <span class="${row.league.className}">${row.league.text}</span>
            <span class="${row.club.className}"><img class="wordle-crest" src="${row.logo}" alt="">${row.club.text}</span>
            <span class="${row.position.className}">${row.position.text}</span>
            <span class="${row.nation.className}">${row.nation.text}</span>
            <span class="${row.age.className}">${row.age.text}</span>
            <span class="${row.number.className}">${row.number.text}</span>
            <span class="${row.value.className}">${row.value.text}</span>
        </div>
    `;
}

function wordleEndTemplate(text, target, club, points) {
    return `
        <div class="end-box">
            <p><b>${text}</b></p>
            <p>Gesucht war: <b>${target.name}</b> (${club.name}, ${target.position})</p>
            <p class="big-number">${points} / 100 Punkte</p>
            <div class="button-row">
                <button class="button" onclick="startGame('playerwordle')">Nochmal spielen</button>
                <button class="button button-secondary" onclick="showHome()">Startseite</button>
            </div>
        </div>
    `;
}

function valueDuelTemplate(texts, leftHtml, rightHtml, streak, highscore) {
    return `
        <section class="panel">
            ${gameHeaderTemplate(texts.title, texts.rules)}
            <div class="status-row">
                <span>Serie: ${streak}</span>
                <span>Rekord: ${highscore}</span>
            </div>
            <h2 class="question">${texts.question}</h2>
            <div class="decide-list">
                ${leftHtml}
                ${rightHtml}
            </div>
        </section>
    `;
}

function valueCardTemplate(player, club, details, valueText) {
    return `
        <button id="decide-${player.code}" class="decide-card value-card" onclick="currentGame.choose('${player.code}')">
            <img class="value-crest" src="${club.logo}" alt="${club.name}">
            <span class="decide-name">${player.name}</span>
            <span class="value-club">${club.name}</span>
            <span class="value-details">${details}</span>
            <span id="value-${player.code}" class="decide-value">${valueText}</span>
        </button>
    `;
}

function stadiumCrestTemplate(club) {
    return `<img class="value-crest" src="${club.logo}" alt="${club.name}">`;
}

function stadiumCardTemplate(stadium, crestsHtml, clubNames, valueText) {
    return `
        <button id="decide-${stadium.code}" class="decide-card value-card" onclick="currentGame.choose('${stadium.code}')">
            <span class="stadium-crests">${crestsHtml}</span>
            <span class="decide-name">${stadium.name}</span>
            <span class="value-club">${clubNames}</span>
            <span id="value-${stadium.code}" class="decide-value">${valueText}</span>
        </button>
    `;
}

function footballBlitzSelectTemplate(playersBest, crestsBest, stadiumsBest) {
    return `
        <section class="panel">
            ${gameHeaderTemplate('Blitzrunde Fußball', 'Wähle eine Kategorie. Du hast 60 Sekunden für so viele richtige Antworten wie möglich.')}
            <div class="option-list">
                <button class="option" onclick="currentGame.chooseCategory('players')">Spieler → Verein<br><small>Rekord: ${playersBest}</small></button>
                <button class="option" onclick="currentGame.chooseCategory('crests')">Wappen → Verein<br><small>Rekord: ${crestsBest}</small></button>
                <button class="option" onclick="currentGame.chooseCategory('stadiums')">Stadion → Verein<br><small>Rekord: ${stadiumsBest}</small></button>
            </div>
        </section>
    `;
}

function footballBlitzTemplate(categoryTitle) {
    return `
        <section class="panel">
            <div class="title-row">
                <h1>Blitzrunde Fußball: ${categoryTitle}</h1>
                ${backButtonTemplate()}
            </div>
            <div class="status-row">
                <span>Zeit: <b id="blitz-timer">1:00</b></span>
                <span>Punkte: <b id="blitz-score">0</b></span>
            </div>
            <div id="quiz-prompt" class="quiz-prompt blitz-prompt"></div>
            <div id="quiz-options" class="option-list"></div>
        </section>
    `;
}

function crestPromptTemplate(question, logo) {
    return `
        <div class="football-prompt">
            <p class="blitz-question">${question}</p>
            <img class="crest-image crest-small" src="${logo}" alt="Gesuchtes Wappen" draggable="false">
        </div>
    `;
}

function playerPromptTemplate(question, player) {
    return `
        <div class="football-prompt">
            <p class="blitz-question">${question}</p>
            <p class="player-prompt">${player.name}?</p>
        </div>
    `;
}

function stadiumPromptTemplate(question, stadiumName) {
    return `
        <div class="football-prompt">
            <p class="blitz-question">${question}</p>
            <p class="player-prompt">${stadiumName}</p>
        </div>
    `;
}

function footballBlitzEndTemplate(categoryTitle, score, highscore, recordText, category) {
    return `
        <section class="panel center">
            <h1>Zeit abgelaufen!</h1>
            <p>Blitzrunde Fußball: ${categoryTitle}</p>
            <p class="big-number">${score} Punkte</p>
            <p class="record">${recordText}</p>
            <p>Rekord: ${highscore}</p>
            <div class="button-row">
                <button class="button" onclick="currentGame.chooseCategory('${category}')">Nochmal</button>
                <button class="button button-secondary" onclick="currentGame.start()">Andere Kategorie</button>
                <button class="button button-secondary" onclick="showHome()">Startseite</button>
            </div>
        </section>
    `;
}

function footballStreakEndTemplate(title, score, highscore, recordText, gameKey) {
    return `
        <section class="panel center">
            <h1>${title} beendet</h1>
            <p class="big-number">${score}</p>
            <p class="record">${recordText}</p>
            <p>Rekord: ${highscore}</p>
            <div class="button-row">
                <button class="button" onclick="startGame('${gameKey}')">Nochmal spielen</button>
                <button class="button button-secondary" onclick="showHome()">Startseite</button>
            </div>
        </section>
    `;
}

function sectionTabsTemplate(geoClass, footballClass) {
    return `
        <div class="section-tabs">
            <button class="section-tab ${geoClass}" onclick="selectSection('geo')">Geografie</button>
            <button class="section-tab ${footballClass}" onclick="selectSection('football')">Fußball</button>
        </div>
    `;
}

function footballSectionTemplate(gameCardsHtml, clubCount, leagueCount, playerCount) {
    return `
        <h2 class="section-title">Fußball-Spiele</h2>
        <section class="card-list">${gameCardsHtml}</section>
        <p class="football-note">Daten: ${clubCount} Vereine aus ${leagueCount} Ligen und ${playerCount} Spieler, Stand Saison 2026/27.</p>
    `;
}

function geoSectionTemplate(dailyCardHtml, gameCardsHtml, quizCardsHtml) {
    return `
        ${dailyCardHtml}
        <h2 class="section-title">Spiele</h2>
        <section class="card-list">${gameCardsHtml}</section>
        <h2 class="section-title">Quiz</h2>
        <section class="card-list">${quizCardsHtml}</section>
    `;
}
