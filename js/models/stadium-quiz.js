class StadiumQuiz extends FootballGame {
    constructor() {
        super();
        this.achievementKey = 'stadiumquiz';
        this.totalRounds = 10;
    }

    start() {
        this.score = 0;
        this.round = 0;
        this.finished = false;
        this.showScreen(stadiumQuizTemplate());
        this.nextRound();
    }

    nextRound() {
        if (this.round >= this.totalRounds) {
            return this.finishScore('Stadion-Quiz', this.totalRounds * 10);
        }
        this.round++;
        this.locked = false;
        this.club = this.pickItem(this.football.clubs);
        this.askCapacity = this.round % 2 === 0;
        const question = (this.askCapacity ? 'Wie viele Plätze hat dieses Stadion? ' : 'Welcher Verein spielt hier? ') + '<b>' + this.club.stadium + '</b>';
        document.getElementById('stadium-question').innerHTML = question;
        document.getElementById('quiz-options').innerHTML = this.buildOptions();
        document.getElementById('stadium-info').innerHTML = crestInfoTemplate(this.round, this.totalRounds, this.score, '');
        this.setMessage('', '');
    }

    buildOptions() {
        const options = this.pickOthers(this.getDistinctClubs(), this.club, 3);
        if (!this.askCapacity) {
            return this.buildChoiceHtml(options, 'name');
        }
        let html = '';
        for (let i = 0; i < options.length; i++) {
            html += footballOptionTemplate(options[i].code, formatNumber(options[i].capacity) + ' Plätze');
        }
        return html;
    }

    getDistinctClubs() {
        if (!this.askCapacity) {
            return this.football.clubs.filter(club => club.code === this.club.code || club.stadium !== this.club.stadium);
        }
        return this.football.clubs.filter(club => club.code === this.club.code || club.capacity !== this.club.capacity);
    }

    choose(code) {
        if (this.locked || this.finished) {
            return;
        }
        this.locked = true;
        this.markOptions(code, this.club.code);
        this.score += code === this.club.code ? 10 : 0;
        const answer = this.askCapacity ? formatNumber(this.club.capacity) + ' Plätze' : this.club.name;
        this.setMessage((code === this.club.code ? 'Richtig: ' : 'Falsch. Richtig ist: ') + answer, code === this.club.code ? 'green' : 'red');
        this.timeoutId = setTimeout(() => this.nextRound(), 1500);
    }

    checkEndAchievements() {
        this.achievements.unlockIf(this.score >= 80, 'stadium-80');
        this.achievements.unlockIf(this.score === 100, 'stadium-perfect');
    }
}
