class WorldMap {
    constructor(shapeService) {
        this.shapeService = shapeService;
        this.map = null;
        this.layers = {};
    }

    create(elementId, region) {
        this.destroy();
        this.layers = {};
        this.map = L.map(elementId, { attributionControl: false, minZoom: 1, maxZoom: 9, zoomSnap: 0.25 });
        const geoJson = { type: 'FeatureCollection', features: this.shapeService.getFeatureList() };
        L.geoJSON(geoJson, {
            style: () => this.getStyle(MAP_COLORS.default),
            onEachFeature: (feature, layer) => this.registerLayer(feature, layer)
        }).addTo(this.map);
        this.showRegion(region);
    }

    registerLayer(feature, layer) {
        const code = feature.properties.gameCode;
        this.layers[code] = layer;
        layer.on('click', () => this.handleClick(code));
    }

    handleClick(code) {
        if (currentGame && currentGame.handleMapClick) {
            currentGame.handleMapClick(code);
        }
    }

    getStyle(color) {
        return { color: '#ffffff', weight: 0.7, fillColor: color, fillOpacity: 1 };
    }

    colorCountry(code, color) {
        if (this.layers[code]) {
            this.layers[code].setStyle(this.getStyle(color));
            this.layers[code].bringToFront();
        }
    }

    colorAllExcept(codes, color) {
        const allCodes = this.shapeService.getCodes();
        for (let i = 0; i < allCodes.length; i++) {
            if (!codes.includes(allCodes[i])) {
                this.colorCountry(allCodes[i], color);
            }
        }
    }

    hideAll() {
        const hiddenStyle = { opacity: 0, fillOpacity: 0 };
        const allCodes = this.shapeService.getCodes();
        for (let i = 0; i < allCodes.length; i++) {
            this.layers[allCodes[i]].setStyle(hiddenStyle);
        }
    }

    fitCountries(codes) {
        const bounds = this.shapeService.getMapBounds(codes[0]);
        for (let i = 1; i < codes.length; i++) {
            const next = this.shapeService.getMapBounds(codes[i]);
            bounds[0][0] = Math.min(bounds[0][0], next[0][0]);
            bounds[0][1] = Math.min(bounds[0][1], next[0][1]);
            bounds[1][0] = Math.max(bounds[1][0], next[1][0]);
            bounds[1][1] = Math.max(bounds[1][1], next[1][1]);
        }
        this.map.invalidateSize();
        this.map.fitBounds(bounds, { padding: [30, 30], animate: false });
    }

    refreshSize() {
        if (this.map) {
            this.map.invalidateSize();
        }
    }

    showRegion(region) {
        const view = REGION_VIEWS[region] || REGION_VIEWS['Welt'];
        this.map.fitBounds(view, { animate: false });
    }

    destroy() {
        if (this.map) {
            this.map.remove();
            this.map = null;
        }
    }
}
