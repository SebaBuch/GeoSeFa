function shuffle(list) {
    const copy = [...list];
    for (let i = copy.length - 1; i > 0; i--) {
        const randomIndex = Math.floor(Math.random() * (i + 1));
        const temp = copy[i];
        copy[i] = copy[randomIndex];
        copy[randomIndex] = temp;
    }
    return copy;
}

function randomItem(list) {
    return list[Math.floor(Math.random() * list.length)];
}

function formatNumber(value) {
    return Math.round(value).toLocaleString('de-DE');
}

function formatPopulation(value) {
    if (value >= 1000000) {
        const millions = (value / 1000000).toLocaleString('de-DE', { maximumFractionDigits: 1 });
        return millions + ' Mio.';
    }
    return formatNumber(value);
}

function formatScore(value) {
    return value.toLocaleString('de-DE');
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const rest = seconds % 60;
    const restText = rest < 10 ? '0' + rest : '' + rest;
    return minutes + ':' + restText;
}

function normalizeText(text) {
    return text.trim().toLowerCase();
}
