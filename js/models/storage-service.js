class StorageService {
    constructor() {
        this.prefix = 'geosefa-';
        this.profilePrefix = '';
    }

    setProfile(profileId) {
        this.profilePrefix = 'profile-' + profileId + '-';
    }

    load(key, fallback) {
        return this.loadGlobal(this.profilePrefix + key, fallback);
    }

    save(key, value) {
        this.saveGlobal(this.profilePrefix + key, value);
    }

    loadGlobal(key, fallback) {
        try {
            const text = localStorage.getItem(this.prefix + key);
            return text ? JSON.parse(text) : fallback;
        } catch (error) {
            console.error('Laden fehlgeschlagen:', error);
            return fallback;
        }
    }

    saveGlobal(key, value) {
        try {
            localStorage.setItem(this.prefix + key, JSON.stringify(value));
        } catch (error) {
            console.error('Speichern fehlgeschlagen:', error);
        }
    }

    migrateOldData(profileId) {
        const keys = Object.keys(localStorage);
        for (let i = 0; i < keys.length; i++) {
            if (this.isOldKey(keys[i])) {
                const newKey = this.prefix + 'profile-' + profileId + '-' + keys[i].slice(this.prefix.length);
                localStorage.setItem(newKey, localStorage.getItem(keys[i]));
                localStorage.removeItem(keys[i]);
            }
        }
    }

    isOldKey(key) {
        if (!key.startsWith(this.prefix)) {
            return false;
        }
        const rest = key.slice(this.prefix.length);
        return !rest.startsWith('profile') && rest !== 'countries' && rest !== 'current-profile';
    }

    getGameStats(gameKey) {
        const emptyStats = { played: 0, won: 0, streak: 0, bestStreak: 0, highscore: 0 };
        return this.load('stats-' + gameKey, emptyStats);
    }

    saveGameResult(gameKey, won, score) {
        const stats = this.getGameStats(gameKey);
        stats.played++;
        stats.won = won ? stats.won + 1 : stats.won;
        stats.streak = won ? stats.streak + 1 : 0;
        if (stats.streak > stats.bestStreak) {
            stats.bestStreak = stats.streak;
        }
        const isRecord = score > stats.highscore;
        stats.highscore = isRecord ? score : stats.highscore;
        this.save('stats-' + gameKey, stats);
        return isRecord;
    }

    getQuizBest(quizKey) {
        const emptyBest = { played: 0, bestPercent: 0, bestTime: 0 };
        return this.load('quiz-' + quizKey, emptyBest);
    }

    saveQuizResult(quizKey, percent, seconds) {
        const best = this.getQuizBest(quizKey);
        const isFirst = best.played === 0;
        const isFaster = percent === best.bestPercent && seconds < best.bestTime;
        const isRecord = isFirst || percent > best.bestPercent || isFaster;
        best.played++;
        if (isRecord) {
            best.bestPercent = percent;
            best.bestTime = seconds;
        }
        this.save('quiz-' + quizKey, best);
        return isRecord;
    }

    getTopScores(listKey) {
        return this.load('top-' + listKey, []);
    }

    saveTopScore(listKey, score, detail) {
        if (score <= 0) {
            return;
        }
        const list = this.getTopScores(listKey);
        let position = list.length;
        for (let i = list.length - 1; i >= 0; i--) {
            position = list[i].score < score ? i : position;
        }
        list.splice(position, 0, { score: score, detail: detail, date: getDateKey(new Date()) });
        this.save('top-' + listKey, list.slice(0, 10));
    }
}
