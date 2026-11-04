const API_KEY = 'rc_live_aa722ee07aea4230852a6e924a1aeb0b';
const API_URL = 'https://api.restcountries.com/countries/v5';
const SHAPES_URL = 'data/countries.geojson';

const FIREBASE_API_KEY = 'AIzaSyC-UiSmUjctPcysknAQleG9YQFkLJOber4';
const FIREBASE_DB_URL = 'https://geosefa-default-rtdb.europe-west1.firebasedatabase.app';

const REGIONS = ['Welt', 'Europa', 'Nordamerika', 'Südamerika', 'Afrika', 'Asien', 'Ozeanien'];

const CONTINENT_NAMES = {
    'Europe': 'Europa',
    'Africa': 'Afrika',
    'Asia': 'Asien',
    'Oceania': 'Ozeanien',
    'North America': 'Nordamerika',
    'South America': 'Südamerika',
    'Americas': 'Nordamerika',
    'Antarctica': 'Antarktis'
};

const REGION_VIEWS = {
    'Welt': [[-58, -170], [80, 180]],
    'Europa': [[34, -25], [71, 45]],
    'Nordamerika': [[5, -170], [75, -50]],
    'Südamerika': [[-56, -82], [13, -34]],
    'Afrika': [[-36, -20], [38, 55]],
    'Asien': [[-11, 25], [56, 150]],
    'Ozeanien': [[-48, 110], [10, 180]],
    'Antarktis': [[-90, -180], [-60, 180]]
};

const MAP_COLORS = {
    default: '#e8e2d0',
    inactive: '#c4bfb0',
    green: '#4caf50',
    yellow: '#f2c94c',
    red: '#e5534b',
    start: '#1b7f3b',
    target: '#a020a0'
};

const ROUTE_ISLAND_COUNTRIES = ['GBR', 'IRL', 'HTI', 'DOM', 'IDN', 'PNG', 'TLS', 'BRN'];

const ROUTE_BLOCKED_BORDERS = [
    ['RUS', 'POL'],
    ['RUS', 'LTU'],
    ['FRA', 'BRA'],
    ['FRA', 'SUR'],
    ['ESP', 'MAR'],
    ['AZE', 'TUR'],
    ['AGO', 'COG'],
    ['MYS', 'BRN'],
    ['MYS', 'IDN']
];

const POINTS = {
    green: 1,
    yellow: 0.5,
    red: 0
};
