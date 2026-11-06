class SquadDuel extends ValueDuel {
    constructor() {
        super();
        this.achievementKey = 'squadduel';
        this.title = 'Welcher Kader ist mehr wert?';
        this.rules = 'Der Kaderwert ist die Summe aller Spieler-Marktwerte. Mal wird nach dem höheren, mal nach dem niedrigeren Wert gefragt. Jeder Verein bleibt höchstens zwei Runden. Ein Fehler und das Spiel ist vorbei.';
    }

    createPool() {
        const squads = {};
        for (let i = 0; i < this.football.players.length; i++) {
            const player = this.football.players[i];
            squads[player.club] = (squads[player.club] || 0) + player.value;
        }
        const clubs = this.football.clubs.filter(club => squads[club.code] > 0);
        return clubs.map(club => ({ ...club, squadValue: squads[club.code] }));
    }

    getValue(club) {
        return club.squadValue;
    }

    formatItemValue(club) {
        return this.football.formatValue(club.squadValue);
    }

    getQuestion() {
        return this.askMore ? 'Welcher Kader ist mehr wert?' : 'Welcher Kader ist weniger wert?';
    }

    buildCard(club, valueText) {
        const league = FOOTBALL_LEAGUES[club.league];
        return squadCardTemplate(club, league.name, valueText);
    }

    checkStreakAchievements() {
        this.achievements.unlockIf(this.score >= 10, 'squad-10');
        this.achievements.unlockIf(this.score >= 25, 'squad-25');
    }
}
