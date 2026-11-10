const MAX_LEVEL = 30;

const LOGIN_BONUS_BASE = 20;

const LOGIN_BONUS_STEP = 10;

const LOGIN_BONUS_MAX = 80;

const FAVORITE_COUNT = 3;

const XP_PER_COUNTER = { games: 10, correct: 2 };

const XP_PER_TIER = { bronze: 50, silver: 100, gold: 200, platinum: 400 };

const RANKS = [
    { days: 0, title: 'Tourist' },
    { days: 3, title: 'Rucksackreisender' },
    { days: 7, title: 'Entdecker' },
    { days: 14, title: 'Navigator' },
    { days: 30, title: 'Kartograf' },
    { days: 60, title: 'Weltreisender' },
    { days: 100, title: 'Geo-Legende' }
];

const PROFILE_OPTION_TYPES = [
    { key: 'title', title: 'Titel' },
    { key: 'frame', title: 'Rahmen' },
    { key: 'theme', title: 'Farbthemen' }
];

const PROFILE_OPTIONS = [
    { type: 'title', value: 'Neuling', label: 'Neuling', level: 1 },
    { type: 'frame', value: 'none', label: 'Ohne Rahmen', level: 1 },
    { type: 'theme', value: 'standard', label: 'Standard', level: 1 },
    { type: 'frame', value: 'bronze', label: 'Bronze', level: 3 },
    { type: 'title', value: 'Kartenleser', label: 'Kartenleser', level: 4 },
    { type: 'theme', value: 'ozean', label: 'Ozean', level: 5 },
    { type: 'title', value: 'Grenzgänger', label: 'Grenzgänger', level: 8 },
    { type: 'frame', value: 'silver', label: 'Silber', level: 10 },
    { type: 'theme', value: 'wald', label: 'Wald', level: 11 },
    { type: 'title', value: 'Hauptstadt-Kenner', label: 'Hauptstadt-Kenner', level: 13 },
    { type: 'theme', value: 'sonnenuntergang', label: 'Sonnenuntergang', level: 15 },
    { type: 'title', value: 'Flaggen-Fan', label: 'Flaggen-Fan', level: 17 },
    { type: 'frame', value: 'gold', label: 'Gold', level: 20 },
    { type: 'theme', value: 'nacht', label: 'Nacht', level: 21 },
    { type: 'title', value: 'Globetrotter', label: 'Globetrotter', level: 23 },
    { type: 'theme', value: 'gold', label: 'Gold', level: 25 },
    { type: 'title', value: 'Atlas-Meister', label: 'Atlas-Meister', level: 27 },
    { type: 'title', value: 'GeoSeFa-Legende', label: 'GeoSeFa-Legende', level: 29 },
    { type: 'frame', value: 'rainbow', label: 'Regenbogen', level: 30 },
    { type: 'title', value: 'Geo-Gott', label: 'Geo-Gott', level: 1, achievement: 'all-done' },
    { type: 'frame', value: 'legend', label: 'Legende', level: 1, achievement: 'all-done' },
    { type: 'theme', value: 'legende', label: 'Legende', level: 1, achievement: 'all-done' }
];

const TOP_LISTS = [
    { key: 'georoute', title: 'GeoRoute', unit: 'Punkte' },
    { key: 'geosize', title: 'GeoSize', unit: 'Punkte' },
    { key: 'geodecide', title: 'GeoDecide', unit: 'in Serie' },
    { key: 'geodle', title: 'Geodle', unit: 'Punkte' },
    { key: 'geoconnections', title: 'GeoConnections', unit: 'Punkte' },
    { key: 'geodistance', title: 'GeoDistanz', unit: 'Punkte' },
    { key: 'borderchain', title: 'Grenz-Kette', unit: 'Punkte' },
    { key: 'blitz-flags', title: 'Blitzrunde Flaggen', unit: 'Richtige' },
    { key: 'blitz-capitals', title: 'Blitzrunde Hauptstädte', unit: 'Richtige' },
    { key: 'blitz-outlines', title: 'Blitzrunde Umrisse', unit: 'Richtige' },
    { key: 'crestquiz', title: 'Wappen-Quiz', unit: 'Punkte' },
    { key: 'stadiumduel', title: 'Stadion-Quiz', unit: 'in Serie' },
    { key: 'playerwordle', title: 'Spieler-Wordle', unit: 'Punkte' },
    { key: 'valueduel', title: 'Wer ist mehr wert?', unit: 'in Serie' },
    { key: 'squadduel', title: 'Welcher Kader ist mehr wert?', unit: 'in Serie' },
    { key: 'footballblitz-players', title: 'Blitzrunde Spieler', unit: 'Richtige' },
    { key: 'footballblitz-crests', title: 'Blitzrunde Wappen', unit: 'Richtige' },
    { key: 'footballblitz-stadiums', title: 'Blitzrunde Stadien', unit: 'Richtige' },
    { key: 'quiz', title: 'Quiz', unit: '%' },
    { key: 'daily', title: 'Tages-Challenge', unit: 'Punkte' }
];

