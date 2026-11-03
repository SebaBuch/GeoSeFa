class ChoiceQuiz extends QuizBase {
    startQuiz() {
        this.isFlagMode = this.settings.mode === 'flag-choice';
        this.showScreen(choiceQuizTemplate(this.mode.title));
        this.startTimer();
        this.showQuestion();
    }

    showQuestion() {
        this.answered = false;
        const question = this.questions[this.index];
        const promptHtml = this.isFlagMode ? flagPromptTemplate(question.flag) : capitalPromptTemplate(question.capital);
        document.getElementById('quiz-prompt').innerHTML = promptHtml;
        document.getElementById('quiz-options').innerHTML = this.buildOptionsHtml(question);
        this.updateProgress();
        this.updateScore();
    }

    buildOptionsHtml(question) {
        const options = this.getOptions(question);
        let html = '';
        for (let i = 0; i < options.length; i++) {
            html += choiceOptionTemplate(options[i]);
        }
        return html;
    }

    getOptions(question) {
        const source = this.pool.length >= 4 ? this.pool : this.countries.countries;
        const others = source.filter(country => country.code !== question.code);
        const options = shuffle(others).slice(0, 3);
        options.push(question);
        return shuffle(options);
    }

    choose(code) {
        if (this.answered || this.finished) {
            return;
        }
        this.answered = true;
        const correctCode = this.questions[this.index].code;
        this.markOptions(code, correctCode);
        this.score = code === correctCode ? this.score + 1 : this.score;
        this.updateScore();
        this.timeoutId = setTimeout(() => this.nextQuestion(), 1200);
    }

    markOptions(code, correctCode) {
        this.playCorrectSoundIf(code === correctCode);
        document.getElementById('option-' + correctCode).classList.add('correct');
        if (code !== correctCode) {
            this.playWrongSoundIf(true);
            document.getElementById('option-' + code).classList.add('wrong');
        }
    }

    nextQuestion() {
        this.index++;
        if (this.index >= this.questions.length) {
            this.finishQuiz();
        } else {
            this.showQuestion();
        }
    }
}
