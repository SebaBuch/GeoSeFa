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

    buildNameOptions() {
        const names = this.countries.getSortedNames();
        let html = '';
        for (let i = 0; i < names.length; i++) {
            html += nameOptionTemplate(names[i]);
        }
        return html;
    }

    readInput(elementId) {
        const input = document.getElementById(elementId);
        const value = input.value;
        input.value = '';
        input.focus();
        return value;
    }

    pickItem(list) {
        return this.seeded ? this.seeded.pick(list) : randomItem(list);
    }

    pickCode(codes) {
        return this.seeded ? this.seeded.pickText(codes) : randomItem(codes);
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

    getRecordText(isRecord) {
        return isRecord ? 'Neuer Rekord!' : '';
    }

    stop() {
        clearTimeout(this.timeoutId);
        this.worldMap.destroy();
    }
}
