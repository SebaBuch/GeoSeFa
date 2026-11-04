const SHAPE_CODE_ALIASES = {
    KOS: ['UNK', 'XKX']
};

class ShapeService {
    constructor(countryService) {
        this.countryService = countryService;
        this.features = {};
        this.outlines = {};
    }

    async loadShapes() {
        try {
            const response = await fetch(SHAPES_URL);
            const geoJson = await response.json();
            this.features = {};
            this.outlines = {};
            this.matchFeatures(geoJson.features);
            return true;
        } catch (error) {
            console.error('Umrisse konnten nicht geladen werden:', error);
            return false;
        }
    }

    matchFeatures(features) {
        for (let i = 0; i < features.length; i++) {
            const code = this.findCode(features[i].properties);
            if (code && !this.features[code]) {
                features[i].properties.gameCode = code;
                this.features[code] = features[i];
            }
        }
    }

    findCode(properties) {
        const aliases = SHAPE_CODE_ALIASES[properties.ADM0_A3] || [];
        const candidates = [properties.ISO_A3_EH, properties.ISO_A3, properties.ADM0_A3, properties.SOV_A3, ...aliases];
        for (let i = 0; i < candidates.length; i++) {
            if (candidates[i] && this.countryService.getCountry(candidates[i])) {
                return candidates[i];
            }
        }
        return this.findByNumber(properties.ISO_N3);
    }

    findByNumber(numCode) {
        const countries = this.countryService.countries;
        for (let i = 0; i < countries.length; i++) {
            if (numCode && countries[i].numCode === numCode) {
                return countries[i].code;
            }
        }
        return null;
    }

    hasShape(code) {
        return this.features[code] !== undefined;
    }

    getCodes() {
        return Object.keys(this.features);
    }

    getFeatureList() {
        return Object.values(this.features);
    }

    getMapBounds(code) {
        const polygons = this.getPolygons(this.features[code].geometry);
        const largestPolygon = polygons[this.getLargestIndex(polygons)];
        const bounds = this.getBounds([largestPolygon[0]]);
        return [[bounds.minY, bounds.minX], [bounds.maxY, bounds.maxX]];
    }

    getOutlineSvg(code, elementId) {
        const outline = this.getOutline(code);
        const bounds = outline.bounds;
        const width = bounds.maxX - bounds.minX;
        const height = bounds.maxY - bounds.minY;
        const padding = Math.max(width, height) * 0.03;
        const viewBox = (bounds.minX - padding) + ' ' + (bounds.minY - padding) + ' ' + (width + padding * 2) + ' ' + (height + padding * 2);
        return outlineSvgTemplate(elementId, viewBox, outline.path);
    }

    getOutline(code) {
        if (!this.outlines[code]) {
            this.outlines[code] = this.buildOutline(this.features[code]);
        }
        return this.outlines[code];
    }

    buildOutline(feature) {
        const polygons = this.getPolygons(feature.geometry);
        const shifted = this.shiftPolygons(polygons, this.needsShift(polygons));
        const mainPolygons = this.getMainPolygons(shifted);
        const rings = this.projectPolygons(mainPolygons);
        return {
            path: this.buildPath(rings),
            bounds: this.getBounds(rings),
            area: this.getArea(rings)
        };
    }

    getPolygons(geometry) {
        if (geometry.type === 'Polygon') {
            return [geometry.coordinates];
        }
        return geometry.coordinates;
    }

    getOuterRings(polygons) {
        const rings = [];
        for (let i = 0; i < polygons.length; i++) {
            rings.push(polygons[i][0]);
        }
        return rings;
    }

    needsShift(polygons) {
        const bounds = this.getBounds(this.getOuterRings(polygons));
        return bounds.maxX - bounds.minX > 180;
    }

    shiftPolygons(polygons, shift) {
        if (!shift) {
            return polygons;
        }
        const result = [];
        for (let i = 0; i < polygons.length; i++) {
            const rings = [];
            for (let j = 0; j < polygons[i].length; j++) {
                rings.push(this.shiftRing(polygons[i][j]));
            }
            result.push(rings);
        }
        return result;
    }

    shiftRing(ring) {
        const points = [];
        for (let i = 0; i < ring.length; i++) {
            const longitude = ring[i][0] < 0 ? ring[i][0] + 360 : ring[i][0];
            points.push([longitude, ring[i][1]]);
        }
        return points;
    }

    getMainPolygons(polygons) {
        const mainBounds = this.getBounds([polygons[this.getLargestIndex(polygons)][0]]);
        const span = Math.max(mainBounds.maxX - mainBounds.minX, mainBounds.maxY - mainBounds.minY);
        const limit = Math.max(30, span);
        const result = [];
        for (let i = 0; i < polygons.length; i++) {
            if (this.isNear(polygons[i], mainBounds, limit)) {
                result.push(polygons[i]);
            }
        }
        return result;
    }

