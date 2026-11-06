function suggestionTemplate(name, index) {
    return `<button class="suggestion" type="button" onclick="currentGame.pickSuggestion(${index})">${name}</button>`;
}

function outlineSvgTemplate(elementId, viewBox, path) {
    return `
        <svg id="${elementId}" class="outline" viewBox="${viewBox}" preserveAspectRatio="xMidYMid meet">
            <path d="${path}" fill-rule="evenodd" vector-effect="non-scaling-stroke"></path>
        </svg>
    `;
}

function gameHeaderTemplate(title, rulesText) {
    return `
        <div class="game-header">
            <div class="title-row">
                <h1>${title}</h1>
                ${backButtonTemplate()}
            </div>
            <p>${rulesText}</p>
        </div>
    `;
}

function backButtonTemplate() {
    return `<button class="back-button" onclick="showHome()">← Startseite</button>`;
}

function geoRouteTemplate(start, target) {
    return `
        <div class="map-layout">
        <section class="panel">
            ${gameHeaderTemplate('GeoRoute', 'Gib Land für Land den kürzesten Landweg ein. Grün = kürzester Weg, Gelb = Nachbar, aber Umweg, Rot = kein direkter Landweg.')}
            <div class="route-ends">
                <span class="route-end start">Start: ${start.name}</span>
                <span class="route-arrow">→</span>
                <span class="route-end target">Ziel: ${target.name}</span>
            </div>
            <form class="guess-form" onsubmit="currentGame.submitGuess(event)">
                <input id="guess-input" oninput="currentGame.showSuggestions(this)" placeholder="Land eingeben ..." autocomplete="off">
                <button class="button" type="submit">Eingeben</button>
            </form>
            <div id="suggestions" class="suggestions"></div>
            <div id="message" class="message"></div>
            <div id="route-guesses" class="route-guesses"></div>
            <div id="route-info" class="route-info"></div>
        </section>
        <div id="map" class="map"></div>
        </div>
    `;
}

function routeInfoTemplate(currentName, guessesLeft, neededCountries) {
    return `
        <span>Aktuell in: <b>${currentName}</b></span>
        <span>Versuche übrig: <b>${guessesLeft}</b></span>
        <span>Kürzester Weg: <b>${neededCountries}</b> Länder dazwischen</span>
    `;
}

function routeChipTemplate(name, colorClass) {
    return `<span class="chip ${colorClass}">${name}</span>`;
}

function routeEndTemplate(text, shortestRoute) {
    return `
        <div class="end-box">
            <p><b>${text}</b></p>
            <p>Ein kürzester Weg: ${shortestRoute}</p>
            <div class="button-row">
                <button class="button" onclick="startGame('georoute')">Neues Spiel</button>
                <button class="button button-secondary" onclick="showHome()">Startseite</button>
            </div>
        </div>
    `;
}

function geoSizeTemplate(left, right, leftSvg, rightSvg, round, totalRounds, score) {
    return `
        <section class="panel">
            ${gameHeaderTemplate('GeoSize', 'Schiebe den Regler so, wie groß die Länder im Vergleich zueinander sind. Mitte = gleich groß.')}
            <div class="status-row">
                <span>Runde ${round} / ${totalRounds}</span>
                <span>Punkte: ${score}</span>
            </div>
            <div class="size-compare">
                <div class="size-side">
                    <div id="size-box-left" class="size-box">${leftSvg}</div>
                    <span class="size-name">${left.name}</span>
                    <span id="share-left" class="size-share"></span>
                </div>
                <div class="size-side">
                    <div class="size-box">${rightSvg}</div>
                    <span class="size-name">${right.name}</span>
                    <span id="share-right" class="size-share"></span>
                </div>
            </div>
            <input id="size-slider" class="size-slider" type="range" min="1" max="99" value="50" oninput="currentGame.updateSlider(this.value)">
            <div id="size-result" class="size-result">
                <button class="button" onclick="currentGame.check()">Prüfen</button>
            </div>
        </section>
    `;
}

function geoSizeResultTemplate(guessText, leftText, rightText, points, buttonAction, buttonLabel) {
    return `
        <p>Dein Tipp: ${guessText}</p>
        <p>Richtig: ${leftText} | ${rightText}</p>
        <p><b>+${points} Punkte</b></p>
        <button class="button" onclick="currentGame.${buttonAction}()">${buttonLabel}</button>
    `;
}

