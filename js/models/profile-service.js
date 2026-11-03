class ProfileService {
    constructor(storage) {
        this.storage = storage;
        this.profiles = storage.loadGlobal('profiles', []);
        this.currentId = storage.loadGlobal('current-profile', '');
        if (this.getCurrent()) {
            storage.setProfile(this.currentId);
        }
    }

    getCurrent() {
        const matches = this.profiles.filter(profile => profile.id === this.currentId);
        return matches[0];
    }

    hasProfile() {
        return this.getCurrent() !== undefined;
    }

    createProfile(name, avatar) {
        const id = 'p' + Date.now();
        if (this.profiles.length === 0) {
            this.storage.migrateOldData(id);
        }
        this.profiles.push({ id: id, name: name, avatar: avatar, title: 'Neuling', frame: 'none', theme: 'standard', xp: 0 });
        this.saveProfiles();
        this.select(id);
    }

    select(id) {
        this.currentId = id;
        this.storage.saveGlobal('current-profile', id);
        this.storage.setProfile(id);
    }

    saveProfiles() {
        this.storage.saveGlobal('profiles', this.profiles);
    }

    addXp(amount) {
        const profile = this.getCurrent();
        if (!profile || amount <= 0) {
            return;
        }
        const oldLevel = this.getLevelInfo(profile.xp).level;
        profile.xp += amount;
        this.saveProfiles();
        const newLevel = this.getLevelInfo(profile.xp).level;
        for (let level = oldLevel + 1; level <= newLevel; level++) {
            this.showLevelUp(level);
        }
        updateHeader();
    }

    getLevelInfo(xp) {
        let level = 1;
        let rest = xp;
        let needed = this.getNeededXp(level);
        while (rest >= needed && level < MAX_LEVEL) {
            rest -= needed;
            level++;
            needed = this.getNeededXp(level);
        }
        return { level: level, current: rest, needed: needed };
    }

    getNeededXp(level) {
        return 100 + (level - 1) * 25;
    }

    showLevelUp(level) {
        const rewards = PROFILE_OPTIONS.filter(option => option.level === level);
        let rewardText = '';
        for (let i = 0; i < rewards.length; i++) {
            rewardText += this.getTypeTitle(rewards[i].type) + ': ' + rewards[i].label + ' ';
        }
        const toastId = createToastId();
        showToast(toastId, levelToastTemplate(toastId, level, rewardText));
    }

    getTypeTitle(type) {
        const matches = PROFILE_OPTION_TYPES.filter(item => item.key === type);
        return matches[0].title;
    }

    isOptionUnlocked(option) {
        return option.level <= this.getLevelInfo(this.getCurrent().xp).level;
    }

    chooseOption(type, value) {
        const matches = PROFILE_OPTIONS.filter(option => option.type === type && option.value === value);
        if (matches.length === 0 || !this.isOptionUnlocked(matches[0])) {
            return;
        }
        this.getCurrent()[type] = value;
        this.saveProfiles();
    }

    getBestStreak() {
        return this.storage.load('best-daily-streak', 0);
    }

    getRankIndex(bestStreak) {
        let index = 0;
        for (let i = 0; i < RANKS.length; i++) {
            index = bestStreak >= RANKS[i].days ? i : index;
        }
        return index;
    }
}
