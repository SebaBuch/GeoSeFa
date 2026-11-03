const ACHIEVEMENT_CATEGORIES = ['Allgemein', 'GeoRoute', 'GeoSize', 'GeoDecide', 'Geodle', 'GeoConnections', 'Blitzrunde', 'Quiz', 'Tages-Challenge'];

const ACHIEVEMENTS = [
    { id: 'first-game', category: 'Allgemein', tier: 'bronze', title: 'Erste Schritte', description: 'Beende dein erstes Spiel.', counter: 'games', goal: 1 },
    { id: 'all-games', category: 'Allgemein', tier: 'silver', title: 'Weltenbummler', description: 'Beende jedes der 6 Spiele und ein Quiz mindestens einmal.' },
    { id: 'games-10', category: 'Allgemein', tier: 'bronze', title: 'Stammgast', description: 'Beende 10 Spiele.', counter: 'games', goal: 10 },
    { id: 'games-50', category: 'Allgemein', tier: 'silver', title: 'Geo-Fan', description: 'Beende 50 Spiele.', counter: 'games', goal: 50 },
    { id: 'games-200', category: 'Allgemein', tier: 'gold', title: 'Geo-Süchtig', description: 'Beende 200 Spiele.', counter: 'games', goal: 200 },
    { id: 'wrong-25', category: 'Allgemein', tier: 'bronze', title: 'Ausgelacht', description: 'Werde 25-mal ausgelacht.', counter: 'wrong', goal: 25 },
    { id: 'correct-100', category: 'Allgemein', tier: 'bronze', title: 'Besserwisser', description: 'Gib 100 richtige Antworten.', counter: 'correct', goal: 100 },
    { id: 'correct-500', category: 'Allgemein', tier: 'silver', title: 'Lexikon', description: 'Gib 500 richtige Antworten.', counter: 'correct', goal: 500 },
    { id: 'correct-1000', category: 'Allgemein', tier: 'gold', title: 'Wandelnder Atlas', description: 'Gib 1000 richtige Antworten.', counter: 'correct', goal: 1000 },
    { id: 'night-owl', category: 'Allgemein', tier: 'bronze', title: 'Nachteule', description: 'Beende ein Spiel zwischen 0 und 4 Uhr nachts.' },

    { id: 'route-first', category: 'GeoRoute', tier: 'bronze', title: 'Losgefahren', description: 'Schaffe deine erste Route.', counter: 'route-wins', goal: 1 },
    { id: 'route-5', category: 'GeoRoute', tier: 'bronze', title: 'Routinier', description: 'Schaffe 5 Routen.', counter: 'route-wins', goal: 5 },
    { id: 'route-25', category: 'GeoRoute', tier: 'gold', title: 'Fernfahrer', description: 'Schaffe 25 Routen.', counter: 'route-wins', goal: 25 },
    { id: 'route-perfect', category: 'GeoRoute', tier: 'silver', title: 'Navi', description: 'Schaffe eine Route ohne Umweg und ohne Fehler.' },
    { id: 'route-long', category: 'GeoRoute', tier: 'silver', title: 'Langstrecke', description: 'Schaffe eine Route mit mindestens 5 Ländern dazwischen.' },
    { id: 'route-kaliningrad', category: 'GeoRoute', tier: 'bronze', title: 'Kaliningrad-Falle', description: 'Versuche, von Polen oder Litauen nach Russland zu fahren.' },

    { id: 'size-first', category: 'GeoSize', tier: 'bronze', title: 'Augenmaß', description: 'Beende dein erstes GeoSize.', counter: 'end-geosize', goal: 1 },
    { id: 'size-bullseye', category: 'GeoSize', tier: 'silver', title: 'Volltreffer', description: 'Hol 98 oder mehr Punkte in einer Runde.' },
    { id: 'size-700', category: 'GeoSize', tier: 'silver', title: 'Gutes Auge', description: 'Hol 700 Punkte in einem Spiel.' },
    { id: 'size-850', category: 'GeoSize', tier: 'gold', title: 'Messlatte', description: 'Hol 850 Punkte in einem Spiel.' },

    { id: 'decide-5', category: 'GeoDecide', tier: 'bronze', title: 'Bauchgefühl', description: 'Schaffe eine Serie von 5.' },
    { id: 'decide-15', category: 'GeoDecide', tier: 'silver', title: 'Statistiker', description: 'Schaffe eine Serie von 15.' },
    { id: 'decide-30', category: 'GeoDecide', tier: 'gold', title: 'Zahlenmensch', description: 'Schaffe eine Serie von 30.' },
    { id: 'decide-50', category: 'GeoDecide', tier: 'gold', title: 'Orakel', description: 'Schaffe eine Serie von 50.' },
    { id: 'decide-first-fail', category: 'GeoDecide', tier: 'bronze', title: 'Pech gehabt', description: 'Liege gleich bei der ersten Frage falsch.' },

    { id: 'geodle-first', category: 'Geodle', tier: 'bronze', title: 'Detektiv', description: 'Gewinne dein erstes Geodle.', counter: 'geodle-wins', goal: 1 },
    { id: 'geodle-10', category: 'Geodle', tier: 'silver', title: 'Meisterdetektiv', description: 'Gewinne 10 Geodle.', counter: 'geodle-wins', goal: 10 },
    { id: 'geodle-one', category: 'Geodle', tier: 'gold', title: 'Hellseher', description: 'Errate das Land im 1. Versuch.' },
    { id: 'geodle-three', category: 'Geodle', tier: 'silver', title: 'Spürnase', description: 'Errate das Land in höchstens 3 Versuchen.' },
    { id: 'geodle-last', category: 'Geodle', tier: 'bronze', title: 'Knapp!', description: 'Errate das Land im allerletzten Versuch.' },

    { id: 'conn-first', category: 'GeoConnections', tier: 'bronze', title: 'Verbunden', description: 'Gewinne dein erstes GeoConnections.', counter: 'conn-wins', goal: 1 },
    { id: 'conn-10', category: 'GeoConnections', tier: 'silver', title: 'Netzwerker', description: 'Gewinne 10 GeoConnections.', counter: 'conn-wins', goal: 10 },
    { id: 'conn-perfect', category: 'GeoConnections', tier: 'gold', title: 'Ohne Fehler', description: 'Gewinne GeoConnections ohne einen Fehler.' },
    { id: 'conn-close', category: 'GeoConnections', tier: 'bronze', title: 'Auf den letzten Drücker', description: 'Gewinne GeoConnections mit 3 Fehlern.' },

    { id: 'blitz-10', category: 'Blitzrunde', tier: 'bronze', title: 'Schnell', description: 'Hol 10 Punkte in einer Blitzrunde.' },
    { id: 'blitz-20', category: 'Blitzrunde', tier: 'silver', title: 'Blitzmerker', description: 'Hol 20 Punkte in einer Blitzrunde.' },
    { id: 'blitz-30', category: 'Blitzrunde', tier: 'gold', title: 'Lichtgeschwindigkeit', description: 'Hol 30 Punkte in einer Blitzrunde.' },
    { id: 'blitz-all', category: 'Blitzrunde', tier: 'silver', title: 'Allrounder', description: 'Hol in allen 3 Kategorien mindestens 10 Punkte.' },
    { id: 'blitz-perfect', category: 'Blitzrunde', tier: 'gold', title: 'Fehlerfrei', description: 'Hol mindestens 10 Punkte ohne einen Fehler.' },

    { id: 'quiz-first', category: 'Quiz', tier: 'bronze', title: 'Quizzer', description: 'Beende dein erstes Quiz.', counter: 'end-quiz', goal: 1 },
    { id: 'quiz-perfect', category: 'Quiz', tier: 'silver', title: 'Perfekt', description: 'Beende ein Quiz mit 100 %.' },
    { id: 'quiz-europe-map', category: 'Quiz', tier: 'silver', title: 'Europa-Kenner', description: 'Länder auf der Karte, Europa, 100 % der Länder: mindestens 90 %.' },
    { id: 'quiz-world-map', category: 'Quiz', tier: 'gold', title: 'Kartograf', description: 'Länder auf der Karte, Welt, 100 % der Länder: mindestens 80 %.' },
    { id: 'quiz-flags-world', category: 'Quiz', tier: 'gold', title: 'Flaggen-Profi', description: 'Flaggen-Quiz, Welt, 100 % der Länder: mindestens 90 %.' },
    { id: 'quiz-capitals-world', category: 'Quiz', tier: 'gold', title: 'Hauptstadt-Held', description: 'Hauptstadt-Quiz, Welt, 100 % der Länder: mindestens 90 %.' },

    { id: 'daily-first', category: 'Tages-Challenge', tier: 'bronze', title: 'Tagesform', description: 'Schließe eine Tages-Challenge komplett ab.' },
    { id: 'daily-250', category: 'Tages-Challenge', tier: 'silver', title: 'Spitzenreiter', description: 'Hol 250 Punkte an einem Tag.' },
    { id: 'daily-perfect', category: 'Tages-Challenge', tier: 'gold', title: 'Perfekter Tag', description: 'Hol 300 von 300 Punkten an einem Tag.' },
    { id: 'daily-streak-7', category: 'Tages-Challenge', tier: 'silver', title: 'Treu', description: 'Spiele 7 Tage am Stück.' },
    { id: 'daily-streak-30', category: 'Tages-Challenge', tier: 'gold', title: 'Unermüdlich', description: 'Spiele 30 Tage am Stück.' }
];

const ACHIEVEMENT_GAME_KEYS = ['georoute', 'geosize', 'geodecide', 'geodle', 'geoconnections', 'blitz', 'quiz'];