function scoreEndTemplate(title, score, maxScore, highscore, recordText, gameKey) {
    return `
        <section class="panel center">
            <h1>${title} beendet</h1>
            <p class="big-number">${score} / ${maxScore}</p>
            <p class="record">${recordText}</p>
            <p>Highscore: ${highscore}</p>
            <div class="button-row">
                <button class="button" onclick="startGame('${gameKey}')">Nochmal spielen</button>
                <button class="button button-secondary" onclick="showHome()">Startseite</button>
            </div>
        </section>
    `;
}

function geoDecideTemplate(question, leftHtml, rightHtml, streak, highscore) {
    return `
        <section class="panel">
            ${gameHeaderTemplate('GeoDecide', 'Klicke auf das richtige Land. Jedes Land bleibt höchstens zwei Runden. Ein Fehler und das Spiel ist vorbei.')}
            <div class="status-row">
                <span>Serie: ${streak}</span>
                <span>Rekord: ${highscore}</span>
            </div>
            <h2 class="question">${question}</h2>
            <div class="decide-list">
                ${leftHtml}
                ${rightHtml}
            </div>
        </section>
    `;
}

function decideCardTemplate(country, valueText) {
    return `
        <button id="decide-${country.code}" class="decide-card" onclick="currentGame.choose('${country.code}')">
            <img src="${country.flag}" alt="Flagge">
            <span class="decide-name">${country.name}</span>
            <span id="decide-value-${country.code}" class="decide-value">${valueText}</span>
        </button>
    `;
}

function streakEndTemplate(streak, highscore, recordText) {
    return `
        <section class="panel center">
            <h1>Game Over</h1>
            <p class="big-number">Serie: ${streak}</p>
            <p class="record">${recordText}</p>
            <p>Rekord: ${highscore}</p>
            <div class="button-row">
                <button class="button" onclick="startGame('geodecide')">Nochmal spielen</button>
                <button class="button button-secondary" onclick="showHome()">Startseite</button>
            </div>
        </section>
    `;
}

function geodleTemplate(hintBarHtml) {
    return `
        <section class="panel">
            ${gameHeaderTemplate('Geodle', 'Errate das gesuchte Land. Jedes Feld, das grün wird, gibt Punkte: im 1. Versuch 10, im 2. Versuch 9 usw. (mindestens 1). Wer das Land findet, bekommt einen Bonus: je früher, desto mehr (bis 50).')}
            <form class="guess-form" onsubmit="currentGame.submitGuess(event)">
                <input id="geodle-input" oninput="currentGame.showSuggestions(this)" placeholder="Land eingeben ..." autocomplete="off">
                <button class="button" type="submit">Raten</button>
            </form>
            <div id="suggestions" class="suggestions"></div>
            <div id="message" class="message"></div>
            ${hintBarHtml}
            <div class="geodle-table">
                <div class="geodle-row geodle-head">
                    <span>Land</span>
                    <span>Kontinent</span>
                    <span>Binnenstaat</span>
                    <span>Nachbar</span>
                    <span>Bevölkerung</span>
                    <span>Fläche</span>
                </div>
                <div id="geodle-rows"></div>
            </div>
            <div id="geodle-info" class="route-info"></div>
        </section>
    `;
}

function geodleRowTemplate(row) {
    return `
        <div class="geodle-row">
            <span class="geodle-country"><img src="${row.country.flag}" alt="">${row.country.name}</span>
            <span class="${row.continent.className}">${row.continent.text}</span>
            <span class="${row.landlocked.className}">${row.landlocked.text}</span>
            <span class="${row.neighbor.className}">${row.neighbor.text}</span>
            <span class="${row.population.className}">${row.population.text}</span>
            <span class="${row.area.className}">${row.area.text}</span>
        </div>
    `;
}

function geodleInfoTemplate(guessesLeft, points) {
    return `
        <span>Versuche übrig: <b>${guessesLeft}</b></span>
        <span>Punkte bisher: <b>${points}</b></span>
    `;
}

