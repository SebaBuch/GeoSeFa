const BLITZ_CATEGORIES = {
    flags: { title: 'Flaggen', question: 'Welches Land hat diese Flagge?' },
    capitals: { title: 'Hauptstädte', question: 'Zu welchem Land gehört diese Hauptstadt?' },
    outlines: { title: 'Umrisse', question: 'Welches Land ist das?' }
};

class BlitzRound extends BaseGame {
    constructor() {
        super();
        this.achievementKey = 'blitz';
        this.seconds = 60;
        this.lowScore = 5;
    }

    start() {
        this.sound.stop();
        this.finished = false;
        const flagsBest = this.storage.getGameStats('blitz-flags').highscore;
        const capitalsBest = this.storage.getGameStats('blitz-capitals').highscore;
        const outlinesBest = this.storage.getGameStats('blitz-outlines').highscore;
        this.showScreen(blitzSelectTemplate(flagsBest, capitalsBest, outlinesBest));
    }

    chooseCategory(category) {
        this.sound.stop();
        this.category = category;
        const pool = this.getPool(category);
        this.pool = this.seeded ? this.seeded.sortByCode(pool) : pool;
        this.score = 0;
        this.wrongCount = 0;
        this.lastCode = '';
        this.finished = false;
        this.showScreen(blitzTemplate(BLITZ_CATEGORIES[category].title, BLITZ_CATEGORIES[category].question));
        this.timer = new Timer('blitz-timer');
        this.timer.start(this.seconds, this);
        this.nextQuestion();
    }

    getPool(category) {
        if (category === 'flags') {
            return this.countries.countries.filter(country => country.flag !== '');
        }
        if (category === 'capitals') {
            return this.countries.countries.filter(country => country.capital !== '');
        }
        return this.getPlayableCountries();
    }

    nextQuestion() {
        if (this.finished) {
            return;
        }
        this.locked = false;
        this.question = this.pickQuestion();
        document.getElementById('quiz-prompt').innerHTML = this.getPromptHtml(this.question);
        document.getElementById('quiz-options').innerHTML = this.buildOptionsHtml(this.question);
        document.getElementById('blitz-score').innerHTML = this.score;
    }

    pickQuestion() {
        const candidates = this.pool.filter(country => country.code !== this.lastCode);
        const question = this.pickItem(candidates.length > 0 ? candidates : this.pool);
        this.lastCode = question.code;
        return question;
    }

    getPromptHtml(question) {
        if (this.category === 'flags') {
            return flagPromptTemplate(question.flag);
        }
        if (this.category === 'capitals') {
            return capitalPromptTemplate(question.capital);
        }
        return this.shapes.getOutlineSvg(question.code, 'blitz-shape');
    }

    buildOptionsHtml(question) {
        const others = this.pool.filter(country => country.code !== question.code);
        const options = this.shuffleItems(others).slice(0, 3);
        options.push(question);
        const shuffledOptions = this.shuffleItems(options);
        let html = '';
        for (let i = 0; i < shuffledOptions.length; i++) {
            html += choiceOptionTemplate(shuffledOptions[i]);
        }
        return html;
    }

    choose(code) {
        if (this.locked || this.finished) {
            return;
        }
        this.locked = true;
        this.markAnswer(code);
        document.getElementById('blitz-score').innerHTML = this.score;
        this.timeoutId = setTimeout(() => this.nextQuestion(), 400);
    }

    markAnswer(code) {
        document.getElementById('option-' + this.question.code).classList.add('correct');
        if (code === this.question.code) {
            this.score++;
            this.playCorrectSoundIf(true);
        } else {
            document.getElementById('option-' + code).classList.add('wrong');
            this.wrongCount++;
            this.playWrongSoundIf(true);
        }
    }

    handleTimeUp() {
        this.checkBlitzAchievements();
        this.finish();
    }

    finish() {
        this.finished = true;
        this.timer.stop();
        clearTimeout(this.timeoutId);
        if (this.daily) {
            this.finishBlitzDaily();
            return;
        }
        const gameKey = 'blitz-' + this.category;
        const isRecord = this.saveBlitzResult(gameKey);
        this.playEndSound(isRecord, this.score < this.lowScore);
        const highscore = this.storage.getGameStats(gameKey).highscore;
        this.showScreen(blitzEndTemplate(BLITZ_CATEGORIES[this.category].title, this.score, highscore, this.getRecordText(isRecord), this.category));
    }

    checkBlitzAchievements() {
        this.achievements.unlockIf(this.score >= 10, 'blitz-10');
        this.achievements.unlockIf(this.score >= 20, 'blitz-20');
        this.achievements.unlockIf(this.score >= 30, 'blitz-30');
        this.achievements.unlockIf(this.score >= 40, 'blitz-40');
        this.achievements.unlockIf(this.score >= 10 && this.wrongCount === 0, 'blitz-perfect');
        this.achievements.unlockIf(this.score >= 20 && this.wrongCount === 0, 'blitz-perfect-20');
        this.achievements.unlockIf(this.wrongCount >= 10, 'hidden-clown');
        this.achievements.unlockIf(this.score === 0, 'hidden-blitz-zero');
        this.checkBlitzAll();
    }

    checkBlitzAll() {
        this.achievements.saveBest('blitz-' + this.category, this.score);
        const flags = this.achievements.getCounter('blitz-flags');
        const capitals = this.achievements.getCounter('blitz-capitals');
        const outlines = this.achievements.getCounter('blitz-outlines');
        this.achievements.unlockIf(Math.min(flags, capitals, outlines) >= 10, 'blitz-all');
    }

    saveBlitzResult(gameKey) {
        this.storage.saveTopScore(gameKey, this.score, this.wrongCount + ' Fehler');
        return this.storage.saveGameResult(gameKey, true, this.score);
    }

    finishBlitzDaily() {
        const score = Math.min(100, this.score * 5);
        this.finishDaily('blitz', score, this.score >= this.lowScore);
        const text = 'Du hast ' + this.score + ' Flaggen richtig erkannt (5 Punkte pro Flagge, maximal 100).';
        this.showScreen(dailyResultPageTemplate('Tages-Blitz', text, score));
    }

    stop() {
        super.stop();
        this.finished = true;
        if (this.timer) {
            this.timer.stop();
        }
    }
}
