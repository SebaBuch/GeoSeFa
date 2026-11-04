class GeoDistance extends BaseGame {
    constructor() {
        super();
        this.achievementKey = 'geodistance';
        this.totalRounds = 5;
        this.minDistance = 500;
    }

    start() {
        this.round = 0;
        this.score = 0;
        this.finished = false;
        const playable = this.getPlayableCountries();
        this.pool = playable.filter(country => country.capitalPosition && country.capital !== '');
        this.showScreen(geoDistanceTemplate());
        this.worldMap.create('map', 'Welt');
        this.nextRound();
    }

    nextRound() {
        this.resetMap();
        this.round++;
        this.createTask();
        this.answered = false;
        this.worldMap.colorCountry(this.startCountry.code, MAP_COLORS.start);
        document.getElementById('distance-task').innerHTML = distanceTaskTemplate(this.startCountry, formatNumber(this.targetKm));
        document.getElementById('distance-info').innerHTML = distanceInfoTemplate(this.round, this.totalRounds, this.score);
        document.getElementById('distance-form').classList.remove('hidden');
        this.setMessage('', '');
    }

    createTask() {
        this.startCountry = this.pickItem(this.pool);
        const others = this.pool.filter(country => this.getKm(country) >= this.minDistance);
        this.answerCountry = this.pickItem(others);
        this.targetKm = Math.round(this.getKm(this.answerCountry) / 100) * 100;
    }

    getKm(country) {
        const from = this.startCountry.capitalPosition;
        return getDistanceKm(from.lat, from.lng, country.capitalPosition.lat, country.capitalPosition.lng);
    }

    resetMap() {
        this.worldMap.clearExtras();
        const codes = this.startCountry ? [this.startCountry.code, this.answerCountry.code, this.guessCode] : [];
        for (let i = 0; i < codes.length; i++) {
            if (codes[i]) {
                this.worldMap.resetCountry(codes[i]);
            }
        }
    }

    submitGuess(event) {
        event.preventDefault();
        if (this.answered || this.finished) {
            return;
        }
        const country = this.countries.findByName(this.readInput('distance-input'));
        const errorText = this.getGuessError(country);
        if (errorText !== '') {
            this.setMessage(errorText, 'error');
        } else {
            this.evaluateGuess(country);
        }
    }

    getGuessError(country) {
        if (!country || !this.shapes.hasShape(country.code)) {
            return 'Dieses Land kenne ich nicht.';
        }
        if (country.code === this.startCountry.code) {
            return 'Das ist das Startland. Gesucht ist ein anderes Land.';
        }
        return country.capitalPosition ? '' : 'Für ' + country.name + ' ist keine Hauptstadt bekannt. Nimm ein anderes Land.';
    }

    evaluateGuess(country) {
        this.answered = true;
        this.guessCode = country.code;
        const guessKm = this.getKm(country);
        const points = this.getPoints(Math.abs(guessKm - this.targetKm));
        this.score += points;
        this.showOnMap(country);
        this.rateGuess(country, guessKm, points);
        document.getElementById('distance-form').classList.add('hidden');
        const isLast = this.round >= this.totalRounds;
        document.getElementById('distance-info').innerHTML = distanceResultTemplate(this.round, this.totalRounds, this.score, isLast ? 'finish' : 'nextRound', isLast ? 'Ergebnis anzeigen' : 'Nächste Runde');
    }

    getPoints(differenceKm) {
        if (differenceKm <= 200) {
            return 100;
        }
        return Math.max(0, Math.round(100 - (differenceKm - 200) / 15));
    }

    showOnMap(country) {
        const start = this.startCountry.capitalPosition;
        const guess = country.capitalPosition;
        const answer = this.answerCountry.capitalPosition;
        this.worldMap.colorCountry(this.answerCountry.code, MAP_COLORS.target);
        this.worldMap.colorCountry(country.code, country.code === this.answerCountry.code ? MAP_COLORS.target : MAP_COLORS.yellow);
        this.worldMap.addLine([start.lat, start.lng], [answer.lat, answer.lng]);
        this.worldMap.addLine([start.lat, start.lng], [guess.lat, guess.lng]);
        this.worldMap.addMarker(start.lat, start.lng, MAP_COLORS.start);
        this.worldMap.addMarker(answer.lat, answer.lng, MAP_COLORS.target);
        this.worldMap.addMarker(guess.lat, guess.lng, MAP_COLORS.yellow);
    }

    rateGuess(country, guessKm, points) {
        const guessText = country.capital + ' (' + country.name + ') ist ca. ' + formatNumber(guessKm) + ' km von ' + this.startCountry.capital + ' entfernt.';
        const answerText = ' Gedacht war ' + this.answerCountry.capital + ' (' + this.answerCountry.name + ', ' + formatNumber(this.getKm(this.answerCountry)) + ' km).';
        this.setMessage(guessText + answerText + ' +' + points + ' Punkte', this.getRatingClass(points));
        this.playCorrectSoundIf(points >= 80);
        this.playWrongSoundIf(points < 20);
        this.achievements.increase('distance-hits', points === 100 ? 1 : 0);
    }

    getRatingClass(points) {
        if (points >= 80) {
            return 'green';
        }
        return points >= 40 ? 'yellow' : 'red';
    }

    finish() {
        this.finished = true;
        const isRecord = this.storage.saveGameResult('geodistance', true, this.score);
        this.storage.saveTopScore('geodistance', this.score, '');
        this.checkDistanceAchievements();
        this.playEndSound(isRecord, this.score < 150);
        const stats = this.storage.getGameStats('geodistance');
        this.showScreen(scoreEndTemplate('GeoDistanz', this.score, this.totalRounds * 100, stats.highscore, this.getRecordText(isRecord), 'geodistance'));
    }

    checkDistanceAchievements() {
        this.achievements.unlockIf(this.score >= 400, 'distance-400');
        this.achievements.unlockIf(this.score >= 450, 'distance-450');
        this.achievements.unlockIf(this.score >= 500, 'distance-500');
    }
}
