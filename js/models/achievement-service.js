class AchievementService {
    constructor(storage, profiles) {
        this.storage = storage;
        this.profiles = profiles;
        this.unlocked = storage.load('achievements', {});
        this.counters = storage.load('achievement-counters', {});
    }

    isUnlocked(id) {
        return this.unlocked[id] !== undefined;
    }

    getUnlockedCount() {
        return Object.keys(this.unlocked).length;
    }

    unlock(id) {
        if (this.isUnlocked(id)) {
            return;
        }
        this.unlocked[id] = getDateKey(new Date());
        this.storage.save('achievements', this.unlocked);
        const matches = ACHIEVEMENTS.filter(achievement => achievement.id === id);
        const toastId = createToastId();
        showToast(toastId, achievementToastTemplate(toastId, matches[0]));
        this.profiles.addXp(XP_PER_TIER[matches[0].tier]);
        this.profiles.addCoins(COINS_PER_TIER[matches[0].tier]);
        updateHeader();
    }

    unlockIf(condition, id) {
        if (condition) {
            this.unlock(id);
        }
    }

    increase(name, amount) {
        this.counters[name] = (this.counters[name] || 0) + amount;
        this.storage.save('achievement-counters', this.counters);
        this.profiles.addXp((XP_PER_COUNTER[name] || 0) * amount);
        this.profiles.addCoins((COINS_PER_COUNTER[name] || 0) * amount);
        this.checkCounter(name);
    }

    getCounter(name) {
        return this.counters[name] || 0;
    }

    saveBest(name, value) {
        this.counters[name] = Math.max(this.getCounter(name), value);
        this.storage.save('achievement-counters', this.counters);
    }

    checkCounter(name) {
        const matches = ACHIEVEMENTS.filter(achievement => achievement.counter === name);
        for (let i = 0; i < matches.length; i++) {
            this.unlockIf(this.counters[name] >= matches[i].goal, matches[i].id);
        }
    }

    recordGameEnd(gameKey) {
        this.increase('games', 1);
        this.increase('end-' + gameKey, 1);
        const hour = new Date().getHours();
        this.unlockIf(hour >= 0 && hour < 4, 'night-owl');
        this.unlockIf(this.hasPlayedAllGames(), 'all-games');
        this.unlockIf(this.isHoliday(), 'hidden-holiday');
    }

    isHoliday() {
        const dayKey = getDateKey(new Date()).slice(5);
        return dayKey === '12-24' || dayKey === '12-31' || dayKey === '01-01';
    }

    checkLevel(level) {
        this.unlockIf(level >= 5, 'level-5');
        this.unlockIf(level >= 10, 'level-10');
        this.unlockIf(level >= 20, 'level-20');
        this.unlockIf(level >= 30, 'level-30');
    }

    hasPlayedAllGames() {
        for (let i = 0; i < ACHIEVEMENT_GAME_KEYS.length; i++) {
            if (!this.counters['end-' + ACHIEVEMENT_GAME_KEYS[i]]) {
                return false;
            }
        }
        return true;
    }
}
