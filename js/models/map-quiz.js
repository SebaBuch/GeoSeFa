class MapQuiz extends QuizBase {
    startQuiz() {
        this.isTypeMode = this.settings.mode === 'map-type';
        this.answeredCodes = [];
        const controlsHtml = this.isTypeMode ? mapTypeControlsTemplate() : mapClickControlsTemplate();
        this.showScreen(mapQuizTemplate(this.mode.title, controlsHtml));
        this.worldMap.create('map', this.settings.region);
        this.startTimer();
        if (this.isTypeMode) {
            this.updateTypeProgress();
        } else {
            this.showQuestion();
        }
    }

    getQuestionCodes() {
        const codes = [];
        for (let i = 0; i < this.questions.length; i++) {
            codes.push(this.questions[i].code);
        }
        return codes;
    }

    showQuestion() {
        this.attempts = 0;
        const question = this.questions[this.index];
        const isCapital = this.settings.mode === 'capital-map';
        const promptText = isCapital ? 'Hauptstadt: ' + question.capital : question.name;
        document.getElementById('quiz-prompt').innerHTML = promptText;
        this.updateProgress();
        this.updateScore();
    }

    handleMapClick(code) {
        if (this.isTypeMode || this.finished || this.answeredCodes.includes(code)) {
            return;
        }
        if (code === this.questions[this.index].code) {
            this.markAnswer(this.attempts === 0 ? 'green' : 'yellow');
        } else {
            this.handleWrongClick(code);
        }
    }

    handleWrongClick(code) {
        this.attempts++;
        this.playWrongSoundIf(true);
        const clicked = this.countries.getCountry(code);
        this.setMessage('Falsch, das war ' + (clicked ? clicked.name : 'ein anderes Land') + '.', 'red');
        if (this.attempts >= 2) {
            this.markAnswer('red');
        }
    }

    markAnswer(result) {
        this.playCorrectSoundIf(result !== 'red');
        const question = this.questions[this.index];
        this.trackQuizAnswer(question.code, result === 'green');
        this.worldMap.colorCountry(question.code, MAP_COLORS[result]);
        this.answeredCodes.push(question.code);
        this.score += POINTS[result];
        this.setMessage(this.getResultMessage(result, question), result);
        this.showNextOrFinish();
    }

    showNextOrFinish() {
        this.index++;
        if (this.index >= this.questions.length) {
            this.finishQuiz();
        } else {
            this.showQuestion();
        }
    }

    getResultMessage(result, question) {
        if (result === 'red') {
            return 'Zweimal falsch. Gesucht war ' + question.name + '.';
        }
        return 'Richtig: ' + question.name;
    }

    checkTyped(value) {
        const country = this.countries.findByName(value);
        if (!country || this.finished || this.answeredCodes.includes(country.code)) {
            return;
        }
        if (this.getQuestionCodes().includes(country.code)) {
            this.markTyped(country);
        }
    }

    markTyped(country) {
        this.answeredCodes.push(country.code);
        this.trackQuizAnswer(country.code, true);
        this.worldMap.colorCountry(country.code, MAP_COLORS.green);
        this.score++;
        this.playCorrectSoundIf(true);
        document.getElementById('type-input').value = '';
        this.setMessage('Gefunden: ' + country.name, 'green');
        this.updateTypeProgress();
    }

    updateTypeProgress() {
        document.getElementById('quiz-progress').innerHTML = this.answeredCodes.length + ' / ' + this.questions.length;
        this.updateScore();
        if (this.answeredCodes.length >= this.questions.length) {
            this.finishQuiz();
        }
    }

    giveUp() {
        this.finishQuiz();
    }

    revealMissing() {
        for (let i = 0; i < this.questions.length; i++) {
            if (!this.answeredCodes.includes(this.questions[i].code)) {
                this.worldMap.colorCountry(this.questions[i].code, MAP_COLORS.red);
            }
        }
    }

    showResult(html) {
        this.revealMissing();
        document.getElementById('quiz-panel').innerHTML = html;
        this.worldMap.refreshSize();
    }
}
