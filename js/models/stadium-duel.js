class StadiumDuel extends ValueDuel {
    constructor() {
        super();
        this.achievementKey = 'stadiumduel';
        this.title = 'Stadion-Quiz';
        this.rules = 'Mal wird nach mehr, mal nach weniger Plätzen gefragt. Jedes Stadion bleibt höchstens zwei Runden. Ein Fehler und das Spiel ist vorbei.';
    }

    createPool() {
        const stadiums = [];
        for (let i = 0; i < this.football.clubs.length; i++) {
            const club = this.football.clubs[i];
            const existing = stadiums.filter(stadium => stadium.name === club.stadium)[0];
            if (existing) {
                existing.clubs.push(club);
            } else {
                stadiums.push({ code: club.code, name: club.stadium, capacity: club.capacity, clubs: [club] });
            }
        }
        return stadiums;
    }

    getValue(stadium) {
        return stadium.capacity;
    }

    formatItemValue(stadium) {
        return formatNumber(stadium.capacity) + ' Plätze';
    }

    getQuestion() {
        return this.askMore ? 'Welches Stadion hat mehr Plätze?' : 'Welches Stadion hat weniger Plätze?';
    }

    buildCard(stadium, valueText) {
        let crestsHtml = '';
        let clubNames = '';
        for (let i = 0; i < stadium.clubs.length; i++) {
            crestsHtml += stadiumCrestTemplate(stadium.clubs[i]);
            clubNames += (i > 0 ? ' & ' : '') + stadium.clubs[i].name;
        }
        return stadiumCardTemplate(stadium, crestsHtml, clubNames, valueText);
    }

    checkStreakAchievements() {
        this.achievements.unlockIf(this.score >= 10, 'stadium-80');
        this.achievements.unlockIf(this.score >= 25, 'stadium-perfect');
    }
}
