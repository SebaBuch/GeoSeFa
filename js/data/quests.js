const WEEKLY_QUEST_COUNT = 4;

const WEEKLY_BONUS_COINS = 300;

const QUEST_POOL = [
    { id: 'q-games-10', text: 'Beende 40 Spiele', counter: 'games', goal: 40, reward: 250 },
    { id: 'q-games-25', text: 'Beende 80 Spiele', counter: 'games', goal: 80, reward: 450 },
    { id: 'q-correct-100', text: 'Gib 400 richtige Antworten', counter: 'correct', goal: 400, reward: 300 },
    { id: 'q-route-3', text: 'Schaffe 12 Routen bei GeoRoute', counter: 'route-wins', goal: 12, reward: 300 },
    { id: 'q-geodle-3', text: 'Gewinne 12 Geodle', counter: 'geodle-wins', goal: 12, reward: 300 },
    { id: 'q-conn-2', text: 'Gewinne 8 GeoConnections', counter: 'conn-wins', goal: 8, reward: 300 },
    { id: 'q-size-3', text: 'Spiele 10-mal GeoSize', counter: 'end-geosize', goal: 10, reward: 200 },
    { id: 'q-decide-5', text: 'Spiele 15-mal GeoDecide', counter: 'end-geodecide', goal: 15, reward: 200 },
    { id: 'q-blitz-5', text: 'Spiele 15 Blitzrunden', counter: 'end-blitz', goal: 15, reward: 200 },
    { id: 'q-quiz-3', text: 'Beende 10 Quiz', counter: 'end-quiz', goal: 10, reward: 250 },
    { id: 'q-distance-3', text: 'Spiele 10-mal GeoDistanz', counter: 'end-geodistance', goal: 10, reward: 250 },
    { id: 'q-daily-3', text: 'Schließe an 6 Tagen die Tages-Challenge ab', counter: 'daily-completed', goal: 6, reward: 400 },
    { id: 'q-bullseye', text: 'Hol bei GeoSize 5-mal 98 oder mehr Punkte', counter: 'size-bullseyes', goal: 5, reward: 350 },
    { id: 'q-quiz-perfect', text: 'Beende 3 Quiz mit 100 %', counter: 'quiz-perfects', goal: 3, reward: 350 },
    { id: 'q-distance-hit', text: 'Hol bei GeoDistanz 10-mal 100 Punkte in einer Runde', counter: 'distance-hits', goal: 10, reward: 350 },
    { id: 'q-chain-10', text: 'Spiele 10-mal Grenz-Kette', counter: 'end-borderchain', goal: 10, reward: 250 },
    { id: 'q-chain-complete', text: 'Finde bei Grenz-Kette 8-mal alle Nachbarn', counter: 'chain-complete', goal: 8, reward: 300 },
    { id: 'q-duels-3', text: 'Spiele 3 Duelle zu Ende', counter: 'duels-played', goal: 3, reward: 300 },
    { id: 'q-shop', text: 'Kauf 3 Teile im Shop', counter: 'items-bought', goal: 3, reward: 150 }
];
