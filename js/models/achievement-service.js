class AchievementService {
    constructor(storage) {
        this.storage = storage;
        this.unlocked = storage.load('achievements', {});
        this.counters = storage.load('achievement-counters', {});
        this.toastNumber = 0;
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
        this.showToast(matches[0]);
        updateAchievementButton();
    }

    unlockIf(condition, id) {
        if (condition) {
            this.unlock(id);
        }
    }

    increase(name, amount) {
        this.counters[name] = (this.counters[name] || 0) + amount;
        this.storage.save('achievement-counters', this.counters);
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
    }

    hasPlayedAllGames() {
        for (let i = 0; i < ACHIEVEMENT_GAME_KEYS.length; i++) {
            if (!this.counters['end-' + ACHIEVEMENT_GAME_KEYS[i]]) {
                return false;
            }
        }
        return true;
    }

    showToast(achievement) {
        this.toastNumber++;
        const toastId = 'toast-' + this.toastNumber;
        document.getElementById('toast-area').innerHTML += achievementToastTemplate(toastId, achievement);
        setTimeout(() => this.removeToast(toastId), 4500);
    }

    removeToast(toastId) {
        const toast = document.getElementById(toastId);
        if (toast) {
            toast.remove();
        }
    }
}
