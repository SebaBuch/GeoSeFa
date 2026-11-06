const WORDLE_FIELDS = ['league', 'club', 'position', 'nation', 'age', 'number', 'value'];

class PlayerWordle extends FootballGame {
    constructor() {
        super();
        this.achievementKey = 'playerwordle';
        this.maxGuesses = 8;
    }

    start() {
        const pool = this.football.players.filter(player => player.value >= 5000000);
        this.target = this.pickItem(pool);
        this.guesses = [];
        this.firstGreen = {};
        this.rowsHtml = '';
        this.finished = false;
        this.showScreen(playerWordleTemplate());
        this.updateInfo();
    }

    getSuggestionNames() {
        return this.football.getSortedNames(this.football.players);
    }

    submitGuess(event) {
        event.preventDefault();
        if (this.finished) {
            return;
        }
        const player = this.football.findByName(this.football.players, this.readInput('wordle-input'));
        if (!player) {
            this.setMessage('Diesen Spieler kenne ich nicht.', 'error');
        } else if (this.guesses.includes(player.code)) {
            this.setMessage(player.name + ' hast du schon geraten.', 'error');
        } else {
            this.addGuess(player);
        }
    }

    addGuess(player) {
        this.guesses.push(player.code);
        this.showGuessRow(player);
        if (player.code === this.target.code) {
            this.finish(true);
        } else if (this.guesses.length >= this.maxGuesses) {
            this.finish(false);
        } else {
            this.updateInfo();
        }
    }

    showGuessRow(player) {
        const result = this.compare(player);
        this.recordGreens(result);
        this.rowsHtml += wordleRowTemplate(result);
        document.getElementById('wordle-rows').innerHTML = this.rowsHtml;
        this.setMessage('', '');
    }

    compare(player) {
        const target = this.target;
        const club = this.football.getClub(player.club);
        const targetClub = this.football.getClub(target.club);
        const result = {
            player: player,
            logo: club.logo,
            league: this.createCell(FOOTBALL_LEAGUES[club.league].name, club.league === targetClub.league),
            club: this.createCell(club.name, club.code === targetClub.code),
            position: this.createCell(player.position, player.position === target.position),
            nation: this.createCell(player.nation, player.nation === target.nation)
        };
        return { ...result, ...this.compareNumbers(player) };
    }

    compareNumbers(player) {
        const target = this.target;
        return {
            age: this.createNumberCell(this.football.getAge(player.birth), this.football.getAge(target.birth), ''),
            number: this.createNumberCell(player.number, target.number, ''),
            value: this.createNumberCell(player.value, target.value, this.football.formatValue(player.value))
        };
    }

    createCell(text, isCorrect) {
        return { text: text, className: isCorrect ? 'cell-correct' : 'cell-wrong' };
    }

    createNumberCell(value, targetValue, label) {
        const text = label === '' ? String(value) : label;
        if (value === targetValue) {
            return this.createCell(text, true);
        }
        return this.createCell(text + (targetValue > value ? ' ▲' : ' ▼'), false);
    }

    recordGreens(result) {
        for (let i = 0; i < WORDLE_FIELDS.length; i++) {
            const field = WORDLE_FIELDS[i];
            if (result[field].className === 'cell-correct' && this.firstGreen[field] === undefined) {
                this.firstGreen[field] = this.guesses.length - 1;
            }
        }
    }

    getScore(won) {
        let points = 0;
        for (let i = 0; i < WORDLE_FIELDS.length; i++) {
            const index = this.firstGreen[WORDLE_FIELDS[i]];
            points += index === undefined ? 0 : Math.max(1, 10 - index);
        }
        const bonus = won ? (this.maxGuesses - this.guesses.length + 1) * 5 : 0;
        return Math.min(100, points + bonus);
    }

    updateInfo() {
        document.getElementById('wordle-info').innerHTML = geodleInfoTemplate(this.maxGuesses - this.guesses.length, this.getScore(false));
    }

    finish(won) {
        this.finished = true;
        this.score = this.getScore(won);
        const isRecord = this.storage.saveGameResult('playerwordle', won, this.score);
        this.storage.saveTopScore('playerwordle', this.score, won ? this.guesses.length + ' Versuche' : '');
        this.checkWordleAchievements(won);
        this.playEndSound(won, !won);
        const text = won ? 'Gefunden in ' + this.guesses.length + ' Versuchen! ' + this.getRecordText(isRecord) : 'Leider nicht gefunden.';
        document.getElementById('wordle-info').innerHTML = wordleEndTemplate(text, this.target, this.football.getClub(this.target.club), this.score);
    }

    checkWordleAchievements(won) {
        this.achievements.increase('wordle-wins', won ? 1 : 0);
        this.achievements.unlockIf(won && this.guesses.length <= 3, 'wordle-fast');
    }
}
