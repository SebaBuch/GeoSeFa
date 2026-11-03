class StorageService {
    constructor() {
        this.prefix = 'geosefa-';
    }

    load(key, fallback) {
        try {
            const text = localStorage.getItem(this.prefix + key);
            return text ? JSON.parse(text) : fallback;
        } catch (error) {
            console.error('Laden fehlgeschlagen:', error);
            return fallback;
        }
    }

    save(key, value) {
        try {
            localStorage.setItem(this.prefix + key, JSON.stringify(value));
        } catch (error) {
            console.error('Speichern fehlgeschlagen:', error);
        }
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
}
