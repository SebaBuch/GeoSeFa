const ACHIEVEMENT_CATEGORIES = ['Allgemein', 'Meilensteine', 'GeoRoute', 'GeoSize', 'GeoDecide', 'Geodle', 'GeoConnections', 'GeoDistanz', 'Blitzrunde', 'Quiz', 'Tages-Challenge', 'Avatar & Shop', 'Versteckt'];

const ACHIEVEMENTS = [
    { id: 'first-game', category: 'Allgemein', tier: 'bronze', title: 'Erste Schritte', description: 'Beende dein erstes Spiel.', counter: 'games', goal: 1 },
    { id: 'all-games', category: 'Allgemein', tier: 'silver', title: 'Weltenbummler', description: 'Beende jedes der 7 Spiele und ein Quiz mindestens einmal.' },
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
    { id: 'size-bullseye', category: 'GeoSize', tier: 'silver', title: 'Volltreffer', description: 'Hol 98 oder mehr Punkte in einer Runde.', counter: 'size-bullseyes', goal: 1 },
    { id: 'size-700', category: 'GeoSize', tier: 'silver', title: 'Gutes Auge', description: 'Hol 700 Punkte in einem Spiel.' },
    { id: 'size-850', category: 'GeoSize', tier: 'gold', title: 'Messlatte', description: 'Hol 850 Punkte in einem Spiel.' },

    { id: 'decide-5', category: 'GeoDecide', tier: 'bronze', title: 'Bauchgefühl', description: 'Schaffe eine Serie von 5.' },
    { id: 'decide-15', category: 'GeoDecide', tier: 'silver', title: 'Statistiker', description: 'Schaffe eine Serie von 15.' },
    { id: 'decide-30', category: 'GeoDecide', tier: 'gold', title: 'Zahlenmensch', description: 'Schaffe eine Serie von 30.' },
    { id: 'decide-50', category: 'GeoDecide', tier: 'gold', title: 'Orakel', description: 'Schaffe eine Serie von 50.' },
    { id: 'decide-first-fail', category: 'GeoDecide', tier: 'bronze', title: 'Pech gehabt', description: 'Liege gleich bei der ersten Frage falsch.' },

    { id: 'geodle-first', category: 'Geodle', tier: 'bronze', title: 'Detektiv', description: 'Gewinne dein erstes Geodle.', counter: 'geodle-wins', goal: 1 },
    { id: 'geodle-10', category: 'Geodle', tier: 'silver', title: 'Meisterdetektiv', description: 'Gewinne 10 Geodle.', counter: 'geodle-wins', goal: 10 },
    { id: 'geodle-one', category: 'Geodle', tier: 'gold', title: 'Hellseher', description: 'Errate das Land im 1. Versuch.', counter: 'geodle-ones', goal: 1 },
    { id: 'geodle-three', category: 'Geodle', tier: 'silver', title: 'Spürnase', description: 'Errate das Land in höchstens 3 Versuchen.' },
    { id: 'geodle-last', category: 'Geodle', tier: 'bronze', title: 'Knapp!', description: 'Errate das Land im allerletzten Versuch.' },

    { id: 'conn-first', category: 'GeoConnections', tier: 'bronze', title: 'Verbunden', description: 'Gewinne dein erstes GeoConnections.', counter: 'conn-wins', goal: 1 },
    { id: 'conn-10', category: 'GeoConnections', tier: 'silver', title: 'Netzwerker', description: 'Gewinne 10 GeoConnections.', counter: 'conn-wins', goal: 10 },
    { id: 'conn-perfect', category: 'GeoConnections', tier: 'gold', title: 'Ohne Fehler', description: 'Gewinne GeoConnections ohne einen Fehler.', counter: 'conn-perfects', goal: 1 },
    { id: 'conn-close', category: 'GeoConnections', tier: 'bronze', title: 'Auf den letzten Drücker', description: 'Gewinne GeoConnections mit 3 Fehlern.' },

    { id: 'blitz-10', category: 'Blitzrunde', tier: 'bronze', title: 'Schnell', description: 'Hol 10 Punkte in einer Blitzrunde.' },
    { id: 'blitz-20', category: 'Blitzrunde', tier: 'silver', title: 'Blitzmerker', description: 'Hol 20 Punkte in einer Blitzrunde.' },
    { id: 'blitz-30', category: 'Blitzrunde', tier: 'gold', title: 'Lichtgeschwindigkeit', description: 'Hol 30 Punkte in einer Blitzrunde.' },
    { id: 'blitz-all', category: 'Blitzrunde', tier: 'silver', title: 'Allrounder', description: 'Hol in allen 3 Kategorien mindestens 10 Punkte.' },
    { id: 'blitz-perfect', category: 'Blitzrunde', tier: 'gold', title: 'Fehlerfrei', description: 'Hol mindestens 10 Punkte ohne einen Fehler.' },

    { id: 'quiz-first', category: 'Quiz', tier: 'bronze', title: 'Quizzer', description: 'Beende dein erstes Quiz.', counter: 'end-quiz', goal: 1 },
    { id: 'quiz-perfect', category: 'Quiz', tier: 'silver', title: 'Perfekt', description: 'Beende ein Quiz mit 100 %.', counter: 'quiz-perfects', goal: 1 },
    { id: 'quiz-europe-map', category: 'Quiz', tier: 'silver', title: 'Europa-Kenner', description: 'Länder auf der Karte, Europa, 100 % der Länder: mindestens 90 %.' },
    { id: 'quiz-world-map', category: 'Quiz', tier: 'gold', title: 'Kartograf', description: 'Länder auf der Karte, Welt, 100 % der Länder: mindestens 80 %.' },
    { id: 'quiz-flags-world', category: 'Quiz', tier: 'gold', title: 'Flaggen-Profi', description: 'Flaggen-Quiz, Welt, 100 % der Länder: mindestens 90 %.' },
    { id: 'quiz-capitals-world', category: 'Quiz', tier: 'gold', title: 'Hauptstadt-Held', description: 'Hauptstadt-Quiz, Welt, 100 % der Länder: mindestens 90 %.' },

    { id: 'daily-first', category: 'Tages-Challenge', tier: 'bronze', title: 'Tagesform', description: 'Schließe eine Tages-Challenge komplett ab.' },
    { id: 'daily-250', category: 'Tages-Challenge', tier: 'silver', title: 'Spitzenreiter', description: 'Hol 250 Punkte an einem Tag.' },
    { id: 'daily-perfect', category: 'Tages-Challenge', tier: 'gold', title: 'Perfekter Tag', description: 'Hol 300 von 300 Punkten an einem Tag.', counter: 'daily-perfects', goal: 1 },
    { id: 'daily-streak-7', category: 'Tages-Challenge', tier: 'silver', title: 'Treu', description: 'Spiele 7 Tage am Stück.' },
    { id: 'daily-streak-30', category: 'Tages-Challenge', tier: 'gold', title: 'Unermüdlich', description: 'Spiele 30 Tage am Stück.' },

    { id: 'games-500', category: 'Allgemein', tier: 'platinum', title: 'Lebenswerk', description: 'Beende 500 Spiele.', counter: 'games', goal: 500 },
    { id: 'correct-2500', category: 'Allgemein', tier: 'gold', title: 'Universalgenie', description: 'Gib 2500 richtige Antworten.', counter: 'correct', goal: 2500 },
    { id: 'correct-5000', category: 'Allgemein', tier: 'platinum', title: 'Erdkunde-Legende', description: 'Gib 5000 richtige Antworten.', counter: 'correct', goal: 5000 },

    { id: 'level-5', category: 'Meilensteine', tier: 'bronze', title: 'Aufsteiger', description: 'Erreiche Level 5.' },
    { id: 'level-10', category: 'Meilensteine', tier: 'silver', title: 'Fortgeschritten', description: 'Erreiche Level 10.' },
    { id: 'level-20', category: 'Meilensteine', tier: 'gold', title: 'Experte', description: 'Erreiche Level 20.' },
    { id: 'level-30', category: 'Meilensteine', tier: 'platinum', title: 'Maximum', description: 'Erreiche Level 30.' },
    { id: 'coins-1000', category: 'Meilensteine', tier: 'bronze', title: 'Sparschwein', description: 'Verdiene insgesamt 1000 Coins.', counter: 'coins-earned', goal: 1000 },
    { id: 'coins-5000', category: 'Meilensteine', tier: 'silver', title: 'Gut betucht', description: 'Verdiene insgesamt 5000 Coins.', counter: 'coins-earned', goal: 5000 },
    { id: 'coins-20000', category: 'Meilensteine', tier: 'gold', title: 'Coin-Magnat', description: 'Verdiene insgesamt 20000 Coins.', counter: 'coins-earned', goal: 20000 },

    { id: 'route-50', category: 'GeoRoute', tier: 'platinum', title: 'Straßenkönig', description: 'Schaffe 50 Routen.', counter: 'route-wins', goal: 50 },
    { id: 'route-streak-5', category: 'GeoRoute', tier: 'gold', title: 'Auf Kurs', description: 'Schaffe 5 Routen hintereinander.' },
    { id: 'route-streak-10', category: 'GeoRoute', tier: 'platinum', title: 'Unaufhaltsam', description: 'Schaffe 10 Routen hintereinander.' },

    { id: 'size-950', category: 'GeoSize', tier: 'platinum', title: 'Pixelgenau', description: 'Hol 950 Punkte in einem Spiel.' },
    { id: 'size-bullseye-5', category: 'GeoSize', tier: 'gold', title: 'Scharfschütze', description: 'Hol insgesamt 5-mal 98 oder mehr Punkte in einer Runde.', counter: 'size-bullseyes', goal: 5 },

    { id: 'decide-75', category: 'GeoDecide', tier: 'platinum', title: 'Allwissend', description: 'Schaffe eine Serie von 75.' },

    { id: 'geodle-50', category: 'Geodle', tier: 'platinum', title: 'Sherlock', description: 'Gewinne 50 Geodle.', counter: 'geodle-wins', goal: 50 },
    { id: 'geodle-one-3', category: 'Geodle', tier: 'platinum', title: 'Gedankenleser', description: 'Errate das Land 3-mal im 1. Versuch.', counter: 'geodle-ones', goal: 3 },
    { id: 'geodle-streak-10', category: 'Geodle', tier: 'gold', title: 'Serientäter', description: 'Gewinne 10 Geodle hintereinander.' },

    { id: 'conn-50', category: 'GeoConnections', tier: 'gold', title: 'Verknüpfungsprofi', description: 'Gewinne 50 GeoConnections.', counter: 'conn-wins', goal: 50 },
    { id: 'conn-perfect-10', category: 'GeoConnections', tier: 'platinum', title: 'Fehlerlos-Serie', description: 'Gewinne 10-mal ohne einen Fehler.', counter: 'conn-perfects', goal: 10 },

    { id: 'distance-first', category: 'GeoDistanz', tier: 'bronze', title: 'Erste Peilung', description: 'Beende dein erstes GeoDistanz.', counter: 'end-geodistance', goal: 1 },
    { id: 'distance-400', category: 'GeoDistanz', tier: 'silver', title: 'Ortskundig', description: 'Hol 400 Punkte in einem Spiel.' },
    { id: 'distance-450', category: 'GeoDistanz', tier: 'gold', title: 'Navigationsgerät', description: 'Hol 450 Punkte in einem Spiel.' },
    { id: 'distance-500', category: 'GeoDistanz', tier: 'platinum', title: 'Satellit', description: 'Triff alle 5 Länder in einem Spiel.' },
    { id: 'distance-hits-10', category: 'GeoDistanz', tier: 'gold', title: 'Treffsicher', description: 'Triff insgesamt 10-mal genau das gesuchte Land.', counter: 'distance-hits', goal: 10 },

    { id: 'blitz-40', category: 'Blitzrunde', tier: 'platinum', title: 'Überschall', description: 'Hol 40 Punkte in einer Blitzrunde.' },
    { id: 'blitz-perfect-20', category: 'Blitzrunde', tier: 'gold', title: 'Eiskalt', description: 'Hol mindestens 20 Punkte ohne einen Fehler.' },

    { id: 'quiz-world-map-perfect', category: 'Quiz', tier: 'platinum', title: 'Lebender Globus', description: 'Länder auf der Karte, Welt, 100 % der Länder: 100 %.' },
    { id: 'quiz-perfect-10', category: 'Quiz', tier: 'gold', title: 'Musterschüler', description: 'Beende 10 Quiz mit 100 %.', counter: 'quiz-perfects', goal: 10 },

    { id: 'daily-streak-100', category: 'Tages-Challenge', tier: 'platinum', title: 'Legende des Alltags', description: 'Spiele 100 Tage am Stück.' },
    { id: 'daily-perfect-5', category: 'Tages-Challenge', tier: 'platinum', title: 'Perfektionist', description: 'Hol 5-mal 300 von 300 Punkten.', counter: 'daily-perfects', goal: 5 },

    { id: 'shop-first', category: 'Avatar & Shop', tier: 'bronze', title: 'Erster Einkauf', description: 'Kauf dein erstes Teil im Shop.', counter: 'items-bought', goal: 1 },
    { id: 'shop-10', category: 'Avatar & Shop', tier: 'silver', title: 'Shoppingtour', description: 'Kauf 10 Teile im Shop.', counter: 'items-bought', goal: 10 },
    { id: 'shop-25', category: 'Avatar & Shop', tier: 'gold', title: 'Kleiderschrank', description: 'Kauf 25 Teile im Shop.', counter: 'items-bought', goal: 25 },
    { id: 'shop-50', category: 'Avatar & Shop', tier: 'platinum', title: 'Sammler', description: 'Kauf 50 Teile im Shop.', counter: 'items-bought', goal: 50 },
    { id: 'flags-10', category: 'Avatar & Shop', tier: 'silver', title: 'Fahnenträger', description: 'Kauf 10 Flaggen.', counter: 'flags-bought', goal: 10 },
    { id: 'flags-50', category: 'Avatar & Shop', tier: 'gold', title: 'Flaggensammler', description: 'Kauf 50 Flaggen.', counter: 'flags-bought', goal: 50 },
    { id: 'flags-100', category: 'Avatar & Shop', tier: 'platinum', title: 'Vereinte Nationen', description: 'Kauf 100 Flaggen.', counter: 'flags-bought', goal: 100 },
    { id: 'shop-special', category: 'Avatar & Shop', tier: 'gold', title: 'Etwas Besonderes', description: 'Kauf dein erstes Special-Teil.', counter: 'specials-bought', goal: 1 },
    { id: 'shop-special-5', category: 'Avatar & Shop', tier: 'platinum', title: 'Luxus pur', description: 'Kauf 5 Special-Teile.', counter: 'specials-bought', goal: 5 },
    { id: 'spend-5000', category: 'Avatar & Shop', tier: 'gold', title: 'Großeinkauf', description: 'Gib insgesamt 5000 Coins aus.', counter: 'coins-spent', goal: 5000 },

    { id: 'hidden-clown', category: 'Versteckt', tier: 'silver', hidden: true, title: 'Klassenclown', description: 'Liege in einer Blitzrunde 10-mal daneben. Belohnung: Clownsschuhe.' },
    { id: 'hidden-blitz-zero', category: 'Versteckt', tier: 'bronze', hidden: true, title: 'Eingeschlafen', description: 'Beende eine Blitzrunde mit 0 Punkten.' },
    { id: 'hidden-heimweh', category: 'Versteckt', tier: 'silver', hidden: true, title: 'Heimweh', description: 'Schaffe eine Route mit Ziel Deutschland. Belohnung: Schwarz-Rot-Gold-Schal.' },
    { id: 'hidden-patriot', category: 'Versteckt', tier: 'bronze', hidden: true, title: 'Lokalpatriot', description: 'Tippe bei Geodle als Erstes Deutschland.' },
    { id: 'hidden-totalausfall', category: 'Versteckt', tier: 'bronze', hidden: true, title: 'Totalausfall', description: 'Verliere GeoConnections ohne eine einzige Gruppe.' },
    { id: 'hidden-size-zero', category: 'Versteckt', tier: 'bronze', hidden: true, title: 'Augen zu und durch', description: 'Beende GeoSize mit weniger als 200 Punkten.' },
    { id: 'hidden-decide-one', category: 'Versteckt', tier: 'bronze', hidden: true, title: 'Einmal ist keinmal', description: 'Beende GeoDecide mit genau 1 Punkt.' },
    { id: 'hidden-midas', category: 'Versteckt', tier: 'gold', hidden: true, title: 'König Midas', description: 'Trage Goldanzug, Goldhose, Goldschuhe und Krone gleichzeitig. Belohnung: Heiligenschein.' },
    { id: 'hidden-rich', category: 'Versteckt', tier: 'gold', hidden: true, title: 'Dagoberts Erbe', description: 'Besitze 3000 Coins auf einmal.' },
    { id: 'hidden-holiday', category: 'Versteckt', tier: 'silver', hidden: true, title: 'Feiertagsspieler', description: 'Beende ein Spiel an Heiligabend, Silvester oder Neujahr. Belohnung: Weihnachtsmütze.' },
    { id: 'hidden-family', category: 'Versteckt', tier: 'bronze', hidden: true, title: 'Familienbande', description: 'Lege ein zweites Profil an.' },
    { id: 'hidden-fashion', category: 'Versteckt', tier: 'silver', hidden: true, title: 'Modezar', description: 'Ändere dein Outfit 50-mal.', counter: 'outfit-changes', goal: 50 },
    { id: 'hidden-early', category: 'Versteckt', tier: 'silver', hidden: true, title: 'Frühaufsteher', description: 'Schließe die Tages-Challenge vor 7 Uhr morgens ab.' }
];

const ACHIEVEMENT_GAME_KEYS = ['georoute', 'geosize', 'geodecide', 'geodle', 'geoconnections', 'geodistance', 'blitz', 'quiz'];
