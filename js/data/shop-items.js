const FLAG_PRICE = 30;

const START_COINS = 100;

const COINS_PER_COUNTER = { games: 5 };

const COINS_PER_TIER = { bronze: 25, silver: 50, gold: 100 };

const COINS_PER_LEVEL = 50;

const DAILY_COMPLETE_COINS = 20;

const DEFAULT_OUTFIT = {
    skin: 'skin-1',
    hair: 'hair-short-brown',
    top: 'top-blue',
    hat: 'hat-none',
    glasses: 'glasses-none',
    accessory: 'acc-none',
    background: 'bg-sky',
    flag: 'flag-none'
};

const SHOP_SLOTS = [
    { key: 'skin', title: 'Hautfarbe' },
    { key: 'hair', title: 'Haare' },
    { key: 'top', title: 'Oberteile' },
    { key: 'hat', title: 'Kopfbedeckung' },
    { key: 'glasses', title: 'Brillen' },
    { key: 'accessory', title: 'Accessoires' },
    { key: 'background', title: 'Hintergründe' },
    { key: 'flag', title: 'Flaggen' }
];

const SHOP_ITEMS = [
    { id: 'skin-1', slot: 'skin', name: 'Hell', price: 0, level: 1, color: '#f6d5b5' },
    { id: 'skin-2', slot: 'skin', name: 'Mittel', price: 0, level: 1, color: '#e3b08a' },
    { id: 'skin-3', slot: 'skin', name: 'Gebräunt', price: 0, level: 1, color: '#c68b5e' },
    { id: 'skin-4', slot: 'skin', name: 'Dunkel', price: 0, level: 1, color: '#8d5a3b' },
    { id: 'skin-5', slot: 'skin', name: 'Sehr dunkel', price: 0, level: 1, color: '#5c3a24' },
    { id: 'skin-alien', slot: 'skin', name: 'Außerirdisch', price: 400, level: 15, color: '#8fd16a' },

    { id: 'hair-short-brown', slot: 'hair', name: 'Kurz braun', price: 0, level: 1, svg: '<path d="M28 44 C25 14 75 14 72 44 C69 34 61 31 50 32 C39 31 31 34 28 44 Z" fill="#6b4226"/>' },
    { id: 'hair-short-blond', slot: 'hair', name: 'Kurz blond', price: 0, level: 1, svg: '<path d="M28 44 C25 14 75 14 72 44 C69 34 61 31 50 32 C39 31 31 34 28 44 Z" fill="#e8c35a"/>' },
    { id: 'hair-short-black', slot: 'hair', name: 'Kurz schwarz', price: 0, level: 1, svg: '<path d="M28 44 C25 14 75 14 72 44 C69 34 61 31 50 32 C39 31 31 34 28 44 Z" fill="#222222"/>' },
    { id: 'hair-bald', slot: 'hair', name: 'Glatze', price: 40, level: 1, svg: '' },
    { id: 'hair-long-brown', slot: 'hair', name: 'Lang braun', price: 80, level: 1, svgBack: '<path d="M27 42 C25 18 75 18 73 42 L76 74 L24 74 Z" fill="#6b4226"/>', svg: '<path d="M28 44 C25 14 75 14 72 44 C67 33 57 30 46 33 C38 35 32 38 28 44 Z" fill="#6b4226"/>' },
    { id: 'hair-long-black', slot: 'hair', name: 'Lang schwarz', price: 80, level: 1, svgBack: '<path d="M27 42 C25 18 75 18 73 42 L76 74 L24 74 Z" fill="#222222"/>', svg: '<path d="M28 44 C25 14 75 14 72 44 C67 33 57 30 46 33 C38 35 32 38 28 44 Z" fill="#222222"/>' },
    { id: 'hair-curls-red', slot: 'hair', name: 'Locken rot', price: 120, level: 3, svg: '<g fill="#c0452b"><circle cx="32" cy="36" r="7"/><circle cx="38" cy="27" r="7"/><circle cx="47" cy="23" r="7"/><circle cx="57" cy="24" r="7"/><circle cx="65" cy="29" r="7"/><circle cx="69" cy="38" r="6"/></g>' },
    { id: 'hair-mohawk', slot: 'hair', name: 'Irokese grün', price: 200, level: 8, svg: '<path d="M45 30 L44 18 L48 22 L50 8 L52 22 L56 18 L55 30 Z" fill="#2fbf4a"/>' },
    { id: 'hair-pink', slot: 'hair', name: 'Pink gefärbt', price: 250, level: 12, svg: '<path d="M28 44 C25 14 75 14 72 44 C69 34 61 31 50 32 C39 31 31 34 28 44 Z" fill="#ff5fa2"/>' },

    { id: 'top-blue', slot: 'top', name: 'T-Shirt blau', price: 0, level: 1, svg: '<path d="M16 100 C16 79 31 70 50 70 C69 70 84 79 84 100 Z" fill="#3a7bd5"/>' },
    { id: 'top-red', slot: 'top', name: 'T-Shirt rot', price: 0, level: 1, svg: '<path d="M16 100 C16 79 31 70 50 70 C69 70 84 79 84 100 Z" fill="#e5534b"/>' },
    { id: 'top-hoodie', slot: 'top', name: 'Hoodie grün', price: 100, level: 1, svg: '<path d="M16 100 C16 79 31 70 50 70 C69 70 84 79 84 100 Z" fill="#2a9d8f"/><path d="M34 74 C38 64 62 64 66 74" stroke="#1f7a6f" stroke-width="5" fill="none"/><line x1="46" y1="76" x2="45" y2="88" stroke="#ffffff" stroke-width="2"/><line x1="54" y1="76" x2="55" y2="88" stroke="#ffffff" stroke-width="2"/>' },
    { id: 'top-stripes', slot: 'top', name: 'Ringelshirt', price: 120, level: 2, svg: '<path d="M16 100 C16 79 31 70 50 70 C69 70 84 79 84 100 Z" fill="#ffffff"/><path d="M20 84 H80 V90 H18 Z M17 96 H83 V100 H16 Z M24 77 H76 V80 H22 Z" fill="#1d3557"/>' },
    { id: 'top-hawaii', slot: 'top', name: 'Hawaiihemd', price: 180, level: 5, svg: '<path d="M16 100 C16 79 31 70 50 70 C69 70 84 79 84 100 Z" fill="#ffb703"/><g fill="#e63946"><circle cx="30" cy="86" r="4"/><circle cx="62" cy="80" r="4"/><circle cx="72" cy="93" r="4"/><circle cx="42" cy="95" r="3"/></g><g fill="#2a9d8f"><circle cx="38" cy="78" r="2.5"/><circle cx="56" cy="92" r="3"/></g>' },
    { id: 'top-suit', slot: 'top', name: 'Anzug', price: 250, level: 7, svg: '<path d="M16 100 C16 79 31 70 50 70 C69 70 84 79 84 100 Z" fill="#2b2d42"/><path d="M42 70 L50 86 L58 70 Z" fill="#ffffff"/><path d="M48 74 L52 74 L53 92 L50 96 L47 92 Z" fill="#c1121f"/>' },
    { id: 'top-pilot', slot: 'top', name: 'Pilotenjacke', price: 300, level: 10, svg: '<path d="M16 100 C16 79 31 70 50 70 C69 70 84 79 84 100 Z" fill="#7b4a2a"/><path d="M36 72 L50 84 L64 72 L62 69 L50 76 L38 69 Z" fill="#e9dcc3"/><line x1="50" y1="84" x2="50" y2="100" stroke="#4a2c18" stroke-width="2"/>' },
    { id: 'top-polar', slot: 'top', name: 'Polarjacke', price: 350, level: 14, svg: '<path d="M16 100 C16 79 31 70 50 70 C69 70 84 79 84 100 Z" fill="#7fc8f8"/><ellipse cx="50" cy="71" rx="17" ry="5" fill="#ffffff"/><line x1="50" y1="75" x2="50" y2="100" stroke="#3a7bd5" stroke-width="2"/>' },
    { id: 'top-gold', slot: 'top', name: 'Goldanzug', price: 800, level: 22, svg: '<path d="M16 100 C16 79 31 70 50 70 C69 70 84 79 84 100 Z" fill="#e6b800"/><path d="M42 70 L50 86 L58 70 Z" fill="#fff3b0"/><circle cx="50" cy="92" r="2" fill="#7a5c00"/>' },

    { id: 'hat-none', slot: 'hat', name: 'Ohne', price: 0, level: 1, svg: '' },
    { id: 'hat-cap', slot: 'hat', name: 'Cap', price: 80, level: 1, svg: '<path d="M29 35 C29 15 71 15 71 35 Z" fill="#e5534b"/><path d="M50 32 L84 33 Q84 38 68 38 L50 37 Z" fill="#b83a33"/><circle cx="50" cy="17" r="2" fill="#b83a33"/>' },
    { id: 'hat-beanie', slot: 'hat', name: 'Wollmütze', price: 100, level: 2, svg: '<path d="M29 36 C29 13 71 13 71 36 Z" fill="#3a86ff"/><rect x="27" y="31" width="46" height="8" rx="4" fill="#265dbe"/><circle cx="50" cy="12" r="5" fill="#ffffff"/>' },
    { id: 'hat-sun', slot: 'hat', name: 'Sonnenhut', price: 120, level: 3, svg: '<ellipse cx="50" cy="31" rx="33" ry="7" fill="#f2d16b"/><path d="M33 31 C33 14 67 14 67 31 Z" fill="#f2d16b"/><rect x="33" y="25" width="34" height="5" fill="#e76f51"/>' },
    { id: 'hat-explorer', slot: 'hat', name: 'Tropenhelm', price: 200, level: 6, svg: '<ellipse cx="50" cy="31" rx="29" ry="6" fill="#c9b27c"/><path d="M32 31 C32 10 68 10 68 31 Z" fill="#dcc690"/><rect x="32" y="26" width="36" height="4" fill="#7b5e2a"/>' },
    { id: 'hat-captain', slot: 'hat', name: 'Kapitänsmütze', price: 250, level: 9, svg: '<ellipse cx="50" cy="22" rx="24" ry="8" fill="#ffffff"/><rect x="30" y="22" width="40" height="10" fill="#1d3557"/><path d="M32 32 L68 32 Q66 38 50 38 Q34 38 32 32 Z" fill="#111111"/><circle cx="50" cy="27" r="3" fill="#ffd700"/>' },
    { id: 'hat-party', slot: 'hat', name: 'Partyhut', price: 150, level: 4, svg: '<path d="M38 30 L50 3 L62 30 Z" fill="#9b5de5"/><path d="M41 23 L59 23 L57 19 L43 19 Z M45 13 L55 13 L53 9 L47 9 Z" fill="#fee440"/><circle cx="50" cy="4" r="3.5" fill="#f15bb5"/>' },
    { id: 'hat-top', slot: 'hat', name: 'Zylinder', price: 350, level: 12, svg: '<rect x="36" y="4" width="28" height="27" fill="#1b1b1b"/><rect x="36" y="23" width="28" height="5" fill="#c1121f"/><ellipse cx="50" cy="31" rx="24" ry="4" fill="#1b1b1b"/>' },
    { id: 'hat-crown', slot: 'hat', name: 'Krone', price: 1000, level: 20, svg: '<path d="M31 33 L31 14 L40 23 L50 9 L60 23 L69 14 L69 33 Z" fill="#ffd700" stroke="#b8860b" stroke-width="1.5"/><circle cx="50" cy="26" r="3" fill="#e63946"/><circle cx="39" cy="28" r="2" fill="#3a86ff"/><circle cx="61" cy="28" r="2" fill="#2a9d8f"/>' },

    { id: 'glasses-none', slot: 'glasses', name: 'Ohne', price: 0, level: 1, svg: '' },
    { id: 'glasses-round', slot: 'glasses', name: 'Runde Brille', price: 60, level: 1, svg: '<g stroke="#222222" stroke-width="1.8" fill="#ffffff" fill-opacity="0.25"><circle cx="42" cy="44" r="6"/><circle cx="58" cy="44" r="6"/></g><line x1="48" y1="44" x2="52" y2="44" stroke="#222222" stroke-width="1.8"/>' },
    { id: 'glasses-sun', slot: 'glasses', name: 'Sonnenbrille', price: 100, level: 2, svg: '<rect x="34" y="40" width="14" height="9" rx="3" fill="#111111"/><rect x="52" y="40" width="14" height="9" rx="3" fill="#111111"/><line x1="48" y1="43" x2="52" y2="43" stroke="#111111" stroke-width="2"/>' },
    { id: 'glasses-heart', slot: 'glasses', name: 'Herzbrille', price: 150, level: 5, svg: '<g fill="#ff4d6d"><path d="M42 50 L35 43 C33 40 36 36 39 38 L42 40 L45 38 C48 36 51 40 49 43 Z"/><path d="M58 50 L51 43 C49 40 52 36 55 38 L58 40 L61 38 C64 36 67 40 65 43 Z"/></g>' },
    { id: 'glasses-ski', slot: 'glasses', name: 'Skibrille', price: 200, level: 8, svg: '<line x1="28" y1="44" x2="72" y2="44" stroke="#222222" stroke-width="3"/><rect x="33" y="38" width="34" height="12" rx="6" fill="#ff9f1c" stroke="#ffffff" stroke-width="1.5"/>' },
    { id: 'glasses-monocle', slot: 'glasses', name: 'Monokel', price: 300, level: 11, svg: '<circle cx="58" cy="44" r="6" stroke="#b8860b" stroke-width="2" fill="#ffffff" fill-opacity="0.3"/><path d="M64 46 Q68 58 62 68" stroke="#b8860b" stroke-width="1" fill="none"/>' },

    { id: 'acc-none', slot: 'accessory', name: 'Ohne', price: 0, level: 1, svg: '' },
    { id: 'acc-bowtie', slot: 'accessory', name: 'Fliege', price: 60, level: 1, svg: '<path d="M50 74 L41 69 L41 79 Z M50 74 L59 69 L59 79 Z" fill="#c1121f"/><circle cx="50" cy="74" r="2.5" fill="#8a0c16"/>' },
    { id: 'acc-scarf', slot: 'accessory', name: 'Schal', price: 100, level: 2, svg: '<path d="M35 68 C40 75 60 75 65 68 L66 73 C60 80 40 80 34 73 Z" fill="#e63946"/><rect x="56" y="74" width="7" height="16" rx="2" fill="#e63946"/>' },
    { id: 'acc-backpack', slot: 'accessory', name: 'Rucksack', price: 120, level: 3, svg: '<rect x="30" y="72" width="5" height="28" fill="#8d6e3f"/><rect x="65" y="72" width="5" height="28" fill="#8d6e3f"/>' },
    { id: 'acc-camera', slot: 'accessory', name: 'Kamera', price: 180, level: 5, svg: '<path d="M36 70 L46 86 M64 70 L54 86" stroke="#333333" stroke-width="1.5"/><rect x="42" y="84" width="16" height="11" rx="2" fill="#333333"/><circle cx="50" cy="89.5" r="3.5" fill="#9ad1ff" stroke="#111111"/>' },
    { id: 'acc-binoculars', slot: 'accessory', name: 'Fernglas', price: 220, level: 7, svg: '<path d="M38 70 L45 85 M62 70 L55 85" stroke="#333333" stroke-width="1.5"/><circle cx="45" cy="88" r="5" fill="#2b2d42"/><circle cx="55" cy="88" r="5" fill="#2b2d42"/><circle cx="45" cy="88" r="2.5" fill="#9ad1ff"/><circle cx="55" cy="88" r="2.5" fill="#9ad1ff"/>' },
    { id: 'acc-compass', slot: 'accessory', name: 'Kompass-Medaille', price: 300, level: 10, svg: '<path d="M44 70 L50 82 L56 70" stroke="#1d3557" stroke-width="3" fill="none"/><circle cx="50" cy="87" r="6" fill="#ffd700" stroke="#b8860b"/><path d="M50 82 L52 87 L50 92 L48 87 Z" fill="#c1121f"/>' },
    { id: 'acc-globe', slot: 'accessory', name: 'Mini-Globus', price: 500, level: 16, svg: '<circle cx="50" cy="88" r="7" fill="#0b3c8c" stroke="#ffffff" stroke-width="1.2"/><path d="M45 84 C48 86 47 89 50 90 C52 88 55 89 55 86 C53 84 50 85 49 83 Z" fill="#43aa8b"/><ellipse cx="50" cy="88" rx="7" ry="2.5" stroke="#ffffff" stroke-width="0.8" fill="none"/>' },

    { id: 'bg-sky', slot: 'background', name: 'Himmelblau', price: 0, level: 1, svg: '<rect width="100" height="100" fill="#9ad1ff"/>' },
    { id: 'bg-mint', slot: 'background', name: 'Minze', price: 0, level: 1, svg: '<rect width="100" height="100" fill="#b8f2d8"/>' },
    { id: 'bg-sunset', slot: 'background', name: 'Sonnenuntergang', price: 120, level: 3, svg: '<rect width="100" height="100" fill="#ffb4a2"/><rect y="50" width="100" height="50" fill="#e5989b"/><circle cx="78" cy="52" r="12" fill="#ffd166"/>' },
    { id: 'bg-ocean', slot: 'background', name: 'Ozean', price: 150, level: 5, svg: '<rect width="100" height="100" fill="#48cae4"/><path d="M0 70 Q12 64 25 70 T50 70 T75 70 T100 70 V100 H0 Z" fill="#0077b6"/>' },
    { id: 'bg-forest', slot: 'background', name: 'Wald', price: 150, level: 6, svg: '<rect width="100" height="100" fill="#cdeac0"/><g fill="#2d6a4f"><path d="M8 80 L16 55 L24 80 Z"/><path d="M76 80 L86 50 L96 80 Z"/><path d="M84 92 L92 70 L100 92 Z"/></g>' },
    { id: 'bg-map', slot: 'background', name: 'Weltkarte', price: 250, level: 9, svg: '<rect width="100" height="100" fill="#d8ecff"/><g fill="#9cc58a"><path d="M6 20 C14 14 24 18 22 28 C20 36 10 34 6 28 Z"/><path d="M74 12 C86 10 96 18 92 26 C86 30 78 26 74 20 Z"/><path d="M80 60 C90 58 96 66 90 74 C84 76 78 70 80 60 Z"/><path d="M4 62 C10 58 16 64 12 72 C8 74 4 70 4 62 Z"/></g>' },
    { id: 'bg-space', slot: 'background', name: 'Weltraum', price: 400, level: 13, svg: '<rect width="100" height="100" fill="#14143c"/><g fill="#ffffff"><circle cx="12" cy="18" r="1.2"/><circle cx="85" cy="12" r="1.5"/><circle cx="90" cy="60" r="1"/><circle cx="8" cy="66" r="1.4"/><circle cx="20" cy="40" r="0.8"/><circle cx="78" cy="38" r="0.9"/></g><circle cx="86" cy="84" r="8" fill="#f4a261"/>' },
    { id: 'bg-rainbow', slot: 'background', name: 'Regenbogen', price: 600, level: 18, svg: '<rect width="100" height="100" fill="#fff8e7"/><g fill="none" stroke-width="5"><circle cx="50" cy="100" r="62" stroke="#ff595e"/><circle cx="50" cy="100" r="57" stroke="#ffca3a"/><circle cx="50" cy="100" r="52" stroke="#8ac926"/><circle cx="50" cy="100" r="47" stroke="#1982c4"/><circle cx="50" cy="100" r="42" stroke="#6a4c93"/></g>' },
    { id: 'bg-gold', slot: 'background', name: 'Gold', price: 900, level: 24, svg: '<rect width="100" height="100" fill="#ffd700"/><g fill="#fff3b0"><path d="M0 0 L30 0 L0 30 Z"/><path d="M100 100 L70 100 L100 70 Z"/><path d="M60 0 L75 0 L0 75 L0 60 Z"/></g>' },

    { id: 'flag-none', slot: 'flag', name: 'Ohne', price: 0, level: 1, svg: '' }
];
