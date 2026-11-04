const WEEKLY_QUEST_COUNT = 4;

const WEEKLY_BONUS_COINS = 100;

const QUEST_POOL = [
    { id: 'q-games-10', text: 'Beende 10 Spiele', counter: 'games', goal: 10, reward: 80 },
    { id: 'q-games-25', text: 'Beende 25 Spiele', counter: 'games', goal: 25, reward: 150 },
    { id: 'q-correct-100', text: 'Gib 100 richtige Antworten', counter: 'correct', goal: 100, reward: 100 },
    { id: 'q-route-3', text: 'Schaffe 3 Routen bei GeoRoute', counter: 'route-wins', goal: 3, reward: 90 },
    { id: 'q-geodle-3', text: 'Gewinne 3 Geodle', counter: 'geodle-wins', goal: 3, reward: 90 },
    { id: 'q-conn-2', text: 'Gewinne 2 GeoConnections', counter: 'conn-wins', goal: 2, reward: 90 },
    { id: 'q-size-3', text: 'Spiele 3-mal GeoSize', counter: 'end-geosize', goal: 3, reward: 60 },
    { id: 'q-decide-5', text: 'Spiele 5-mal GeoDecide', counter: 'end-geodecide', goal: 5, reward: 60 },
    { id: 'q-blitz-5', text: 'Spiele 5 Blitzrunden', counter: 'end-blitz', goal: 5, reward: 60 },
    { id: 'q-quiz-3', text: 'Beende 3 Quiz', counter: 'end-quiz', goal: 3, reward: 70 },
    { id: 'q-distance-3', text: 'Spiele 3-mal GeoDistanz', counter: 'end-geodistance', goal: 3, reward: 70 },
    { id: 'q-daily-3', text: 'Schließe 3 Tages-Challenges ab', counter: 'daily-completed', goal: 3, reward: 120 },
    { id: 'q-bullseye', text: 'Hol bei GeoSize einmal 98 oder mehr Punkte', counter: 'size-bullseyes', goal: 1, reward: 100 },
    { id: 'q-quiz-perfect', text: 'Beende ein Quiz mit 100 %', counter: 'quiz-perfects', goal: 1, reward: 100 },
    { id: 'q-distance-hit', text: 'Hol bei GeoDistanz 3-mal 100 Punkte in einer Runde', counter: 'distance-hits', goal: 3, reward: 90 },
    { id: 'q-shop', text: 'Kauf ein Teil im Shop', counter: 'items-bought', goal: 1, reward: 50 }
];
