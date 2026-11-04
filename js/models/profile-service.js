class ProfileService {
    constructor(storage) {
        this.storage = storage;
        this.profiles = storage.loadGlobal('profiles', []);
        this.currentId = storage.loadGlobal('current-profile', '');
        this.prepareProfiles();
        if (this.getCurrent()) {
            storage.setProfile(this.currentId);
        }
    }

    prepareProfiles() {
        for (let i = 0; i < this.profiles.length; i++) {
            const profile = this.profiles[i];
            if (!profile.outfit) {
                const flagId = profile.avatar ? 'flag-' + profile.avatar : 'flag-none';
                profile.outfit = { ...DEFAULT_OUTFIT, flag: flagId };
                profile.owned = profile.avatar ? [flagId] : [];
                profile.coins = START_COINS;
            }
            profile.outfit = { ...DEFAULT_OUTFIT, ...profile.outfit };
        }
    }

    getCurrent() {
        const matches = this.profiles.filter(profile => profile.id === this.currentId);
        return matches[0];
    }

    hasProfile() {
        return this.getCurrent() !== undefined;
    }

    createAccountProfile(uid, name, skin, legacyId) {
        const legacy = this.profiles.filter(profile => profile.id === legacyId)[0];
        this.copyOldData(uid, legacy);
        const outfit = { ...DEFAULT_OUTFIT, skin: skin };
        const fresh = { title: 'Neuling', frame: 'none', theme: 'standard', xp: 0, coins: START_COINS, owned: [], outfit: outfit };
        const base = legacy ? legacy : fresh;
        this.storeAccountProfile({ ...base, id: uid, name: name });
        this.select(uid);
        this.storage.markAllChanged();
    }

    copyOldData(uid, legacy) {
        if (this.profiles.length === 0) {
            this.storage.migrateOldData(uid);
        }
        if (legacy) {
            this.storage.setProfileData(uid, this.storage.getProfileData(legacy.id));
        }
    }

    storeAccountProfile(profile) {
        const others = this.profiles.filter(item => item.id !== profile.id);
        this.profiles = [...others, { ...profile, account: true }];
        this.prepareProfiles();
        this.writeProfiles();
    }

    getLegacyProfiles() {
        return this.profiles.filter(profile => !profile.account);
    }

    removeProfile(uid) {
        this.profiles = this.profiles.filter(profile => profile.id !== uid);
        this.writeProfiles();
        this.storage.setProfileData(uid, {});
        this.storage.saveGlobal('changed-' + uid, {});
    }

    clearCurrent() {
        this.currentId = '';
        this.storage.saveGlobal('current-profile', '');
        this.storage.setProfile('');
        this.storage.profilePrefix = '';
    }

    select(id) {
        this.currentId = id;
        this.storage.saveGlobal('current-profile', id);
        this.storage.setProfile(id);
    }

    saveProfiles() {
        this.writeProfiles();
        this.storage.markChanged('__profile');
    }

    writeProfiles() {
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
        this.handleLevelUps(oldLevel, newLevel);
        updateHeader();
    }

    handleLevelUps(oldLevel, newLevel) {
        for (let level = oldLevel + 1; level <= newLevel; level++) {
            this.showLevelUp(level);
            this.addCoins(COINS_PER_LEVEL);
        }
        achievementService.checkLevel(newLevel);
    }

    addCoins(amount) {
        const profile = this.getCurrent();
        if (!profile || amount <= 0) {
            return;
        }
        profile.coins += amount;
        this.saveProfiles();
        achievementService.increase('coins-earned', amount);
        achievementService.unlockIf(profile.coins >= 3000, 'hidden-rich');
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
        let rewardText = COINS_PER_LEVEL + ' Coins ';
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
