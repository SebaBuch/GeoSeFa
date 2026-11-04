class BorderChain extends BaseGame {
    constructor() {
        super();
        this.achievementKey = 'borderchain';
        this.seconds = 90;
        this.bonusPoints = 3;
    }

    start() {
        this.score = 0;
        this.completeCount = 0;
        this.finished = false;
        this.locked = false;
        this.current = null;
        this.pool = this.getPlayableCountries().filter(country => this.getNeighbors(country).length >= 2);
        this.showScreen(borderChainTemplate(this.seconds));
        this.worldMap.create('map', 'Welt');
        this.timer = new Timer('chain-timer');
        this.timer.start(this.seconds, this);
        this.nextCountry();
    }

    getNeighbors(country) {
        const known = country.borders.filter(code => this.countries.getCountry(code) !== undefined);
        return known.filter(code => this.shapes.hasShape(code));
    }

    nextCountry() {
        if (this.pool.length === 0) {
            return this.finish();
        }
        this.resetMap();
        this.current = this.pickItem(this.pool);
        this.pool = this.pool.filter(country => country.code !== this.current.code);
        this.neighbors = this.getNeighbors(this.current);
        this.found = [];
        this.locked = false;
        this.showCurrent();
    }

    showCurrent() {
        this.worldMap.colorCountry(this.current.code, MAP_COLORS.start);
        this.worldMap.fitCountries([this.current.code, ...this.neighbors]);
        this.setMessage('', '');
        this.updateInfo();
    }

    resetMap() {
        if (!this.current) {
            return;
        }
        const codes = [this.current.code, ...this.neighbors];
        for (let i = 0; i < codes.length; i++) {
            this.worldMap.resetCountry(codes[i]);
        }
    }

    updateInfo() {
        let chipsHtml = '';
        for (let i = 0; i < this.found.length; i++) {
            chipsHtml += routeChipTemplate(this.countries.getCountry(this.found[i]).name, 'green');
        }
        document.getElementById('chain-country').innerHTML = this.current.name;
        document.getElementById('chain-progress').innerHTML = chainProgressTemplate(this.found.length, this.neighbors.length, this.score);
        document.getElementById('chain-found').innerHTML = chipsHtml;
    }

    submitGuess(event) {
        event.preventDefault();
        if (this.locked || this.finished) {
            return;
        }
        const country = this.countries.findByName(this.readInput('chain-input'));
        if (!country) {
            this.setMessage('Dieses Land kenne ich nicht.', 'error');
        } else if (this.found.includes(country.code)) {
            this.setMessage(country.name + ' hast du schon.', 'yellow');
        } else {
            this.checkGuess(country);
        }
    }

    checkGuess(country) {
        const isNeighbor = this.neighbors.includes(country.code);
        this.playCorrectSoundIf(isNeighbor);
        this.playWrongSoundIf(!isNeighbor);
        if (!isNeighbor) {
            return this.setMessage(country.name + ' grenzt nicht an ' + this.current.name + '.', 'red');
        }
        this.found.push(country.code);
        this.score++;
        this.worldMap.colorCountry(country.code, MAP_COLORS.green);
        this.setMessage(country.name + ' ist ein Nachbar. +1 Punkt', 'green');
        this.updateInfo();
        this.checkComplete();
    }

    checkComplete() {
        if (this.found.length < this.neighbors.length) {
            return;
        }
        this.score += this.bonusPoints;
        this.completeCount++;
        this.achievements.increase('chain-complete', 1);
        this.setMessage('Alle Nachbarn gefunden! +' + this.bonusPoints + ' Bonus', 'green');
        this.updateInfo();
        this.locked = true;
        this.timeoutId = setTimeout(() => this.nextCountry(), 1200);
    }

    skip() {
        if (this.locked || this.finished) {
            return;
        }
        this.locked = true;
        const missing = this.neighbors.filter(code => !this.found.includes(code));
        for (let i = 0; i < missing.length; i++) {
            this.worldMap.colorCountry(missing[i], MAP_COLORS.red);
        }
        this.setMessage('Gefehlt haben: ' + this.getNames(missing), 'red');
        this.timeoutId = setTimeout(() => this.nextCountry(), 2000);
    }

    getNames(codes) {
        let text = '';
        for (let i = 0; i < codes.length; i++) {
            text += (i > 0 ? ', ' : '') + this.countries.getCountry(codes[i]).name;
        }
        return text;
    }

    handleTimeUp() {
        this.finish();
    }

    finish() {
        this.finished = true;
        this.timer.stop();
        clearTimeout(this.timeoutId);
        const isRecord = this.storage.saveGameResult('borderchain', true, this.score);
        this.storage.saveTopScore('borderchain', this.score, this.completeCount + '-mal komplett');
        this.checkChainAchievements();
        this.playEndSound(isRecord, this.score < 5);
        const stats = this.storage.getGameStats('borderchain');
        this.showScreen(chainEndTemplate(this.score, this.completeCount, stats.highscore, this.getRecordText(isRecord)));
    }

    checkChainAchievements() {
        this.achievements.unlockIf(this.score >= 20, 'chain-20');
        this.achievements.unlockIf(this.score >= 40, 'chain-40');
        this.achievements.unlockIf(this.score >= 60, 'chain-60');
    }

    getDuelScore() {
        return this.score;
    }

    stop() {
        super.stop();
        this.finished = true;
        if (this.timer) {
            this.timer.stop();
        }
    }
}
