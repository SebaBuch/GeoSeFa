const ALWAYS_INCLUDED_CODES = ['UNK', 'XKX'];
const EXCLUDED_COUNTRY_NAMES = ['Abkhazia', 'Abchasien'];

class CountryService {
    constructor(storage) {
        this.storage = storage;
        this.countries = [];
        this.byCode = {};
        this.lastError = '';
    }

    async loadCountries(forceReload) {
        const cached = this.storage.loadGlobal('countries', null);
        if (cached && !forceReload) {
            this.setCountries(cached);
            return true;
        }
        const rawList = await this.fetchAllPages();
        if (rawList.length > 0) {
            const countries = this.normalizeList(rawList);
            this.storage.saveGlobal('countries', countries);
            this.setCountries(countries);
        }
        return rawList.length > 0;
    }

    async fetchAllPages() {
        const rawList = [];
        for (let page = 0; page < 5; page++) {
            const data = await this.fetchPage(rawList.length);
            if (!data) {
                return [];
            }
            rawList.push(...data.objects);
            if (!data.meta.more) {
                break;
            }
        }
        return rawList;
    }

    async fetchPage(offset) {
        const url = API_URL + '?limit=100&offset=' + offset;
        try {
            const response = await fetch(url, { headers: { Authorization: 'Bearer ' + API_KEY } });
            if (!response.ok) {
                throw new Error('Die API hat mit Fehler ' + response.status + ' geantwortet.');
            }
            const json = await response.json();
            return json.data;
        } catch (error) {
            this.lastError = 'Länderdaten konnten nicht geladen werden: ' + error.message;
            return null;
        }
    }

    normalizeList(rawList) {
        const countries = [];
        for (let i = 0; i < rawList.length; i++) {
            if (this.isSovereign(rawList[i])) {
                countries.push(this.normalizeCountry(rawList[i]));
            }
        }
        return countries;
    }

    isSovereign(raw) {
        if (ALWAYS_INCLUDED_CODES.includes(raw.codes.alpha_3)) {
            return true;
        }
        return raw.classification ? raw.classification.sovereign === true : true;
    }

    normalizeCountry(raw) {
        const country = this.getNames(raw);
        country.capital = this.getCapital(raw);
        country.continent = this.getContinent(raw);
        country.landlocked = raw.landlocked === true;
        country.borders = raw.borders || [];
        country.area = this.getArea(raw);
        country.population = raw.population || 0;
        country.flag = this.getFlag(raw);
        return country;
    }

    getNames(raw) {
        return {
            code: raw.codes.alpha_3,
            numCode: raw.codes.ccn3 || '',
            name: this.getGermanName(raw),
            englishName: raw.names.common,
            altNames: raw.names.alternates || []
        };
    }

    getGermanName(raw) {
        const translations = raw.names.translations;
        if (translations && translations.deu && translations.deu.common) {
            return translations.deu.common;
        }
        return raw.names.common;
    }

    getCapital(raw) {
        if (!raw.capitals || raw.capitals.length === 0) {
            return '';
        }
        const name = raw.capitals[0].name;
        return CAPITAL_TRANSLATIONS[name] || name;
    }

    getContinent(raw) {
        const hasContinents = raw.continents && raw.continents.length > 0;
        const key = hasContinents ? raw.continents[0] : raw.region;
        return CONTINENT_NAMES[key] || 'Sonstige';
    }

    getArea(raw) {
        if (!raw.area) {
            return 0;
        }
        return typeof raw.area === 'number' ? raw.area : raw.area.kilometers;
    }

    getFlag(raw) {
        if (!raw.flag) {
            return '';
        }
        return raw.flag.url_svg || raw.flag.url_png || '';
    }

    setCountries(countries) {
        this.countries = countries.filter(country => !this.isExcluded(country));
        this.byCode = {};
        for (let i = 0; i < this.countries.length; i++) {
            this.byCode[this.countries[i].code] = this.countries[i];
        }
    }

    isExcluded(country) {
        return EXCLUDED_COUNTRY_NAMES.includes(country.englishName) || EXCLUDED_COUNTRY_NAMES.includes(country.name);
    }

    getCountry(code) {
        return this.byCode[code];
    }

    getByRegion(region) {
        if (region === 'Welt') {
            return this.countries;
        }
        const regionCountries = this.countries.filter(country => country.continent === region);
        return regionCountries;
    }

    getNeighbors(country) {
        const neighbors = [];
        for (let i = 0; i < country.borders.length; i++) {
            const neighbor = this.byCode[country.borders[i]];
            if (neighbor) {
                neighbors.push(neighbor);
            }
        }
        return neighbors;
    }

    findByName(text) {
        const search = normalizeText(text);
        for (let i = 0; i < this.countries.length; i++) {
            if (this.matchesName(this.countries[i], search)) {
                return this.countries[i];
            }
        }
        return null;
    }

    matchesName(country, search) {
        if (search === '') {
            return false;
        }
        if (normalizeText(country.name) === search || normalizeText(country.englishName) === search) {
            return true;
        }
        for (let i = 0; i < country.altNames.length; i++) {
            if (normalizeText(country.altNames[i]) === search) {
                return true;
            }
        }
        return false;
    }

    getSortedNames() {
        const names = [];
        for (let i = 0; i < this.countries.length; i++) {
            names.push(this.countries[i].name);
        }
        return names.sort();
    }
}
