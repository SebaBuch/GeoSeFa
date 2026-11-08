class SyncService {
    constructor(storage, profiles, cloud, auth) {
        this.storage = storage;
        this.profiles = profiles;
        this.cloud = cloud;
        this.auth = auth;
        this.isUploading = false;
        this.timeoutId = null;
    }

    schedule() {
        if (!this.auth.isLoggedIn() || !this.profiles.hasProfile()) {
            return;
        }
        clearTimeout(this.timeoutId);
        this.timeoutId = setTimeout(() => this.upload(), 2000);
    }

    async upload() {
        const keys = this.storage.getChangedKeys();
        if (this.isUploading || keys.length === 0 || !this.profiles.hasProfile()) {
            return;
        }
        this.isUploading = true;
        if (await this.sendChanges(keys)) {
            this.storage.clearChangedKeys(keys);
        }
        this.isUploading = false;
    }

    async sendChanges(keys) {
        const uid = this.auth.getUid();
        const data = this.collectData(keys);
        const hasData = Object.keys(data).length > 0;
        const dataOk = hasData ? await this.cloud.patch('users/' + uid + '/data', data) : true;
        const profileOk = await this.cloud.put('users/' + uid + '/profileJson', JSON.stringify(this.profiles.getCurrent()));
        const publicOk = await this.cloud.put('public/' + uid, buildPublicSummary());
        return dataOk && profileOk && publicOk;
    }

    collectData(keys) {
        const data = {};
        for (let i = 0; i < keys.length; i++) {
            if (keys[i] !== '__profile') {
                data[keys[i]] = this.storage.getRawValue(keys[i]);
            }
        }
        return data;
    }

    async download(uid) {
        const result = await this.cloud.get('users/' + uid);
        if (!result.ok) {
            return 'error';
        }
        if (!result.data || !result.data.profileJson) {
            return 'empty';
        }
        this.storage.setProfileData(uid, result.data.data || {});
        this.profiles.storeAccountProfile(JSON.parse(result.data.profileJson));
        return 'loaded';
    }

    async startSession() {
        const uid = this.auth.getUid();
        if (this.profiles.profiles.filter(profile => profile.id === uid).length > 0) {
            this.profiles.select(uid);
            await this.upload();
        }
        const state = await this.download(uid);
        if (state === 'loaded') {
            this.profiles.select(uid);
        }
        return state;
    }

    async deleteCloudData(uid) {
        clearTimeout(this.timeoutId);
        const userOk = await this.cloud.remove('users/' + uid);
        const publicOk = await this.cloud.remove('public/' + uid);
        return userOk && publicOk;
    }

    async publishSummary() {
        await this.upload();
        await this.cloud.put('public/' + this.auth.getUid(), buildPublicSummary());
    }

    async loadPublicProfiles() {
        const result = await this.cloud.get('public');
        if (!result.ok || !result.data) {
            return null;
        }
        const uids = Object.keys(result.data);
        const players = [];
        for (let i = 0; i < uids.length; i++) {
            const player = result.data[uids[i]];
            const name = nameService.isAllowed(player.name || '') ? player.name : 'Gesperrter Name';
            players.push({ ...player, name: name, uid: uids[i] });
        }
        return players;
    }
}
