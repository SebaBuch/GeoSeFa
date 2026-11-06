const CREST_BLUR_STEPS = [26, 16, 9, 3];

const CREST_POINTS = [10, 7, 4, 2];

class CrestQuiz extends FootballGame {
    constructor() {
        super();
        this.achievementKey = 'crestquiz';
        this.totalRounds = 10;
    }

    start() {
        this.score = 0;
        this.round = 0;
        this.firstTries = 0;
        this.finished = false;
        this.order = this.shuffleItems(this.football.clubs);
        this.showScreen(crestQuizTemplate());
        this.nextRound();
    }

    nextRound() {
        if (this.round >= this.totalRounds) {
            return this.finishScore('Wappen-Quiz', this.totalRounds * CREST_POINTS[0]);
        }
        this.club = this.order[this.round % this.order.length];
        this.round++;
        this.tries = 0;
        this.locked = false;
        this.setMessage('', '');
        this.updateCrest();
    }

    updateCrest() {
        const blur = this.locked ? 0 : CREST_BLUR_STEPS[this.tries];
        document.getElementById('crest-area').innerHTML = crestImageTemplate(this.club.logo, blur);
        document.getElementById('crest-info').innerHTML = crestInfoTemplate(this.round, this.totalRounds, this.score, this.getPointsText());
    }

    getPointsText() {
        return this.locked ? '' : 'Jetzt: ' + CREST_POINTS[this.tries] + ' Punkte';
    }

    submitGuess(event) {
        event.preventDefault();
        if (this.locked || this.finished) {
            return;
        }
        const club = this.football.findByName(this.football.clubs, this.readInput('crest-input'));
        if (!club) {
            return this.setMessage('Diesen Verein kenne ich nicht.', 'error');
        }
        this.checkGuess(club);
    }

    checkGuess(club) {
        const isCorrect = club.code === this.club.code;
        this.playCorrectSoundIf(isCorrect);
        this.playWrongSoundIf(!isCorrect);
        if (isCorrect) {
            return this.solveRound();
        }
        this.tries++;
        if (this.tries >= CREST_BLUR_STEPS.length) {
            return this.failRound();
        }
        this.setMessage(club.name + ' ist falsch. Das Wappen wird schärfer.', 'red');
        this.updateCrest();
    }

    solveRound() {
        const points = CREST_POINTS[this.tries];
        this.score += points;
        this.firstTries += this.tries === 0 ? 1 : 0;
        this.achievements.increase('crest-first-try', this.tries === 0 ? 1 : 0);
        this.endRound('Richtig, ' + this.club.name + '! +' + points + ' Punkte', 'green');
    }

    failRound() {
        this.endRound('Leider nicht. Das war ' + this.club.name + '.', 'red');
    }

    endRound(text, type) {
        this.locked = true;
        this.setMessage(text, type);
        this.updateCrest();
        this.timeoutId = setTimeout(() => this.nextRound(), 1600);
    }

    skip() {
        if (!this.locked && !this.finished) {
            this.failRound();
        }
    }

    checkEndAchievements() {
        this.achievements.unlockIf(this.score >= 80, 'crest-80');
        this.achievements.unlockIf(this.score === 100, 'crest-perfect');
        this.achievements.unlockIf(this.score === 0, 'hidden-own-goal');
    }
}