function geodleEndTemplate(text, target, points) {
    return `
        <div class="end-box">
            <p><b>${text}</b></p>
            <p class="geodle-solution"><img src="${target.flag}" alt="">${target.name}</p>
            <p class="big-number">${points} / 100 Punkte</p>
            <div class="button-row">
                <button class="button" onclick="startGame('geodle')">Neues Spiel</button>
                <button class="button button-secondary" onclick="showHome()">Startseite</button>
            </div>
        </div>
    `;
}

function connectionsTemplate() {
    return `
        <section class="panel">
            ${gameHeaderTemplate('GeoConnections', 'Wähle 4 Felder, die zum selben Land gehören, und drücke auf Prüfen.')}
            <div id="connections-solved" class="solved-list"></div>
            <div id="connections-board" class="tile-board"></div>
            <div id="message" class="message"></div>
            <div class="status-row">
                <span>Fehler: <span id="connections-mistakes" class="mistakes"></span></span>
                <button id="connections-submit" class="button" onclick="currentGame.submitSelection()">Prüfen</button>
            </div>
            <div id="connections-end"></div>
        </section>
    `;
}

function solvedGroupTemplate(country, itemsHtml, index) {
    return `
        <div class="solved-group group-${index}">
            <span class="solved-name">${country.name}</span>
            <div class="solved-items">${itemsHtml}</div>
        </div>
    `;
}

function solvedItemTemplate(contentHtml) {
    return `<div class="solved-item">${contentHtml}</div>`;
}

function connectionTileTemplate(id, contentHtml, selectedClass) {
    return `
        <button id="tile-${id}" class="tile ${selectedClass}" onclick="currentGame.toggleTile(${id})">
            ${contentHtml}
        </button>
    `;
}

function tileTextTemplate(label, text) {
    return `
        <span class="tile-label">${label}</span>
        <span class="tile-text">${text}</span>
    `;
}

function tileFlagTemplate(url) {
    return `<img class="tile-flag" src="${url}" alt="Flagge">`;
}

function mistakeDotTemplate(className) {
    return `<span class="dot ${className}"></span>`;
}

function connectionsEndTemplate(text) {
    return `
        <div class="end-box">
            <p><b>${text}</b></p>
            <div class="button-row">
                <button class="button" onclick="startGame('geoconnections')">Neues Spiel</button>
                <button class="button button-secondary" onclick="showHome()">Startseite</button>
            </div>
        </div>
    `;
}

function blitzSelectTemplate(flagsBest, capitalsBest, outlinesBest) {
    return `
        <section class="panel">
            ${gameHeaderTemplate('Blitzrunde', 'Du hast 60 Sekunden. Beantworte so viele Fragen wie möglich. Wähle eine Kategorie.')}
            <div class="blitz-categories">
                <button class="blitz-category blitz-flags" onclick="currentGame.chooseCategory('flags')">
                    <span class="blitz-category-title">Flaggen</span>
                    <span class="blitz-category-best">Rekord: ${flagsBest}</span>
                </button>
                <button class="blitz-category blitz-capitals" onclick="currentGame.chooseCategory('capitals')">
                    <span class="blitz-category-title">Hauptstädte</span>
                    <span class="blitz-category-best">Rekord: ${capitalsBest}</span>
                </button>
                <button class="blitz-category blitz-outlines" onclick="currentGame.chooseCategory('outlines')">
                    <span class="blitz-category-title">Umrisse</span>
                    <span class="blitz-category-best">Rekord: ${outlinesBest}</span>
                </button>
            </div>
        </section>
    `;
}

function blitzTemplate(categoryTitle, questionText) {
    return `
        <section class="panel">
            <div class="title-row">
                <h1>Blitzrunde: ${categoryTitle}</h1>
                ${backButtonTemplate()}
            </div>
            <div class="status-row">
                <span>Zeit: <b id="blitz-timer">1:00</b></span>
                <span>Punkte: <b id="blitz-score">0</b></span>
            </div>
            <p class="blitz-question">${questionText}</p>
            <div id="quiz-prompt" class="quiz-prompt blitz-prompt"></div>
            <div id="quiz-options" class="option-list"></div>
        </section>
    `;
}

