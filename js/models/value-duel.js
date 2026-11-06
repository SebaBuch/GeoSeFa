class ValueDuel extends FootballGame {
    constructor() {
        super();
        this.achievementKey = 'valueduel';
        this.title = 'Wer ist mehr wert?';
        this.rules = 'Mal wird nach dem höheren, mal nach dem niedrigeren Marktwert gefragt. Jeder Spieler bleibt höchstens zwei Runden. Ein Fehler und das Spiel ist vorbei.';
    }

    start() {
        this.score = 0;
        this.finished = false;
        this.pool = this.createPool();
        this.known = this.pickItem(this.pool);
        this.recent = [this.known.code];
        this.knownSide = 'left';
        this.isFirstRound = true;
        this.nextRound();
    }

    createPool() {
        return this.football.players.filter(player => player.value > 0);
    }

    getValue(item) {
        return item.value;
    }

    formatItemValue(item) {
        return this.football.formatValue(item.value);
    }

    getQuestion() {
        return this.askMore ? 'Wer ist mehr wert?' : 'Wer ist weniger wert?';
    }

    nextRound() {
        this.answered = false;
        this.unknown = this.pickOpponent();
        this.askMore = this.randomNumber() < 0.5;
        const stats = this.storage.getGameStats(this.achievementKey);
        const knownHtml = this.buildCard(this.known, this.formatItemValue(this.known));
        const unknownHtml = this.buildCard(this.unknown, '?');
        const isLeft = this.knownSide === 'left';
        const texts = { title: this.title, rules: this.rules, question: this.getQuestion() };
        this.showScreen(valueDuelTemplate(texts, isLeft ? knownHtml : unknownHtml, isLeft ? unknownHtml : knownHtml, this.score, stats.highscore));
    }

    buildCard(player, valueText) {
        const club = this.football.getClub(player.club);
        const details = player.position + ' · ' + this.football.getAge(player.birth) + ' Jahre · ' + player.nation;
        return valueCardTemplate(player, club, details, valueText);
    }

    pickOpponent() {
        for (let attempt = 0; attempt < 200; attempt++) {
            const candidate = this.pickItem(this.pool);
            if (!this.recent.includes(candidate.code) && this.getValue(candidate) !== this.getValue(this.known)) {
                return this.remember(candidate);
            }
        }
        return this.remember(this.pickItem(this.pool));
    }

    remember(item) {
        this.recent = [...this.recent.slice(-5), item.code];
        return item;
    }

    choose(code) {
        if (this.answered || this.finished) {
            return;
        }
        this.answered = true;
        const knownIsBigger = this.getValue(this.known) > this.getValue(this.unknown);
        const winner = knownIsBigger === this.askMore ? this.known : this.unknown;
        this.revealAnswer(code, winner);
        if (code !== winner.code) {
            return this.loseRound(code);
        }
        this.score++;
        this.timeoutId = setTimeout(() => this.continueWith(winner), 1300);
    }

    revealAnswer(code, winner) {
        document.getElementById('value-' + this.unknown.code).innerHTML = this.formatItemValue(this.unknown);
        document.getElementById('decide-' + winner.code).classList.add('correct');
        this.playCorrectSoundIf(code === winner.code);
        this.playWrongSoundIf(code !== winner.code);
    }

    loseRound(code) {
        document.getElementById('decide-' + code).classList.add('wrong');
        this.timeoutId = setTimeout(() => this.finish(), 1500);
    }

    continueWith(winner) {
        if (!this.isFirstRound || winner.code === this.known.code) {
            this.known = this.unknown;
            this.knownSide = this.knownSide === 'left' ? 'right' : 'left';
        }
        this.isFirstRound = false;
        this.nextRound();
    }

    checkStreakAchievements() {
        this.achievements.unlockIf(this.score >= 10, 'value-10');
        this.achievements.unlockIf(this.score >= 25, 'value-25');
    }

    finish() {
        this.finished = true;
        const isRecord = this.storage.saveGameResult(this.achievementKey, false, this.score);
        this.storage.saveTopScore(this.achievementKey, this.score, '');
        this.checkStreakAchievements();
        this.playEndSound(isRecord, this.score < 3);
        const stats = this.storage.getGameStats(this.achievementKey);
        this.showScreen(footballStreakEndTemplate(this.title, this.score, stats.highscore, this.getRecordText(isRecord), this.achievementKey));
    }
}
