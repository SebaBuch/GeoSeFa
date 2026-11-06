class FootballService {
    constructor() {
        this.clubs = this.createList(FOOTBALL_CLUBS);
        this.stadiumClubs = this.clubs.filter(club => club.stadium);
        this.players = this.createPlayerList();
    }

    createPlayerList() {
        let players = [];
        for (let i = 0; i < FOOTBALL_PLAYER_SETS.length; i++) {
            players = [...players, ...this.createList(FOOTBALL_PLAYER_SETS[i])];
        }
        return this.makeNamesUnique(players);
    }

    makeNamesUnique(players) {
        const counts = {};
        for (let i = 0; i < players.length; i++) {
            counts[players[i].name] = (counts[players[i].name] || 0) + 1;
        }
        for (let i = 0; i < players.length; i++) {
            if (counts[players[i].name] > 1) {
                players[i].name = players[i].name + ' (' + this.getClub(players[i].club).name + ')';
            }
        }
        return players;
    }

    createList(data) {
        const ids = Object.keys(data);
        const list = [];
        for (let i = 0; i < ids.length; i++) {
            list.push({ ...data[ids[i]], code: ids[i] });
        }
        return list;
    }

    getClub(id) {
        return this.clubs.filter(club => club.code === id)[0];
    }

    getPlayer(id) {
        return this.players.filter(player => player.code === id)[0];
    }

    getSortedNames(list) {
        const names = [];
        for (let i = 0; i < list.length; i++) {
            names.push(list[i].name);
        }
        names.sort();
        return names;
    }

    findByName(list, name) {
        const text = normalizeText(name);
        return list.filter(item => normalizeText(item.name) === text)[0];
    }

    getAge(birth) {
        const today = new Date();
        const born = new Date(birth);
        const age = today.getFullYear() - born.getFullYear();
        const hadBirthday = today.getMonth() > born.getMonth() || (today.getMonth() === born.getMonth() && today.getDate() >= born.getDate());
        return hadBirthday ? age : age - 1;
    }

    getPositionGroup(position) {
        if (position === 'Torwart') {
            return 'Tor';
        }
        if (position.includes('Verteidiger')) {
            return 'Abwehr';
        }
        return position.includes('Mittelfeld') ? 'Mittelfeld' : 'Angriff';
    }

    formatValue(value) {
        if (value >= 1000000000) {
            return (value / 1000000000).toLocaleString('de-DE', { maximumFractionDigits: 2 }) + ' Mrd. €';
        }
        if (value >= 1000000) {
            return (value / 1000000).toLocaleString('de-DE', { maximumFractionDigits: 2 }) + ' Mio. €';
        }
        return value > 0 ? formatNumber(value / 1000) + ' Tsd. €' : '–';
    }
}

class FootballGame extends BaseGame {
    constructor() {
        super();
        this.football = footballService;
    }

    getSuggestionNames() {
        return this.football.getSortedNames(this.football.clubs);
    }

    playEndSound(isWin, isBad) {
        this.achievements.increase('football-games', 1);
        this.achievements.unlockIf(this.hasPlayedAllFootball(), 'fb-all');
        super.playEndSound(isWin, isBad);
    }

    hasPlayedAllFootball() {
        for (let i = 0; i < FOOTBALL_GAMES.length; i++) {
            if (this.achievements.getCounter('end-' + FOOTBALL_GAMES[i].key) === 0 && FOOTBALL_GAMES[i].key !== this.achievementKey) {
                return false;
            }
        }
        return true;
    }

    buildChoiceHtml(options, labelKey) {
        let html = '';
        for (let i = 0; i < options.length; i++) {
            html += footballOptionTemplate(options[i].code, options[i][labelKey]);
        }
        return html;
    }

    pickOthers(list, correct, count) {
        const others = list.filter(item => item.code !== correct.code);
        const options = this.shuffleItems(others).slice(0, count);
        options.push(correct);
        return this.shuffleItems(options);
    }

    markOptions(chosenCode, correctCode) {
        document.getElementById('option-' + correctCode).classList.add('correct');
        if (chosenCode !== correctCode) {
            document.getElementById('option-' + chosenCode).classList.add('wrong');
        }
        this.playCorrectSoundIf(chosenCode === correctCode);
        this.playWrongSoundIf(chosenCode !== correctCode);
    }

    finishScore(title, maxScore) {
        this.finished = true;
        const isRecord = this.storage.saveGameResult(this.achievementKey, this.score >= maxScore / 2, this.score);
        this.storage.saveTopScore(this.achievementKey, this.score, '');
        this.checkEndAchievements();
        this.playEndSound(isRecord, this.score < maxScore / 4);
        const stats = this.storage.getGameStats(this.achievementKey);
        this.showScreen(scoreEndTemplate(title, this.score, maxScore, stats.highscore, this.getRecordText(isRecord), this.achievementKey));
    }

    checkEndAchievements() {
    }
}
