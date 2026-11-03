const CONNECTION_TYPES = ['name', 'flag', 'outline', 'capital', 'population', 'area'];

const TILE_LABELS = {
    name: 'Land',
    capital: 'Hauptstadt',
    population: 'Einwohner',
    area: 'Fläche'
};

class GeoConnections extends BaseGame {
    constructor() {
        super();
        this.achievementKey = 'geoconnections';
        this.groupCount = 4;
        this.maxMistakes = 4;
    }

    start() {
        this.groups = this.createGroups();
        this.tiles = this.createTiles();
        this.selected = [];
        this.solved = [];
        this.mistakes = 0;
        this.finished = false;
        this.showScreen(connectionsTemplate());
        this.renderBoard();
    }

    createGroups() {
        const pool = this.getPlayableCountries().filter(country => country.capital !== '' && country.flag !== '');
        const continent = randomItem(pool).continent;
        const sameContinent = pool.filter(country => country.continent === continent);
        const source = sameContinent.length >= this.groupCount ? sameContinent : pool;
        return shuffle(source).slice(0, this.groupCount);
    }

    createTiles() {
        const tiles = [];
        for (let i = 0; i < this.groups.length; i++) {
            const types = shuffle(CONNECTION_TYPES).slice(0, 4);
            for (let j = 0; j < types.length; j++) {
                tiles.push({ code: this.groups[i].code, type: types[j] });
            }
        }
        const shuffledTiles = shuffle(tiles);
        for (let i = 0; i < shuffledTiles.length; i++) {
            shuffledTiles[i].id = i;
        }
        return shuffledTiles;
    }

    renderBoard() {
        document.getElementById('connections-solved').innerHTML = this.buildSolvedHtml();
        document.getElementById('connections-board').innerHTML = this.buildTilesHtml();
        document.getElementById('connections-mistakes').innerHTML = this.buildMistakesHtml();
        this.updateSubmitButton();
    }

    buildSolvedHtml() {
        let html = '';
        for (let i = 0; i < this.solved.length; i++) {
            const country = this.countries.getCountry(this.solved[i]);
            html += solvedGroupTemplate(country, this.buildGroupItems(country.code), i);
        }
        return html;
    }

    buildGroupItems(code) {
        let html = '';
        for (let i = 0; i < this.tiles.length; i++) {
            if (this.tiles[i].code === code) {
                html += solvedItemTemplate(this.getTileContent(this.tiles[i]));
            }
        }
        return html;
    }

    buildTilesHtml() {
        let html = '';
        for (let i = 0; i < this.tiles.length; i++) {
            const tile = this.tiles[i];
            if (!this.solved.includes(tile.code)) {
                const selectedClass = this.selected.includes(tile.id) ? 'selected' : '';
                html += connectionTileTemplate(tile.id, this.getTileContent(tile), selectedClass);
            }
        }
        return html;
    }

    getTileContent(tile) {
        const country = this.countries.getCountry(tile.code);
        if (tile.type === 'flag') {
            return tileFlagTemplate(country.flag);
        }
        if (tile.type === 'outline') {
            return this.shapes.getOutlineSvg(country.code, '');
        }
        return tileTextTemplate(TILE_LABELS[tile.type], this.getTileText(country, tile.type));
    }

    getTileText(country, type) {
        if (type === 'name') {
            return country.name;
        }
        if (type === 'capital') {
            return country.capital;
        }
        if (type === 'population') {
            return formatNumber(country.population);
        }
        return formatNumber(country.area) + ' km²';
    }

    buildMistakesHtml() {
        let html = '';
        for (let i = 0; i < this.maxMistakes; i++) {
            const className = i < this.mistakes ? 'used' : '';
            html += mistakeDotTemplate(className);
        }
        return html;
    }

    toggleTile(id) {
        if (this.finished) {
            return;
        }
        const index = this.selected.indexOf(id);
        if (index >= 0) {
            this.selected.splice(index, 1);
        } else if (this.selected.length < 4) {
            this.selected.push(id);
        }
        document.getElementById('tile-' + id).classList.toggle('selected', this.selected.includes(id));
        this.updateSubmitButton();
    }

    updateSubmitButton() {
        const button = document.getElementById('connections-submit');
        button.disabled = this.selected.length !== 4 || this.finished;
    }

    submitSelection() {
        if (this.selected.length !== 4 || this.finished) {
            return;
        }
        const codes = this.getSelectedCodes();
        const bestMatch = this.getBestMatch(codes);
        if (bestMatch.count === 4) {
            this.solveGroup(bestMatch.code);
        } else {
            this.addMistake(bestMatch.count);
        }
    }

    getSelectedCodes() {
        const codes = [];
        for (let i = 0; i < this.selected.length; i++) {
            codes.push(this.tiles[this.selected[i]].code);
        }
        return codes;
    }

    getBestMatch(codes) {
        let best = { code: '', count: 0 };
        for (let i = 0; i < codes.length; i++) {
            const sameCodes = codes.filter(code => code === codes[i]);
            if (sameCodes.length > best.count) {
                best = { code: codes[i], count: sameCodes.length };
            }
        }
        return best;
    }

    solveGroup(code) {
        this.solved.push(code);
        this.selected = [];
        this.setMessage('Richtig: ' + this.countries.getCountry(code).name, 'green');
        this.achievements.increase('correct', 1);
        this.sound.playWinSound();
        if (this.solved.length === this.groupCount) {
            this.finish(true);
        }
        this.renderBoard();
    }

    addMistake(count) {
        const wrongIds = [...this.selected];
        this.mistakes++;
        this.setMessage(count === 3 ? 'Fast! Eins ist falsch.' : 'Leider falsch.', 'red');
        if (this.mistakes >= this.maxMistakes) {
            this.finish(false);
        }
        this.renderBoard();
        this.flashTiles(wrongIds);
    }

    flashTiles(ids) {
        for (let i = 0; i < ids.length; i++) {
            const tile = document.getElementById('tile-' + ids[i]);
            if (tile) {
                tile.classList.add('wrong-blink');
            }
        }
    }

    checkConnectionAchievements(won) {
        this.storage.saveTopScore('geoconnections', won ? 100 - this.mistakes * 20 : 0, this.mistakes + ' Fehler');
        if (!won) {
            return;
        }
        this.achievements.increase('conn-wins', 1);
        this.achievements.unlockIf(this.mistakes === 0, 'conn-perfect');
        this.achievements.unlockIf(this.mistakes === 3, 'conn-close');
    }

    finish(won) {
        this.finished = true;
        this.storage.saveGameResult('geoconnections', won, 0);
        this.checkConnectionAchievements(won);
        this.playEndSound(won, false);
        this.playWrongSoundIf(!won);
        for (let i = 0; i < this.groups.length; i++) {
            if (!this.solved.includes(this.groups[i].code)) {
                this.solved.push(this.groups[i].code);
            }
        }
        this.selected = [];
        document.getElementById('connections-end').innerHTML = connectionsEndTemplate(won ? 'Super, alle Gruppen gefunden!' : 'Keine Fehler mehr übrig. Hier sind alle Gruppen.');
    }
}
