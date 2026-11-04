class NameService {
    constructor(cloud, auth) {
        this.cloud = cloud;
        this.auth = auth;
    }

    getKey(name) {
        const lower = name.trim().toLowerCase();
        return lower.replace(/[^a-z0-9äöüß]/g, '-');
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
