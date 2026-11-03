const QUIZ_MODES = {
    'map-click': { category: 'countries', title: 'Länder auf der Karte finden', requirement: 'shape', usesAmount: true },
    'map-type': { category: 'countries', title: 'Länder eintippen', requirement: 'shape', usesAmount: false },
    'shape-guess': { category: 'countries', title: 'Umrisse erraten', requirement: 'shape', usesAmount: true },
    'flag-choice': { category: 'flags', title: 'Flagge: 4 Antworten', requirement: 'flag', usesAmount: true },
    'flag-match': { category: 'flags', title: 'Flaggen zuordnen', requirement: 'flag', usesAmount: true },
    'capital-choice': { category: 'capitals', title: 'Hauptstadt: 4 Antworten', requirement: 'capital', usesAmount: true },
    'capital-map': { category: 'capitals', title: 'Hauptstädte auf der Karte', requirement: 'capitalShape', usesAmount: true },
    'capital-match': { category: 'capitals', title: 'Hauptstädte zuordnen', requirement: 'capital', usesAmount: true }
};

class QuizBase extends BaseGame {
    start(settings) {
        this.achievementKey = 'quiz';
        this.settings = settings;
        this.mode = QUIZ_MODES[settings.mode];
        this.pool = this.getPool();
        this.questions = this.createQuestions();
        this.index = 0;
        this.score = 0;
        this.finished = false;
        this.timer = new Timer('quiz-timer');
        this.startQuiz();
    }

    getPool() {
        const regionCountries = this.countries.getByRegion(this.settings.region);
        const pool = regionCountries.filter(country => this.meetsRequirement(country));
        return pool;
    }

    meetsRequirement(country) {
        const requirement = this.mode.requirement;
        if (requirement === 'shape') {
            return this.shapes.hasShape(country.code);
        }
        if (requirement === 'flag') {
            return country.flag !== '';
        }
        if (requirement === 'capital') {
            return country.capital !== '';
        }
        return country.capital !== '' && this.shapes.hasShape(country.code);
    }

    createQuestions() {
        const amount = this.mode.usesAmount ? this.settings.amount : 100;
        const count = Math.max(1, Math.round(this.pool.length * amount / 100));
        return shuffle(this.pool).slice(0, count);
    }

    startTimer() {
        this.timer.start(this.settings.timeLimit * 60, this);
    }

    handleTimeUp() {
        this.finishQuiz();
    }

    updateProgress() {
        const element = document.getElementById('quiz-progress');
        if (element) {
            element.innerHTML = Math.min(this.index + 1, this.questions.length) + ' / ' + this.questions.length;
        }
    }

    updateScore() {
        const element = document.getElementById('quiz-score');
        if (element) {
            element.innerHTML = formatScore(this.score);
        }
    }

    getQuizKey() {
        return this.settings.mode + '-' + this.settings.region + '-' + this.settings.amount;
    }

    finishQuiz() {
        if (this.finished) {
            return;
        }
        this.finished = true;
        this.timer.stop();
        clearTimeout(this.timeoutId);
        const percent = Math.round(this.score / this.questions.length * 100);
        const isRecord = this.storage.saveQuizResult(this.getQuizKey(), percent, this.timer.seconds);
        this.checkQuizAchievements(percent);
        this.playEndSound(isRecord, percent < 40);
        const scoreText = formatScore(this.score) + ' von ' + this.questions.length;
        this.showResult(quizResultTemplate(this.mode.title, percent, scoreText, formatTime(this.timer.seconds), this.getRecordText(isRecord)));
    }

    getTopDetail() {
        return this.mode.title + ' · ' + this.settings.region + ' · ' + this.settings.amount + ' % · ' + formatTime(this.timer.seconds);
    }

    checkQuizAchievements(percent) {
        const mode = this.settings.mode;
        const isFullWorld = this.settings.region === 'Welt' && this.settings.amount === 100;
        const category = this.mode.category;
        this.storage.saveTopScore('quiz', percent, this.getTopDetail());
        this.achievements.unlockIf(percent === 100, 'quiz-perfect');
        this.achievements.unlockIf(mode === 'map-click' && this.settings.region === 'Europa' && this.settings.amount === 100 && percent >= 90, 'quiz-europe-map');
        this.achievements.unlockIf(mode === 'map-click' && isFullWorld && percent >= 80, 'quiz-world-map');
        this.achievements.unlockIf(category === 'flags' && isFullWorld && percent >= 90, 'quiz-flags-world');
        this.achievements.unlockIf(category === 'capitals' && isFullWorld && percent >= 90, 'quiz-capitals-world');
    }

    showResult(html) {
        this.showScreen(resultPageTemplate(html));
    }

    stop() {
        super.stop();
        if (this.timer) {
            this.timer.stop();
        }
    }
}
