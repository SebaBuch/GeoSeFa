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
