class BaseGame {
    constructor() {
        this.countries = countryService;
        this.shapes = shapeService;
        this.storage = storageService;
        this.worldMap = worldMap;
        this.sound = soundService;
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

    playEndSound(isWin, isBad) {
        if (isWin) {
            this.sound.playWinSound();
        } else if (isBad) {
            this.sound.playLowScoreSound();
        }
    }

    playWrongSoundIf(condition) {
        if (condition) {
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