function blitzEndTemplate(categoryTitle, score, highscore, recordText, category) {
    return `
        <section class="panel center">
            <h1>Zeit abgelaufen!</h1>
            <p>Blitzrunde: ${categoryTitle}</p>
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

function geoDistanceTemplate() {
    return `
        <div class="map-layout">
        <section class="panel">
            ${gameHeaderTemplate('GeoDistanz', 'Gemessen wird von Hauptstadt zu Hauptstadt. Gib ein Land ein, dessen Hauptstadt möglichst genau so weit von der Start-Hauptstadt entfernt ist.')}
            <div id="distance-task" class="distance-task"></div>
            <form id="distance-form" class="guess-form" onsubmit="currentGame.submitGuess(event)">
                <input id="distance-input" oninput="currentGame.showSuggestions(this)" placeholder="Land eingeben ..." autocomplete="off">
                <button class="button" type="submit">Raten</button>
            </form>
            <div id="suggestions" class="suggestions"></div>
            <div id="message" class="message"></div>
            <div id="distance-info" class="distance-info"></div>
        </section>
        <div id="map" class="map"></div>
        </div>
    `;
}

function distanceTaskTemplate(startCountry, kmText) {
    return `
        <span class="route-end start">Start: ${startCountry.name} (${startCountry.capital})</span>
        <span class="distance-target">Gesucht: ein Land, dessen Hauptstadt ca. <b>${kmText} km</b> entfernt ist</span>
    `;
}

function distanceInfoTemplate(round, totalRounds, score) {
    return `
        <span class="info-pill">Runde ${round} / ${totalRounds}</span>
        <span class="info-pill">Punkte: ${score}</span>
    `;
}

function distanceResultTemplate(round, totalRounds, score, action, label) {
    return `
        <span class="info-pill">Runde ${round} / ${totalRounds}</span>
        <span class="info-pill">Punkte: ${score}</span>
        <button class="button" onclick="currentGame.${action}()">${label}</button>
    `;
}

function borderChainTemplate(seconds, hintBarHtml) {
    return `
        <div class="map-layout">
        <section class="panel">
            ${gameHeaderTemplate('Grenz-Kette', 'Nenne alle Nachbarländer des grünen Landes. Jeder Nachbar gibt 1 Punkt, alle gefunden gibt 3 Bonuspunkte. Du hast ' + seconds + ' Sekunden.')}
            <div class="distance-task">
                <span class="route-end start">Land: <b id="chain-country"></b></span>
                <span class="info-pill">Zeit: <b id="chain-timer"></b></span>
                <span id="chain-progress" class="distance-info"></span>
            </div>
            <form class="guess-form" onsubmit="currentGame.submitGuess(event)">
                <input id="chain-input" oninput="currentGame.showSuggestions(this)" placeholder="Nachbarland eingeben ..." autocomplete="off">
                <button class="button" type="submit">Eingeben</button>
                <button class="button button-secondary" type="button" onclick="currentGame.skip()">Nächstes Land</button>
            </form>
            <div id="suggestions" class="suggestions"></div>
            <div id="message" class="message"></div>
            ${hintBarHtml}
            <div id="chain-found" class="route-guesses"></div>
        </section>
        <div id="map" class="map"></div>
        </div>
    `;
}

function hintBarTemplate(buttonsHtml) {
    return `
        <div class="hint-bar">
            <span class="hint-title">Tipp kaufen:</span>
            ${buttonsHtml}
            <span id="hint-text" class="hint-text"></span>
        </div>
    `;
}

function hintButtonTemplate(hint) {
    return `<button class="hint-button" type="button" onclick="currentGame.useHint('${hint.key}')">${hint.label} · ${hint.price} Coins</button>`;
}

function chainProgressTemplate(foundCount, score) {
    return `
        <span class="info-pill">Gefunden: ${foundCount}</span>
        <span class="info-pill">Punkte: ${score}</span>
    `;
}

function chainEndTemplate(score, completeCount, highscore, recordText) {
    return `
        <section class="panel center">
            <h1>Grenz-Kette beendet</h1>
            <p class="big-number">${score} Punkte</p>
            <p>${completeCount}-mal alle Nachbarn gefunden</p>
            <p class="record">${recordText}</p>
            <p>Highscore: ${highscore}</p>
            <div class="button-row">
                <button class="button" onclick="startGame('borderchain')">Nochmal spielen</button>
                <button class="button button-secondary" onclick="showHome()">Startseite</button>
            </div>
        </section>
    `;
}
