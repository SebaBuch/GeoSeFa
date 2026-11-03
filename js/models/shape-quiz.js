class ShapeQuiz extends QuizBase {
    startQuiz() {
        this.showScreen(shapeQuizTemplate(this.mode.title));
        this.startTimer();
        this.showQuestion();
    }

    showQuestion() {
        this.attempts = 0;
        this.locked = false;
        const question = this.questions[this.index];
        document.getElementById('quiz-prompt').innerHTML = this.shapes.getOutlineSvg(question.code, 'quiz-shape');
        this.setMessage('', '');
        this.updateProgress();
        this.updateScore();
    }

    submitGuess(event) {
        event.preventDefault();
        const country = this.countries.findByName(this.readInput('shape-input'));
        if (this.locked || this.finished) {
            return;
        }
        if (!country) {
            this.setMessage('Dieses Land kenne ich nicht.', 'error');
        } else if (country.code === this.questions[this.index].code) {
            this.handleCorrect(this.questions[this.index]);
        } else {
            this.handleWrong(this.questions[this.index]);
        }
    }

    handleCorrect(question) {
        this.playCorrectSoundIf(true);
        const result = this.attempts === 0 ? 'green' : 'yellow';
        this.score += POINTS[result];
        this.setMessage('Richtig: ' + question.name, result);
        this.goToNext();
    }

    handleWrong(question) {
        this.attempts++;
        this.playWrongSoundIf(true);
        if (this.attempts < 2) {
            this.setMessage('Falsch, du hast noch einen Versuch.', 'yellow');
            return;
        }
        this.setMessage('Leider falsch. Richtig war ' + question.name + '.', 'red');
        this.goToNext();
    }

    goToNext() {
        this.locked = true;
        this.updateScore();
        this.timeoutId = setTimeout(() => this.nextQuestion(), 1300);
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
