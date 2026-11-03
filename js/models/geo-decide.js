const DECIDE_CATEGORIES = [
    { key: 'population', more: 'Welches Land hat mehr Einwohner?', less: 'Welches Land hat weniger Einwohner?' },
    { key: 'area', more: 'Welches Land ist größer?', less: 'Welches Land ist kleiner?' },
    { key: 'density', more: 'Welches Land ist dichter besiedelt?', less: 'Welches Land ist dünner besiedelt?' },
    { key: 'neighbors', more: 'Welches Land hat mehr Nachbarländer?', less: 'Welches Land hat weniger Nachbarländer?' }
];

class GeoDecide extends BaseGame {
    start() {
        this.achievementKey = 'geodecide';
        this.streak = 0;
        this.finished = false;
        this.pool = this.countries.countries.filter(country => country.population > 0 && country.area > 0);
        this.known = randomItem(this.pool);
        this.nextRound();
    }

    nextRound() {
        this.answered = false;
        this.category = randomItem(DECIDE_CATEGORIES);
        this.askMore = Math.random() < 0.5;
        this.unknown = this.pickOpponent();
        const question = this.askMore ? this.category.more : this.category.less;
        const knownValue = this.formatValue(this.known);
        const stats = this.storage.getGameStats('geodecide');
        this.showScreen(geoDecideTemplate(question, this.known, knownValue, this.unknown, this.streak, stats.highscore));
    }

    pickOpponent() {
        const knownValue = this.getValue(this.known);
        for (let attempt = 0; attempt < 200; attempt++) {
            const candidate = randomItem(this.pool);
            if (candidate.code !== this.known.code && this.getValue(candidate) !== knownValue) {
                return candidate;
            }
        }
        return randomItem(this.pool);
    }

    getValue(country) {
        const key = this.category.key;
        if (key === 'population') {
            return country.population;
        }
        if (key === 'area') {
            return country.area;
        }
        if (key === 'density') {
            return country.population / country.area;
        }
        return country.borders.length;
    }

    formatValue(country) {
        const value = this.getValue(country);
        const key = this.category.key;
        if (key === 'population') {
            return formatNumber(value) + ' Einwohner';
        }
        if (key === 'area') {
            return formatNumber(value) + ' km²';
        }
        if (key === 'density') {
            return value.toLocaleString('de-DE', { maximumFractionDigits: 1 }) + ' Einwohner pro km²';
        }
        return value + ' Nachbarländer';
    }

    choose(code) {
        if (this.answered || this.finished) {
            return;
        }
        this.answered = true;
        const correctCode = this.getCorrectCode();
        this.revealAnswer(code, correctCode);
        if (code === correctCode) {
            this.streak++;
            this.timeoutId = setTimeout(() => this.continueWithWinner(correctCode), 1500);
        } else {
            this.timeoutId = setTimeout(() => this.finish(), 1500);
        }
    }

    revealAnswer(code, correctCode) {
        document.getElementById('decide-value-' + this.unknown.code).innerHTML = this.formatValue(this.unknown);
        document.getElementById('decide-' + correctCode).classList.add('correct');
        if (code === correctCode) {
            this.achievements.increase('correct', 1);
            this.sound.playDecideCorrectSound();
            document.getElementById('decide-' + code).classList.add('flash');
        } else {
            this.playWrongSoundIf(true);
            document.getElementById('decide-' + code).classList.add('wrong');
        }
    }

    getCorrectCode() {
        const knownIsBigger = this.getValue(this.known) > this.getValue(this.unknown);
        if (this.askMore) {
            return knownIsBigger ? this.known.code : this.unknown.code;
        }
        return knownIsBigger ? this.unknown.code : this.known.code;
    }

    continueWithWinner(code) {
        this.known = this.countries.getCountry(code);
        this.nextRound();
    }

    checkDecideAchievements() {
        this.achievements.unlockIf(this.streak >= 5, 'decide-5');
        this.achievements.unlockIf(this.streak >= 15, 'decide-15');
        this.achievements.unlockIf(this.streak >= 30, 'decide-30');
        this.achievements.unlockIf(this.streak >= 50, 'decide-50');
        this.achievements.unlockIf(this.streak === 0, 'decide-first-fail');
    }

    finish() {
        this.finished = true;
        const isRecord = this.storage.saveGameResult('geodecide', false, this.streak);
        this.storage.saveTopScore('geodecide', this.streak, '');
        this.checkDecideAchievements();
        this.playEndSound(isRecord, this.streak < 3);
        const stats = this.storage.getGameStats('geodecide');
        this.showScreen(streakEndTemplate(this.streak, stats.highscore, this.getRecordText(isRecord)));
    }
}
