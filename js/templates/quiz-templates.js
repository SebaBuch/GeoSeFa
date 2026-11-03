function quizHeaderTemplate(title) {
    return `
        <div class="quiz-header">
            <h1>${title}</h1>
            <div class="quiz-stats">
                <span>Fortschritt: <b id="quiz-progress">0</b></span>
                <span>Punkte: <b id="quiz-score">0</b></span>
                <span>Zeit: <b id="quiz-timer">0:00</b></span>
                ${backButtonTemplate()}
            </div>
        </div>
    `;
}

function mapQuizTemplate(title, controlsHtml) {
    return `
        <div class="map-layout">
        <section id="quiz-panel" class="panel">
            ${quizHeaderTemplate(title)}
            ${controlsHtml}
            <div id="message" class="message"></div>
        </section>
        <div id="map" class="map"></div>
        </div>
    `;
}

function mapClickControlsTemplate() {
    return `
        <p class="quiz-task">Klicke auf: <b id="quiz-prompt"></b></p>
    `;
}

function mapTypeControlsTemplate() {
    return `
        <div class="guess-form">
            <input id="type-input" placeholder="Land eintippen ..." autocomplete="off" oninput="currentGame.checkTyped(this.value)">
            <button class="button button-secondary" onclick="currentGame.giveUp()">Aufgeben</button>
        </div>
    `;
}

function choiceQuizTemplate(title) {
    return `
        <section class="panel">
            ${quizHeaderTemplate(title)}
            <div id="quiz-prompt" class="quiz-prompt"></div>
            <div id="quiz-options" class="option-list"></div>
        </section>
    `;
}

function flagPromptTemplate(url) {
    return `<img class="prompt-flag" src="${url}" alt="Gesuchte Flagge">`;
}

function capitalPromptTemplate(capital) {
    return `<p class="prompt-text">Zu welchem Land gehört <b>${capital}</b>?</p>`;
}

function choiceOptionTemplate(country) {
    return `
        <button id="option-${country.code}" class="option" onclick="currentGame.choose('${country.code}')">${country.name}</button>
    `;
}

function shapeQuizTemplate(title, nameOptionsHtml) {
    return `
        <section class="panel">
            ${quizHeaderTemplate(title)}
            <div id="quiz-prompt" class="quiz-prompt shape-prompt"></div>
            <form class="guess-form" onsubmit="currentGame.submitGuess(event)">
                <input id="shape-input" list="country-names" placeholder="Welches Land ist das?" autocomplete="off">
                <button class="button" type="submit">Raten</button>
            </form>
            <datalist id="country-names">${nameOptionsHtml}</datalist>
            <div id="message" class="message"></div>
        </section>
    `;
}

function matchQuizTemplate(title, itemsHtml, targetsHtml) {
    return `
        <section class="panel">
            ${quizHeaderTemplate(title)}
            <p class="quiz-task">Ziehe jedes Feld auf das passende Land oder klicke erst das Feld und dann das Land an.</p>
            <div id="message" class="message"></div>
            <div class="match-area">
                <div class="match-column">
                    <h2>Zuordnen</h2>
                    <div class="match-items">${itemsHtml}</div>
                </div>
                <div class="match-column">
                    <h2>Länder</h2>
                    <div class="match-targets">${targetsHtml}</div>
                </div>
            </div>
        </section>
    `;
}

function matchItemTemplate(code, contentHtml) {
    return `
        <div id="item-${code}" class="match-item" draggable="true" ondragstart="currentGame.selectItem('${code}')" onclick="currentGame.selectItem('${code}')">
            ${contentHtml}
        </div>
    `;
}

function matchFlagTemplate(url) {
    return `<img src="${url}" alt="Flagge" draggable="false">`;
}

function matchTextTemplate(text) {
    return `<span>${text}</span>`;
}

function matchTargetTemplate(code, name) {
    return `
        <div id="target-${code}" class="match-target" ondragover="currentGame.allowDrop(event)" ondrop="currentGame.drop(event, '${code}')" onclick="currentGame.tryMatch('${code}')">
            ${name}
        </div>
    `;
}

function resultPageTemplate(resultHtml) {
    return `<section class="panel center">${resultHtml}</section>`;
}

function quizResultTemplate(title, percent, scoreText, timeText, recordText) {
    return `
        <div class="quiz-result">
            <h1>${title} beendet</h1>
            <p class="big-number">${percent} %</p>
            <p>${scoreText} Punkten in ${timeText}</p>
            <p class="record">${recordText}</p>
            <div class="button-row">
                <button class="button" onclick="restartQuiz()">Nochmal</button>
                <button class="button button-secondary" onclick="backToQuizSetup()">Einstellungen</button>
                <button class="button button-secondary" onclick="showHome()">Startseite</button>
            </div>
        </div>
    `;
}