    getLargestIndex(polygons) {
        let largestIndex = 0;
        let largestSize = 0;
        for (let i = 0; i < polygons.length; i++) {
            const bounds = this.getBounds([polygons[i][0]]);
            const size = (bounds.maxX - bounds.minX) * (bounds.maxY - bounds.minY);
            if (size > largestSize) {
                largestSize = size;
                largestIndex = i;
            }
        }
        return largestIndex;
    }

    isNear(polygon, mainBounds, limit) {
        const bounds = this.getBounds([polygon[0]]);
        const distanceX = Math.abs((bounds.minX + bounds.maxX) / 2 - (mainBounds.minX + mainBounds.maxX) / 2);
        const distanceY = Math.abs((bounds.minY + bounds.maxY) / 2 - (mainBounds.minY + mainBounds.maxY) / 2);
        return distanceX <= limit && distanceY <= limit;
    }

    projectPolygons(polygons) {
        const bounds = this.getBounds(this.getOuterRings(polygons));
        const middleLatitude = (bounds.minY + bounds.maxY) / 2;
        const factor = Math.cos(middleLatitude * Math.PI / 180);
        const rings = [];
        for (let i = 0; i < polygons.length; i++) {
            for (let j = 0; j < polygons[i].length; j++) {
                rings.push(this.projectRing(polygons[i][j], factor));
            }
        }
        return rings;
    }

    projectRing(ring, factor) {
        const points = [];
        for (let i = 0; i < ring.length; i++) {
            points.push([ring[i][0] * factor, -ring[i][1]]);
        }
        return points;
    }

    getBounds(rings) {
        const bounds = { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity };
        for (let i = 0; i < rings.length; i++) {
            for (let j = 0; j < rings[i].length; j++) {
                this.extendBounds(bounds, rings[i][j]);
            }
        }
        return bounds;
    }

    extendBounds(bounds, point) {
        bounds.minX = Math.min(bounds.minX, point[0]);
        bounds.maxX = Math.max(bounds.maxX, point[0]);
        bounds.minY = Math.min(bounds.minY, point[1]);
        bounds.maxY = Math.max(bounds.maxY, point[1]);
    }

    buildPath(rings) {
        let path = '';
        for (let i = 0; i < rings.length; i++) {
            path += this.buildRingPath(rings[i]);
        }
        return path;
    }

    buildRingPath(ring) {
        let path = '';
        for (let i = 0; i < ring.length; i++) {
            const command = i === 0 ? 'M' : 'L';
            path += command + ring[i][0].toFixed(3) + ' ' + ring[i][1].toFixed(3) + ' ';
        }
        return path + 'Z ';
    }

    getArea(rings) {
        let area = 0;
        for (let i = 0; i < rings.length; i++) {
            area += this.getRingArea(rings[i]);
        }
        return area;
    }

    getRingArea(ring) {
        let sum = 0;
        for (let i = 0; i < ring.length - 1; i++) {
            sum += ring[i][0] * ring[i + 1][1] - ring[i + 1][0] * ring[i][1];
        }
        return Math.abs(sum) / 2;
    }

    getDistanceInfo(code, lat, lng) {
        const polygons = this.getPolygons(this.features[code].geometry);
        if (this.isInsidePolygons(polygons, lat, lng)) {
            return { km: 0, lat: lat, lng: lng };
        }
        let nearest = { km: Infinity, lat: lat, lng: lng };
        for (let i = 0; i < polygons.length; i++) {
            nearest = this.findNearestPoint(polygons[i][0], lat, lng, nearest);
        }
        return nearest;
    }

    isInsidePolygons(polygons, lat, lng) {
        for (let i = 0; i < polygons.length; i++) {
            if (this.isInsideRing(polygons[i][0], lat, lng)) {
                return true;
            }
        }
        return false;
    }

    isInsideRing(ring, lat, lng) {
        let inside = false;
        for (let i = 0; i < ring.length; i++) {
            const j = i === 0 ? ring.length - 1 : i - 1;
            const crosses = (ring[i][1] > lat) !== (ring[j][1] > lat);
            const crossLng = (ring[j][0] - ring[i][0]) * (lat - ring[i][1]) / (ring[j][1] - ring[i][1]) + ring[i][0];
            inside = crosses && lng < crossLng ? !inside : inside;
        }
        return inside;
    }

    findNearestPoint(ring, lat, lng, nearest) {
        let best = nearest;
        for (let i = 0; i < ring.length; i++) {
            const km = getDistanceKm(lat, lng, ring[i][1], ring[i][0]);
            best = km < best.km ? { km: km, lat: ring[i][1], lng: ring[i][0] } : best;
        }
        return best;
    }
}
