const STATS_CONTINENTS = ['Europa', 'Asien', 'Afrika', 'Nordamerika', 'Südamerika', 'Ozeanien'];

function showStats() {
    if (!profileService.hasProfile()) {
        return;
    }
    stopCurrentGame();
    setTheme('home');
    showContent(statsPageTemplate(buildStatTiles(), buildGameStatRows(), buildContinentRows(), buildMistakeRows()));
}

function buildStatTiles() {
    const correct = achievementService.getCounter('correct');
    const wrong = achievementService.getCounter('wrong');
    const rate = correct + wrong > 0 ? Math.round(correct / (correct + wrong) * 100) + ' %' : '–';
    let html = statTileTemplate('Spiele beendet', formatNumber(achievementService.getCounter('games')));
    html += statTileTemplate('Richtige Antworten', formatNumber(correct));
    html += statTileTemplate('Falsche Antworten', formatNumber(wrong));
    html += statTileTemplate('Trefferquote', rate);
    return html + buildMoreStatTiles();
}

function buildMoreStatTiles() {
    let html = statTileTemplate('Beste Tages-Serie', formatDays(profileService.getBestStreak()));
    html += statTileTemplate('Login-Serie', formatDays(storageService.load('login-bonus', { streak: 0 }).streak));
    html += statTileTemplate('Duelle (gewonnen)', achievementService.getCounter('duels-played') + ' (' + achievementService.getCounter('duel-wins') + ')');
    html += statTileTemplate('Coins verdient', formatNumber(achievementService.getCounter('coins-earned')));
    html += statTileTemplate('Coins ausgegeben', formatNumber(achievementService.getCounter('coins-spent')));
    return html + statTileTemplate('Tipps gekauft', formatNumber(achievementService.getCounter('hints-used')));
}

function buildGameStatRows() {
    const lists = TOP_LISTS.filter(list => list.key !== 'quiz' && list.key !== 'daily');
    let html = '';
    for (let i = 0; i < lists.length; i++) {
        const stats = storageService.getGameStats(lists[i].key);
        html += statGameRowTemplate(lists[i].title, stats.played, stats.won, stats.highscore, stats.bestStreak);
    }
    return html;
}

function buildContinentRows() {
    const stats = storageService.load('continent-stats', {});
    let html = '';
    for (let i = 0; i < STATS_CONTINENTS.length; i++) {
        const entry = stats[STATS_CONTINENTS[i]] || { right: 0, wrong: 0 };
        const total = entry.right + entry.wrong;
        const percent = total > 0 ? Math.round(entry.right / total * 100) : 0;
        html += statContinentRowTemplate(STATS_CONTINENTS[i], percent, total > 0 ? percent + ' %' : '–', total);
    }
    return html;
}

function buildMistakeRows() {
    const top = getTopMistakes(collectMistakes(), 8);
    let html = '';
    for (let i = 0; i < top.length; i++) {
        const country = countryService.getCountry(top[i].code);
        if (country) {
            html += statMistakeRowTemplate(country, top[i].count);
        }
    }
    return html === '' ? topEmptyTemplate() : html;
}

function collectMistakes() {
    const totals = {};
    for (let i = 0; i < QUIZ_CATEGORIES.length; i++) {
        const mistakes = storageService.load('mistakes-' + QUIZ_CATEGORIES[i].key, {});
        const codes = Object.keys(mistakes);
        for (let j = 0; j < codes.length; j++) {
            totals[codes[j]] = (totals[codes[j]] || 0) + mistakes[codes[j]];
        }
    }
    return totals;
}

function getTopMistakes(totals, count) {
    const sorted = [];
    const codes = Object.keys(totals);
    for (let i = 0; i < codes.length; i++) {
        let position = sorted.length;
        for (let j = sorted.length - 1; j >= 0; j--) {
            position = sorted[j].count < totals[codes[i]] ? j : position;
        }
        sorted.splice(position, 0, { code: codes[i], count: totals[codes[i]] });
    }
    return sorted.slice(0, count);
}
