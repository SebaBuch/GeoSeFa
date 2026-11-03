# GeoSeFa

Geografie-Spiele ohne Tageslimit, nur für den privaten Gebrauch.

## Einrichten

1. **API-Key:** Bei https://restcountries.com einen kostenlosen Account anlegen und einen API-Key erstellen.
   - Als erlaubte Adresse (Origin) `127.0.0.1` bzw. `localhost` eintragen.
   - Den Key in `js/config.js` bei `API_KEY` eintragen.
2. **Leaflet:** Von https://leafletjs.com/download.html herunterladen und `leaflet.js`, `leaflet.css` und den Ordner `images` nach `libs/leaflet/` kopieren.
3. **Länderumrisse:** `ne_50m_admin_0_countries.geojson` von https://github.com/nvkelso/natural-earth-vector/tree/master/geojson herunterladen, nach `data/` legen und in `countries.geojson` umbenennen.
4. Projekt in VS Code öffnen und mit **Live Server** starten (nicht per Doppelklick).

Die Länderdaten werden nur beim ersten Start von der API geladen und danach im Browser gespeichert. Mit „Länderdaten neu laden“ auf der Startseite holst du sie neu.

## Ordner

- `js/models/` – Klassen (Spiele, Quiz, Daten, Karte, Speicher)
- `js/templates/` – HTML-Templates
- `js/game.js` – Start, Navigation, Quiz-Einstellungen
- `js/config.js` – API-Key, Regionen, Farben
- `css/` – Styles für Spiele und Quiz
