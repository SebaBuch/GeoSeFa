const DUEL_INVITE_MINUTES = 5;

const DUEL_KEEP_DAYS = 30;

const DUEL_WIN_COINS = 60;

const DUEL_DRAW_COINS = 25;

const DUEL_GAMES = [
    { key: 'georoute', game: 'georoute', title: 'GeoRoute', scoreText: 'Punkte' },
    { key: 'geosize', game: 'geosize', title: 'GeoSize', scoreText: 'Punkte' },
    { key: 'geodecide', game: 'geodecide', title: 'GeoDecide', scoreText: 'Serie' },
    { key: 'geodle', game: 'geodle', title: 'Geodle', scoreText: 'Punkte' },
    { key: 'geodistance', game: 'geodistance', title: 'GeoDistanz', scoreText: 'Punkte' },
    { key: 'borderchain', game: 'borderchain', title: 'Grenz-Kette', scoreText: 'Punkte' },
    { key: 'blitz-flags', game: 'blitz', category: 'flags', title: 'Blitzrunde Flaggen', scoreText: 'Richtige' },
    { key: 'blitz-capitals', game: 'blitz', category: 'capitals', title: 'Blitzrunde Hauptstädte', scoreText: 'Richtige' },
    { key: 'blitz-outlines', game: 'blitz', category: 'outlines', title: 'Blitzrunde Umrisse', scoreText: 'Richtige' },
    { key: 'crestquiz', game: 'crestquiz', title: 'Wappen-Quiz', scoreText: 'Punkte' },
    { key: 'stadiumduel', game: 'stadiumduel', title: 'Stadion-Quiz', scoreText: 'Serie' },
    { key: 'playerwordle', game: 'playerwordle', title: 'Spieler-Wordle', scoreText: 'Punkte' },
    { key: 'valueduel', game: 'valueduel', title: 'Wer ist mehr wert?', scoreText: 'Serie' },
    { key: 'squadduel', game: 'squadduel', title: 'Welcher Kader ist mehr wert?', scoreText: 'Serie' },
    { key: 'footballblitz-players', game: 'footballblitz', category: 'players', title: 'Blitzrunde Spieler', scoreText: 'Richtige' },
    { key: 'footballblitz-crests', game: 'footballblitz', category: 'crests', title: 'Blitzrunde Wappen', scoreText: 'Richtige' },
    { key: 'footballblitz-stadiums', game: 'footballblitz', category: 'stadiums', title: 'Blitzrunde Stadien', scoreText: 'Richtige' }
];

const DUEL_STATUS_TEXTS = {
    declined: 'Abgelehnt',
    expired: 'Abgelaufen',
    cancelled: 'Abgebrochen'
};

const DUEL_OUTCOME_LABELS = {
    win: 'Gewonnen',
    draw: 'Unentschieden',
    loss: 'Verloren'
};
