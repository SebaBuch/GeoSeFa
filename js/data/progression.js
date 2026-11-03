const MAX_LEVEL = 30;

const XP_PER_COUNTER = { games: 10, correct: 2 };

const XP_PER_TIER = { bronze: 50, silver: 100, gold: 200 };

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
    { key: 'avatar', title: 'Avatare' },
    { key: 'title', title: 'Titel' },
    { key: 'frame', title: 'Rahmen' },
    { key: 'theme', title: 'Farbthemen' }
];

const PROFILE_OPTIONS = [
    { type: 'avatar', value: 'DEU', label: 'Deutschland', level: 1 },
    { type: 'avatar', value: 'AUT', label: 'Österreich', level: 1 },
    { type: 'avatar', value: 'CHE', label: 'Schweiz', level: 1 },
    { type: 'avatar', value: 'NLD', label: 'Niederlande', level: 1 },
    { type: 'title', value: 'Neuling', label: 'Neuling', level: 1 },
    { type: 'frame', value: 'none', label: 'Ohne Rahmen', level: 1 },
    { type: 'theme', value: 'standard', label: 'Standard', level: 1 },
    { type: 'avatar', value: 'FRA', label: 'Frankreich', level: 2 },
    { type: 'frame', value: 'bronze', label: 'Bronze', level: 3 },
    { type: 'title', value: 'Kartenleser', label: 'Kartenleser', level: 4 },
    { type: 'theme', value: 'ozean', label: 'Ozean', level: 5 },
    { type: 'avatar', value: 'ESP', label: 'Spanien', level: 6 },
    { type: 'avatar', value: 'ITA', label: 'Italien', level: 7 },
    { type: 'title', value: 'Grenzgänger', label: 'Grenzgänger', level: 8 },
    { type: 'avatar', value: 'GBR', label: 'Vereinigtes Königreich', level: 9 },
    { type: 'frame', value: 'silver', label: 'Silber', level: 10 },
    { type: 'theme', value: 'wald', label: 'Wald', level: 11 },
    { type: 'avatar', value: 'JPN', label: 'Japan', level: 12 },
    { type: 'title', value: 'Hauptstadt-Kenner', label: 'Hauptstadt-Kenner', level: 13 },
    { type: 'avatar', value: 'BRA', label: 'Brasilien', level: 14 },
    { type: 'theme', value: 'sonnenuntergang', label: 'Sonnenuntergang', level: 15 },
    { type: 'avatar', value: 'USA', label: 'USA', level: 16 },
    { type: 'title', value: 'Flaggen-Fan', label: 'Flaggen-Fan', level: 17 },
    { type: 'avatar', value: 'CAN', label: 'Kanada', level: 18 },
    { type: 'avatar', value: 'AUS', label: 'Australien', level: 19 },
    { type: 'frame', value: 'gold', label: 'Gold', level: 20 },
    { type: 'theme', value: 'nacht', label: 'Nacht', level: 21 },
    { type: 'avatar', value: 'ZAF', label: 'Südafrika', level: 22 },
    { type: 'title', value: 'Globetrotter', label: 'Globetrotter', level: 23 },
    { type: 'avatar', value: 'KOR', label: 'Südkorea', level: 24 },
    { type: 'theme', value: 'gold', label: 'Gold', level: 25 },
    { type: 'avatar', value: 'MEX', label: 'Mexiko', level: 26 },
    { type: 'title', value: 'Atlas-Meister', label: 'Atlas-Meister', level: 27 },
    { type: 'avatar', value: 'NPL', label: 'Nepal', level: 28 },
    { type: 'title', value: 'GeoSeFa-Legende', label: 'GeoSeFa-Legende', level: 29 },
    { type: 'frame', value: 'rainbow', label: 'Regenbogen', level: 30 }
];

const TOP_LISTS = [
    { key: 'georoute', title: 'GeoRoute', unit: 'Punkte' },
    { key: 'geosize', title: 'GeoSize', unit: 'Punkte' },
    { key: 'geodecide', title: 'GeoDecide', unit: 'in Serie' },
    { key: 'geodle', title: 'Geodle', unit: 'Punkte' },
    { key: 'geoconnections', title: 'GeoConnections', unit: 'Punkte' },
    { key: 'blitz-flags', title: 'Blitzrunde Flaggen', unit: 'Richtige' },
    { key: 'blitz-capitals', title: 'Blitzrunde Hauptstädte', unit: 'Richtige' },
    { key: 'blitz-outlines', title: 'Blitzrunde Umrisse', unit: 'Richtige' },
    { key: 'quiz', title: 'Quiz', unit: '%' },
    { key: 'daily', title: 'Tages-Challenge', unit: 'Punkte' }
];
