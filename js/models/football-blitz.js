const FOOTBALL_BLITZ_CATEGORIES = {
    players: { title: 'Spieler', question: 'Bei welchem Verein spielt' },
    crests: { title: 'Wappen', question: 'Welcher Verein ist das?' },
    stadiums: { title: 'Stadien', question: 'Welcher Verein spielt hier?' }
};

class FootballBlitz extends FootballGame {
    constructor() {
        super();
        this.achievementKey = 'footballblitz';
        this.seconds = 60;
    }

    start() {
        this.sound.stop();
        this.finished = false;
        const players = this.storage.getGameStats('footballblitz-players').highscore;
        const crests = this.storage.getGameStats('footballblitz-crests').highscore;
        const stadiums = this.storage.getGameStats('footballblitz-stadiums').highscore;
        this.showScreen(footballBlitzSelectTemplate(players, crests, stadiums));
    }

    chooseCategory(category) {
        this.sound.stop();
        this.category = category;
        this.score = 0;
        this.wrongCount = 0;
        this.finished = false;
        this.showScreen(footballBlitzTemplate(FOOTBALL_BLITZ_CATEGORIES[category].title));
        this.timer = new Timer('blitz-timer');
        this.timer.start(this.seconds, this);
        this.nextQuestion();
    }

    nextQuestion() {
        if (this.finished) {
            return;
        }
        this.locked = false;
        this.pickQuestion();
        const options = this.pickOthers(this.getOptionPool(), this.club, 3);
        document.getElementById('quiz-options').innerHTML = this.buildChoiceHtml(options, 'name');
        document.getElementById('blitz-score').innerHTML = this.score;
    }

    pickQuestion() {
        const question = FOOTBALL_BLITZ_CATEGORIES[this.category].question;
        if (this.category === 'players') {
            const player = this.pickItem(this.football.players);
            this.club = this.football.getClub(player.club);
            return this.showPrompt(playerPromptTemplate(question, player));
        }
        const isCrest = this.category === 'crests';
        this.club = this.pickItem(isCrest ? this.football.clubs : this.football.stadiumClubs);
        this.showPrompt(isCrest ? crestPromptTemplate(question, this.club.logo) : stadiumPromptTemplate(question, this.club.stadium));
    }

    showPrompt(html) {
        document.getElementById('quiz-prompt').innerHTML = html;
    }

    getOptionPool() {
        if (this.category !== 'stadiums') {
            return this.football.clubs;
        }
        return this.football.stadiumClubs.filter(club => club.code === this.club.code || club.stadium !== this.club.stadium);
    }

    choose(code) {
        if (this.locked || this.finished) {
            return;
        }
        this.locked = true;
        this.markOptions(code, this.club.code);
        this.score += code === this.club.code ? 1 : 0;
        this.wrongCount += code === this.club.code ? 0 : 1;
        document.getElementById('blitz-score').innerHTML = this.score;
        this.timeoutId = setTimeout(() => this.nextQuestion(), 500);
    }

    handleTimeUp() {
        this.finished = true;
        this.timer.stop();
        clearTimeout(this.timeoutId);
        const statsKey = 'footballblitz-' + this.category;
        const isRecord = this.storage.saveGameResult(statsKey, true, this.score);
        this.storage.saveTopScore(statsKey, this.score, '');
        this.checkBlitzAchievements();
        this.playEndSound(isRecord, this.score < 5);
        const highscore = this.storage.getGameStats(statsKey).highscore;
        this.showScreen(footballBlitzEndTemplate(FOOTBALL_BLITZ_CATEGORIES[this.category].title, this.score, highscore, this.getRecordText(isRecord), this.category));
    }

    checkBlitzAchievements() {
        this.achievements.unlockIf(this.score >= 15, 'fbblitz-15');
        this.achievements.unlockIf(this.score >= 30, 'fbblitz-30');
        this.achievements.unlockIf(this.score >= 15 && this.wrongCount === 0, 'fbblitz-perfect');
    }

    stop() {
        super.stop();
        this.finished = true;
        if (this.timer) {
            this.timer.stop();
        }
    }
}
