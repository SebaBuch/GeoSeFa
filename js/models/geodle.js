class Geodle extends BaseGame {
    constructor() {
        super();
        this.achievementKey = 'geodle';
        this.maxGuesses = 10;
    }

    start() {
        const pool = this.getPlayableCountries().filter(country => country.population > 0);
        this.target = this.pickItem(pool);
        this.guesses = [];
        this.rowsHtml = '';
        this.finished = false;
        this.showScreen(geodleTemplate());
        this.updateInfo();
    }

    submitGuess(event) {
        event.preventDefault();
        if (this.finished) {
            return;
        }
        const country = this.countries.findByName(this.readInput('geodle-input'));
        if (!country) {
            this.setMessage('Dieses Land kenne ich nicht.', 'error');
        } else if (this.guesses.includes(country.code)) {
            this.setMessage(country.name + ' hast du schon geraten.', 'error');
        } else {
            this.addGuess(country);
        }
    }

    addGuess(country) {
        this.guesses.push(country.code);
        this.achievements.unlockIf(this.guesses.length === 1 && country.code === 'DEU', 'hidden-patriot');
        this.rowsHtml += geodleRowTemplate(this.compare(country));
        document.getElementById('geodle-rows').innerHTML = this.rowsHtml;
        this.setMessage('', '');
        if (country.code === this.target.code) {
            this.finish(true);
        } else if (this.guesses.length >= this.maxGuesses) {
            this.finish(false);
        } else {
            this.updateInfo();
        }
    }

    compare(country) {
        const target = this.target;
        const isSame = country.code === target.code;
        const isNeighbor = target.borders.includes(country.code);
        return {
            country: country,
            continent: this.createCell(country.continent, country.continent === target.continent),
            landlocked: this.createCell(this.yesNo(country.landlocked), country.landlocked === target.landlocked),
            neighbor: this.createCell(isSame ? '–' : this.yesNo(isNeighbor), isNeighbor || isSame),
            population: this.createNumberCell(formatPopulation(country.population), country.population, target.population),
            area: this.createNumberCell(formatNumber(country.area) + ' km²', country.area, target.area)
        };
    }

    createCell(text, isCorrect) {
        return { text: text, className: isCorrect ? 'cell-correct' : 'cell-wrong' };
    }

    createNumberCell(text, value, targetValue) {
        if (value === targetValue) {
            return { text: text, className: 'cell-correct' };
        }
        const arrow = targetValue > value ? ' ▲' : ' ▼';
        const ratio = Math.max(value, targetValue) / Math.min(value, targetValue);
        const className = ratio <= 1.5 ? 'cell-close' : 'cell-wrong';
        return { text: text + arrow, className: className };
    }

    yesNo(value) {
        return value ? 'Ja' : 'Nein';
    }

    updateInfo() {
        const guessesLeft = this.maxGuesses - this.guesses.length;
        document.getElementById('geodle-info').innerHTML = geodleInfoTemplate(guessesLeft);
    }

    finish(won) {
        this.finished = true;
        this.checkGeodleAchievements(won);
        if (this.daily) {
            this.finishGeodleDaily(won);
            return;
        }
        this.storage.saveGameResult('geodle', won, 0);
        this.achievements.unlockIf(this.storage.getGameStats('geodle').streak >= 10, 'geodle-streak-10');
        this.storage.saveTopScore('geodle', this.getGeodleScore(won), this.target.name);
        this.playEndSound(won, !won);
        const text = won ? 'Richtig! Gesucht war:' : 'Leider nicht geschafft. Gesucht war:';
        document.getElementById('geodle-info').innerHTML = geodleEndTemplate(text, this.target);
    }

    checkGeodleAchievements(won) {
        if (!won) {
            return;
        }
        this.achievements.increase('geodle-wins', 1);
        this.achievements.increase('geodle-ones', this.guesses.length === 1 ? 1 : 0);
        this.achievements.unlockIf(this.guesses.length <= 3, 'geodle-three');
        this.achievements.unlockIf(this.guesses.length === this.maxGuesses, 'geodle-last');
    }

    getDuelScore() {
        return this.target ? this.getGeodleScore(this.guesses.includes(this.target.code)) : 0;
    }

    getGeodleScore(won) {
        return won ? (this.maxGuesses - this.guesses.length + 1) * 10 : 0;
    }

    finishGeodleDaily(won) {
        const score = this.getGeodleScore(won);
        this.finishDaily('geodle', score, won);
        const text = (won ? 'Richtig! Das Land des Tages war ' : 'Nicht geschafft. Das Land des Tages war ') + this.target.name + '.';
        document.getElementById('geodle-info').innerHTML = dailyEndTemplate(text, score);
    }
}