const COMPARE_ROWS = [
    { id: 'level', label: 'Level', source: 'level', ranking: false },
    { id: 'xp', label: 'XP gesamt', source: 'profile', key: 'xp', ranking: false },
    { id: 'achievements', label: 'Erfolge', source: 'achievements' },
    { id: 'best-streak', label: 'Beste Tages-Serie', source: 'storage', key: 'best-daily-streak' },
    { id: 'games', label: 'Spiele beendet', source: 'counter', key: 'games', ranking: false },
    { id: 'correct', label: 'Richtige Antworten', source: 'counter', key: 'correct', ranking: false },
    { id: 'route-won', label: 'GeoRoute gewonnen', source: 'stats', key: 'georoute', field: 'won', ranking: false },
    { id: 'size-best', label: 'GeoSize Highscore', source: 'stats', key: 'geosize', field: 'highscore' },
    { id: 'decide-best', label: 'GeoDecide Rekord', source: 'stats', key: 'geodecide', field: 'highscore' },
    { id: 'geodle-won', label: 'Geodle gewonnen', source: 'stats', key: 'geodle', field: 'won', ranking: false },
    { id: 'conn-won', label: 'GeoConnections gewonnen', source: 'stats', key: 'geoconnections', field: 'won', ranking: false },
    { id: 'distance-best', label: 'GeoDistanz Highscore', source: 'stats', key: 'geodistance', field: 'highscore' },
    { id: 'chain-best', label: 'Grenz-Kette Highscore', source: 'stats', key: 'borderchain', field: 'highscore' },
    { id: 'blitz-flags', label: 'Blitz Flaggen', source: 'stats', key: 'blitz-flags', field: 'highscore' },
    { id: 'blitz-capitals', label: 'Blitz Hauptstädte', source: 'stats', key: 'blitz-capitals', field: 'highscore' },
    { id: 'blitz-outlines', label: 'Blitz Umrisse', source: 'stats', key: 'blitz-outlines', field: 'highscore' },
    { id: 'crest-best', label: 'Wappen-Quiz Highscore', source: 'stats', key: 'crestquiz', field: 'highscore' },
    { id: 'stadium-best', label: 'Stadion-Quiz Rekord', source: 'stats', key: 'stadiumduel', field: 'highscore' },
    { id: 'wordle-best', label: 'Spieler-Wordle Highscore', source: 'stats', key: 'playerwordle', field: 'highscore' },
    { id: 'value-best', label: 'Wer ist mehr wert? Rekord', source: 'stats', key: 'valueduel', field: 'highscore' },
    { id: 'squad-best', label: 'Welcher Kader ist mehr wert? Rekord', source: 'stats', key: 'squadduel', field: 'highscore' },
    { id: 'fbblitz-players', label: 'Blitz Spieler', source: 'stats', key: 'footballblitz-players', field: 'highscore' },
    { id: 'fbblitz-crests', label: 'Blitz Wappen', source: 'stats', key: 'footballblitz-crests', field: 'highscore' },
    { id: 'fbblitz-stadiums', label: 'Blitz Stadien', source: 'stats', key: 'footballblitz-stadiums', field: 'highscore' }
];
