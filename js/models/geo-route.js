class GeoRoute extends BaseGame {
    constructor() {
        super();
        this.achievementKey = 'georoute';
        this.minSteps = 3;
        this.maxSteps = 6;
    }

    start() {
        this.createRoute();
        this.guesses = [];
        this.current = this.startCountry.code;
        this.finished = false;
        const html = geoRouteTemplate(this.startCountry, this.targetCountry);
        this.showScreen(html);
        this.setupMap();
        this.updateInfo();
    }

    setupMap() {
        this.worldMap.create('map', this.startCountry.continent);
        this.worldMap.hideAll();
        this.worldMap.colorCountry(this.startCountry.code, MAP_COLORS.start);
        this.worldMap.colorCountry(this.targetCountry.code, MAP_COLORS.target);
        this.worldMap.fitCountries([this.startCountry.code, this.targetCountry.code]);
    }

    isIsland(code) {
        return ROUTE_ISLAND_COUNTRIES.includes(code);
    }

    isBlocked(firstCode, secondCode) {
        for (let i = 0; i < ROUTE_BLOCKED_BORDERS.length; i++) {
            const pair = ROUTE_BLOCKED_BORDERS[i];
            if (pair.includes(firstCode) && pair.includes(secondCode)) {
                return true;
            }
        }
        return false;
    }

    getLandNeighbors(country) {
        if (this.isIsland(country.code)) {
            return [];
        }
        const neighbors = this.countries.getNeighbors(country);
        const landNeighbors = neighbors.filter(neighbor => !this.isIsland(neighbor.code) && !this.isBlocked(country.code, neighbor.code));
        return landNeighbors;
    }

    hasLandBorder(firstCode, secondCode) {
        const neighbors = this.getLandNeighbors(this.countries.getCountry(firstCode));
        for (let i = 0; i < neighbors.length; i++) {
            if (neighbors[i].code === secondCode) {
                return true;
            }
        }
        return false;
    }

    createRoute() {
        const candidates = this.getRouteCandidates();
        for (let attempt = 0; attempt < 100; attempt++) {
            const target = this.pickItem(candidates);
            const distances = this.getDistances(target.code);
            const startCodes = this.getStartCodes(distances);
            if (startCodes.length > 0) {
                this.setRoute(this.countries.getCountry(this.pickCode(startCodes)), target, distances);
                return;
            }
        }
    }

    getRouteCandidates() {
        const playable = this.getPlayableCountries();
        const candidates = playable.filter(country => this.getLandNeighbors(country).length > 0);
        return candidates;
    }

    getDistances(targetCode) {
        const distances = {};
        distances[targetCode] = 0;
        const queue = [targetCode];
        for (let i = 0; i < queue.length; i++) {
            this.addNeighbors(queue[i], distances, queue);
        }
        return distances;
    }

    addNeighbors(code, distances, queue) {
        const neighbors = this.getLandNeighbors(this.countries.getCountry(code));
        for (let i = 0; i < neighbors.length; i++) {
            if (distances[neighbors[i].code] === undefined) {
                distances[neighbors[i].code] = distances[code] + 1;
                queue.push(neighbors[i].code);
            }
        }
    }

    getStartCodes(distances) {
        const codes = Object.keys(distances);
        const startCodes = [];
        for (let i = 0; i < codes.length; i++) {
            const distance = distances[codes[i]];
            if (distance >= this.minSteps && distance <= this.maxSteps && this.shapes.hasShape(codes[i])) {
                startCodes.push(codes[i]);
            }
        }
        return startCodes;
    }

    setRoute(start, target, distances) {
        this.startCountry = start;
        this.targetCountry = target;
        this.distances = distances;
        this.neededCountries = distances[start.code] - 1;
        this.maxGuesses = this.neededCountries + 2;
    }

    submitGuess(event) {
        event.preventDefault();
        if (this.finished) {
            return;
        }
        const country = this.countries.findByName(this.readInput('guess-input'));
        if (!country) {
            this.setMessage('Dieses Land kenne ich nicht.', 'error');
        } else if (this.isUsed(country.code)) {
            this.setMessage(country.name + ' ist schon in deiner Route.', 'error');
        } else {
            this.evaluateGuess(country);
        }
    }

    isUsed(code) {
        if (code === this.startCountry.code) {
            return true;
        }
        for (let i = 0; i < this.guesses.length; i++) {
            if (this.guesses[i].code === code && this.guesses[i].color !== 'red') {
                return true;
            }
        }
        return false;
    }

    evaluateGuess(country) {
        const color = this.getGuessColor(country.code);
        this.checkKaliningrad(color, country.code);
        this.guesses.push({ code: country.code, name: country.name, color: color });
        this.worldMap.colorCountry(country.code, MAP_COLORS[color]);
        this.playWrongSoundIf(color === 'red');
        this.playCorrectSoundIf(color === 'green');
        const previousName = this.countries.getCountry(this.current).name;
        this.current = color === 'red' ? this.current : country.code;
        this.setMessage(this.getColorMessage(color, country.name, previousName), color);
        this.renderGuesses();
        this.updateMapView();
        this.checkEnd(color);
    }

    checkKaliningrad(color, code) {
        const fromBaltic = this.current === 'POL' || this.current === 'LTU';
        this.achievements.unlockIf(color === 'red' && code === 'RUS' && fromBaltic, 'route-kaliningrad');
    }

    checkRouteAchievements() {
        this.achievements.increase('route-wins', 1);
        this.achievements.unlockIf(this.guesses.length === this.neededCountries, 'route-perfect');
        this.achievements.unlockIf(this.neededCountries >= 5, 'route-long');
        this.achievements.unlockIf(this.targetCountry.code === 'DEU', 'hidden-heimweh');
    }

    checkRouteStreak() {
        const streak = this.storage.getGameStats('georoute').streak;
        this.achievements.unlockIf(streak >= 5, 'route-streak-5');
        this.achievements.unlockIf(streak >= 10, 'route-streak-10');
    }

    updateMapView() {
        const codes = [this.startCountry.code, this.targetCountry.code];
        for (let i = 0; i < this.guesses.length; i++) {
            if (this.guesses[i].color !== 'red') {
                codes.push(this.guesses[i].code);
            }
        }
        this.worldMap.fitCountries(codes);
    }

    getGuessColor(code) {
        if (!this.hasLandBorder(this.current, code)) {
            return 'red';
        }
        return this.distances[code] === this.distances[this.current] - 1 ? 'green' : 'yellow';
    }

    getColorMessage(color, name, previousName) {
        if (color === 'green') {
            return name + ' liegt auf dem kürzesten Weg.';
        }
        if (color === 'yellow') {
            return name + ' ist ein Nachbar, aber nicht der kürzeste Weg.';
        }
        return 'Von ' + previousName + ' gibt es keinen direkten Landweg nach ' + name + '.';
    }

    checkEnd(color) {
        const reachedTarget = color !== 'red' && this.distances[this.current] <= 1;
        if (reachedTarget) {
            this.checkRouteAchievements();
            this.finish(true);
        } else if (this.guesses.length >= this.maxGuesses) {
            this.finish(false);
        } else {
            this.updateInfo();
        }
    }

    updateInfo() {
        const guessesLeft = this.maxGuesses - this.guesses.length;
        const currentName = this.countries.getCountry(this.current).name;
        document.getElementById('route-info').innerHTML = routeInfoTemplate(currentName, guessesLeft, this.neededCountries);
    }

    renderGuesses() {
        let html = routeChipTemplate(this.startCountry.name, 'start');
        for (let i = 0; i < this.guesses.length; i++) {
            html += routeChipTemplate(this.guesses[i].name, this.guesses[i].color);
        }
        document.getElementById('route-guesses').innerHTML = html;
    }

    finish(won) {
        this.finished = true;
        if (this.daily) {
            this.finishRouteDaily(won);
            return;
        }
        this.saveRouteResult(won);
        this.playEndSound(won, !won);
        const text = won ? 'Geschafft! Du bist in ' + this.targetCountry.name + ' angekommen.' : 'Keine Versuche mehr.';
        const shortestRoute = this.getShortestRouteNames();
        document.getElementById('route-info').innerHTML = routeEndTemplate(text, shortestRoute);
        this.setMessage('', '');
        this.updateMapView();
    }

    saveRouteResult(won) {
        this.storage.saveGameResult('georoute', won, 0);
        this.storage.saveTopScore('georoute', this.getRouteScore(won), this.startCountry.name + ' → ' + this.targetCountry.name);
        this.checkRouteStreak();
    }

    getDuelScore() {
        return this.distances ? this.getRouteScore(this.distances[this.current] <= 1) : 0;
    }

    getRouteScore(won) {
        const extraGuesses = this.guesses.length - this.neededCountries;
        return won ? Math.max(20, 100 - extraGuesses * 20) : 0;
    }

    finishRouteDaily(won) {
        const score = this.getRouteScore(won);
        this.finishDaily('route', score, won);
        const text = (won ? 'Geschafft! ' : 'Keine Versuche mehr. ') + 'Ein kürzester Weg: ' + this.getShortestRouteNames();
        document.getElementById('route-info').innerHTML = dailyEndTemplate(text, score);
        this.setMessage('', '');
        this.updateMapView();
    }

    getShortestRouteNames() {
        let current = this.startCountry;
        let names = current.name;
        for (let step = 0; step < this.distances[this.startCountry.code]; step++) {
            current = this.getNextOnRoute(current);
            names += ' → ' + current.name;
        }
        return names;
    }

    getNextOnRoute(country) {
        const neighbors = this.getLandNeighbors(country);
        for (let i = 0; i < neighbors.length; i++) {
            if (this.distances[neighbors[i].code] === this.distances[country.code] - 1) {
                return neighbors[i];
            }
        }
        return country;
    }
}
