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

function formatDays(count) {
    return count === 1 ? '1 Tag' : count + ' Tage';
}

function padNumber(value) {
    return value < 10 ? '0' + value : '' + value;
}

function getDateKey(date) {
    return date.getFullYear() + '-' + padNumber(date.getMonth() + 1) + '-' + padNumber(date.getDate());
}

function addDaysToKey(dateKey, days) {
    const parts = dateKey.split('-');
    const date = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]) + days);
    return getDateKey(date);
}

function formatDateGerman(dateKey) {
    const parts = dateKey.split('-');
    return parts[2] + '.' + parts[1] + '.' + parts[0];
}

function formatDateShort(dateKey) {
    const parts = dateKey.split('-');
    return parts[2] + '.' + parts[1] + '.';
}
