class CloudService {
    constructor(auth) {
        this.auth = auth;
    }

    async buildUrl(path) {
        const token = await this.auth.getToken();
        const authText = token === '' ? '' : '?auth=' + token;
        return FIREBASE_DB_URL + '/' + path + '.json' + authText;
    }

    async get(path) {
        try {
            const response = await fetch(await this.buildUrl(path));
            if (!response.ok) {
                return { ok: false, data: null };
            }
            return { ok: true, data: await response.json() };
        } catch (error) {
            console.error('Laden aus der Cloud fehlgeschlagen:', error);
            return { ok: false, data: null };
        }
    }

    async send(method, path, data) {
        try {
            const options = { method: method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) };
            const response = await fetch(await this.buildUrl(path), options);
            return response.ok;
        } catch (error) {
            console.error('Speichern in der Cloud fehlgeschlagen:', error);
            return false;
        }
    }

    async put(path, data) {
        return await this.send('PUT', path, data);
    }

    async patch(path, data) {
        return await this.send('PATCH', path, data);
    }

    async remove(path) {
        try {
            const response = await fetch(await this.buildUrl(path), { method: 'DELETE' });
            return response.ok;
        } catch (error) {
            console.error('Löschen in der Cloud fehlgeschlagen:', error);
            return false;
        }
    }
}
