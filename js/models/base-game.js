class BaseGame {
    constructor() {
        this.countries = countryService;
        this.shapes = shapeService;
        this.storage = storageService;
        this.worldMap = worldMap;
        this.sound = soundService;
        this.achievements = achievementService;
        this.profiles = profileService;
        this.achievementKey = '';
        this.finished = false;
        this.timeoutId = null;
    }

    showScreen(html) {
        document.getElementById('content').innerHTML = html;
    }

    setMessage(text, type) {
        const element = document.getElementById('message');
        if (element) {
            element.innerHTML = text;
            element.className = 'message ' + type;
        }
    }

    getPlayableCountries() {
        const playable = this.countries.countries.filter(country => this.shapes.hasShape(country.code));
        return playable;
    }

    readInput(elementId) {
        const input = document.getElementById(elementId);
        const value = input.value;
        input.value = '';
        input.focus();
        this.clearSuggestions();
        return value;
    }

    showSuggestions(input) {
        this.inputId = input.id;
        const text = normalizeText(input.value);
        this.suggestions = text === '' ? [] : this.findSuggestions(text);
        let html = '';
        for (let i = 0; i < this.suggestions.length; i++) {
            html += suggestionTemplate(this.suggestions[i], i);
        }
        document.getElementById('suggestions').innerHTML = html;
    }

    findSuggestions(text) {
        const names = this.countries.getSortedNames();
        const startMatches = names.filter(name => normalizeText(name).startsWith(text));
        const otherMatches = names.filter(name => !normalizeText(name).startsWith(text) && normalizeText(name).includes(text));
        return [...startMatches, ...otherMatches].slice(0, 6);
    }

    pickSuggestion(index) {
        const input = document.getElementById(this.inputId);
        input.value = this.suggestions[index];
        this.clearSuggestions();
        input.form.requestSubmit();
    }

    clearSuggestions() {
        this.suggestions = [];
        const element = document.getElementById('suggestions');
        if (element) {
            element.innerHTML = '';
        }
    }

    pickItem(list) {
        return this.seeded ? this.seeded.pick(list) : randomItem(list);
    }

    pickCode(codes) {
        return this.seeded ? this.seeded.pickText(codes) : randomItem(codes);
    }

    randomNumber() {
        return this.seeded ? this.seeded.next() : Math.random();
    }

    shuffleItems(list) {
        return this.seeded ? this.seeded.shuffle(list) : shuffle(list);
    }

    finishDaily(taskKey, score, isWin) {
        this.daily.saveTaskResult(taskKey, score);
        this.playEndSound(isWin, !isWin);
    }

    playEndSound(isWin, isBad) {
        this.achievements.recordGameEnd(this.achievementKey);
        this.reportDuelEnd();
        if (isWin) {
            this.sound.playWinSound();
        } else if (isBad) {
            this.sound.playLowScoreSound();
        }
    }

    playCorrectSoundIf(condition) {
        if (condition) {
            this.achievements.increase('correct', 1);
            this.sound.playCorrectSound();
        }
    }

    playWrongSoundIf(condition) {
        if (condition) {
            this.achievements.increase('wrong', 1);
            this.sound.playWrongSound();
        }
    }

    trackAnswer(category, code, isCorrect) {
        this.storage.trackMistake(category, code, !isCorrect);
    }

    getRecordText(isRecord) {
        return isRecord ? 'Neuer Rekord!' : '';
    }

    reportDuelEnd() {
        if (this.duel && !this.duelReported) {
            this.duelReported = true;
            this.duel.finish(this.getDuelScore());
        }
    }

    getDuelScore() {
        return this.score || 0;
    }

    stop() {
        clearTimeout(this.timeoutId);
        this.worldMap.destroy();
        this.reportDuelEnd();
    }
}
