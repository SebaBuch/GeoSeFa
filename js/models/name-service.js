class NameService {
    constructor(cloud, auth) {
        this.cloud = cloud;
        this.auth = auth;
    }

    getKey(name) {
        const lower = name.trim().toLowerCase();
        return lower.replace(/[^a-z0-9äöüß]/g, '-');
    }

    isAllowed(name) {
        const text = this.normalizeForCheck(name);
        const blocked = BLOCKED_NAME_WORDS.filter(word => text.includes(this.normalizeForCheck(word)));
        return blocked.length === 0;
    }

    normalizeForCheck(text) {
        const replacements = { '0': 'o', '1': 'i', '3': 'e', '4': 'a', '5': 's', '7': 't', '8': 'b', '@': 'a', '$': 's', '!': 'i', 'ä': 'ae', 'ö': 'oe', 'ü': 'ue', 'ß': 'ss' };
        const lower = text.toLowerCase();
        let result = '';
        for (let i = 0; i < lower.length; i++) {
            result += replacements[lower[i]] || lower[i];
        }
        const lettersOnly = result.replace(/[^a-z]/g, '');
        return lettersOnly.replace(/(.)\1+/g, '$1');
    }

    async isFree(name) {
        const result = await this.cloud.get('names/' + this.getKey(name));
        if (!result.ok) {
            return true;
        }
        return result.data === null || result.data === this.auth.getUid();
    }

    async claim(name) {
        return await this.cloud.put('names/' + this.getKey(name), this.auth.getUid());
    }

    async release(name) {
        if (await this.isFree(name)) {
            return await this.cloud.remove('names/' + this.getKey(name));
        }
        return true;
    }

    async findFreeName(name) {
        let candidate = name;
        while (!await this.isFree(candidate)) {
            candidate = name + Math.floor(Math.random() * 1000);
        }
        return candidate;
    }
}
