class MatchQuiz extends QuizBase {
    startQuiz() {
        this.isFlagMode = this.settings.mode === 'flag-match';
        this.wrongCounts = {};
        this.results = {};
        this.selectedCode = null;
        this.showScreen(matchQuizTemplate(this.mode.title, this.buildItemsHtml(), this.buildTargetsHtml()));
        this.startTimer();
        this.updateMatchProgress();
    }

    buildItemsHtml() {
        const items = shuffle(this.questions);
        let html = '';
        for (let i = 0; i < items.length; i++) {
            const content = this.isFlagMode ? matchFlagTemplate(items[i].flag) : matchTextTemplate(items[i].capital);
            html += matchItemTemplate(items[i].code, content);
        }
        return html;
    }

    buildTargetsHtml() {
        const targets = shuffle(this.questions);
        let html = '';
        for (let i = 0; i < targets.length; i++) {
            html += matchTargetTemplate(targets[i].code, targets[i].name);
        }
        return html;
    }

    selectItem(code) {
        if (this.finished || this.results[code]) {
            return;
        }
        if (this.selectedCode) {
            document.getElementById('item-' + this.selectedCode).classList.remove('selected');
        }
        this.selectedCode = code;
        document.getElementById('item-' + code).classList.add('selected');
    }

    allowDrop(event) {
        event.preventDefault();
    }

    drop(event, targetCode) {
        event.preventDefault();
        this.tryMatch(targetCode);
    }

    tryMatch(targetCode) {
        if (!this.selectedCode || this.finished || this.results[targetCode]) {
            return;
        }
        const itemCode = this.selectedCode;
        if (itemCode === targetCode) {
            this.markResult(itemCode, this.wrongCounts[itemCode] ? 'yellow' : 'green');
        } else {
            this.handleWrongMatch(itemCode, targetCode);
        }
    }

    handleWrongMatch(itemCode, targetCode) {
        this.playWrongSoundIf(true);
        this.wrongCounts[itemCode] = (this.wrongCounts[itemCode] || 0) + 1;
        const target = this.countries.getCountry(targetCode);
        this.setMessage('Falsch, das gehört nicht zu ' + target.name + '.', 'red');
        if (this.wrongCounts[itemCode] >= 2) {
            this.markResult(itemCode, 'red');
        }
    }

    markResult(code, result) {
        this.results[code] = result;
        this.score += POINTS[result];
        this.selectedCode = null;
        const item = document.getElementById('item-' + code);
        item.classList.remove('selected');
        item.classList.add(result);
        item.setAttribute('draggable', 'false');
        document.getElementById('target-' + code).classList.add(result);
        this.setMessage(this.getResultText(code, result), result);
        this.updateMatchProgress();
    }

    getResultText(code, result) {
        const country = this.countries.getCountry(code);
        if (result === 'red') {
            return 'Zweimal falsch. Richtig wäre ' + country.name + ' gewesen.';
        }
        return 'Richtig: ' + country.name;
    }

    updateMatchProgress() {
        const doneCount = Object.keys(this.results).length;
        document.getElementById('quiz-progress').innerHTML = doneCount + ' / ' + this.questions.length;
        this.updateScore();
        if (doneCount >= this.questions.length) {
            this.finishQuiz();
        }
    }
}
