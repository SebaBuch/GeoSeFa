class GeoDistance extends BaseGame {
    constructor() {
        super();
        this.achievementKey = 'geodistance';
        this.totalRounds = 5;
    }

    start() {
        this.round = 0;
        this.score = 0;
        this.finished = false;
        const shuffled = this.shuffleItems(this.getPlayableCountries());
        this.targets = shuffled.slice(0, this.totalRounds);
        this.showScreen(geoDistanceTemplate(this.totalRounds));
        this.worldMap.create('map', 'Welt');
        this.nextRound();
    }

    nextRound() {
        if (this.target) {
            this.worldMap.resetCountry(this.target.code);
        }
        this.worldMap.clearExtras();
        this.round++;
        this.target = this.targets[this.round - 1];
        this.answered = false;
        document.getElementById('distance-prompt').innerHTML = this.target.name;
        document.getElementById('distance-info').innerHTML = distanceInfoTemplate(this.round, this.totalRounds, this.score);
        this.setMessage('', '');
    }

    handleMapPoint(lat, lng) {
        if (this.answered || this.finished) {
            return;
        }
        this.answered = true;
        const nearest = this.shapes.getDistanceInfo(this.target.code, lat, lng);
        const points = this.getPoints(nearest.km);
        this.score += points;
        this.showGuess(lat, lng, nearest);
        this.rateGuess(points, nearest.km);
        const isLast = this.round >= this.totalRounds;
        document.getElementById('distance-info').innerHTML = distanceResultTemplate(this.round, this.totalRounds, this.score, isLast ? 'finish' : 'nextRound', isLast ? 'Ergebnis anzeigen' : 'Nächstes Land');
    }

    getPoints(km) {
        return km === 0 ? 100 : Math.max(0, Math.round(100 - km / 25));
    }

    showGuess(lat, lng, nearest) {
        this.worldMap.colorCountry(this.target.code, MAP_COLORS.target);
        this.worldMap.addMarker(lat, lng, nearest.km === 0 ? MAP_COLORS.green : MAP_COLORS.red);
        if (nearest.km > 0) {
            this.worldMap.addLine([lat, lng], [nearest.lat, nearest.lng]);
        }
    }

    rateGuess(points, km) {
        const text = km === 0 ? 'Volltreffer! Du hast ' + this.target.name + ' getroffen.' : formatNumber(km) + ' km daneben.';
        this.setMessage(text + ' +' + points + ' Punkte', this.getRatingClass(points));
        this.playCorrectSoundIf(points >= 80);
        this.playWrongSoundIf(points < 20);
        this.achievements.increase('distance-hits', km === 0 ? 1 : 0);
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
