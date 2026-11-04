const DAILY_TASKS = [
    { key: 'geodle', title: 'Tages-Geodle', description: 'Errate das Land des Tages. Weniger Versuche = mehr Punkte.', theme: 'geodle' },
    { key: 'route', title: 'Tages-Route', description: 'Finde den kürzesten Landweg des Tages.', theme: 'georoute' },
    { key: 'blitz', title: 'Tages-Blitz', description: '60 Sekunden Flaggen. Alle bekommen dieselben Fragen.', theme: 'blitz' }
];

class DailyChallenge extends BaseGame {
    constructor() {
        super();
        this.dateKey = getDateKey(new Date());
    }

    start() {
        const results = this.getResults(this.dateKey);
        const total = this.getTotal(results);
        const tasksHtml = this.buildTasksHtml(results);
        this.showScreen(dailyTemplate(formatDateGerman(this.dateKey), tasksHtml, total, formatDays(this.getStreak()), this.buildCalendarHtml()));
    }

    getResults(dateKey) {
        return this.storage.load('daily-' + dateKey, {});
    }

    saveTaskResult(taskKey, score) {
        const results = this.getResults(this.dateKey);
        results[taskKey] = score;
        this.storage.save('daily-' + this.dateKey, results);
        this.profiles.addXp(Math.round(score / 2));
        this.profiles.addCoins(Math.round(score / 10));
        this.checkDailyAchievements(results);
    }

    updateBestStreak() {
        const streak = this.getStreak();
        const best = Math.max(this.storage.load('best-daily-streak', 0), streak);
        this.storage.save('best-daily-streak', best);
        return streak;
    }

    checkDailyAchievements(results) {
        const total = this.getTotal(results);
        const streak = this.updateBestStreak();
        const isComplete = this.countDone(results) === DAILY_TASKS.length;
        this.achievements.unlockIf(isComplete, 'daily-first');
        this.achievements.unlockIf(total >= 250, 'daily-250');
        this.achievements.increase('daily-perfects', total >= 300 ? 1 : 0);
        this.checkDailyStreak(streak);
        if (isComplete) {
            this.rewardCompleteDay(total);
        }
    }

    rewardCompleteDay(total) {
        this.achievements.increase('daily-completed', 1);
        this.achievements.unlockIf(new Date().getHours() < 7, 'hidden-early');
        this.profiles.addCoins(DAILY_COMPLETE_COINS);
        this.storage.saveTopScore('daily', total, '');
    }

    checkDailyStreak(streak) {
        this.achievements.unlockIf(streak >= 7, 'daily-streak-7');
        this.achievements.unlockIf(streak >= 30, 'daily-streak-30');
        this.achievements.unlockIf(streak >= 100, 'daily-streak-100');
    }

    buildTasksHtml(results) {
        let html = '';
        for (let i = 0; i < DAILY_TASKS.length; i++) {
            const task = DAILY_TASKS[i];
            const isDone = results[task.key] !== undefined;
            html += isDone ? dailyTaskDoneTemplate(task, results[task.key]) : dailyTaskOpenTemplate(task);
        }
        return html;
    }

    getTotal(results) {
        let total = 0;
        for (let i = 0; i < DAILY_TASKS.length; i++) {
            const score = results[DAILY_TASKS[i].key];
            total += score !== undefined ? score : 0;
        }
        return total;
    }

    countDone(results) {
        const doneTasks = DAILY_TASKS.filter(task => results[task.key] !== undefined);
        return doneTasks.length;
    }

    startTask(taskKey) {
        const matches = DAILY_TASKS.filter(item => item.key === taskKey);
        const task = matches[0];
        if (this.getResults(this.dateKey)[taskKey] !== undefined) {
            return;
        }
        this.markStarted(taskKey);
        setTheme(task.theme);
        const game = this.createTaskGame(taskKey);
        game.daily = this;
        game.seeded = new SeededRandom(this.dateKey + '-' + taskKey);
        currentGame = game;
        this.launchTask(game, taskKey);
    }

    markStarted(taskKey) {
        const results = this.getResults(this.dateKey);
        results[taskKey] = 0;
        this.storage.save('daily-' + this.dateKey, results);
    }

    createTaskGame(taskKey) {
        if (taskKey === 'geodle') {
            return new Geodle();
        }
        if (taskKey === 'route') {
            return new GeoRoute();
        }
        return new BlitzRound();
    }

    launchTask(game, taskKey) {
        if (taskKey === 'blitz') {
            game.chooseCategory('flags');
        } else {
            game.start();
        }
    }

    hasPlayed(dateKey) {
        return this.countDone(this.getResults(dateKey)) > 0;
    }

    getStreak() {
        let streak = 0;
        const startOffset = this.hasPlayed(this.dateKey) ? 0 : 1;
        for (let i = startOffset; i < 365; i++) {
            if (!this.hasPlayed(addDaysToKey(this.dateKey, -i))) {
                break;
            }
            streak++;
        }
        return streak;
    }

    buildCalendarHtml() {
        let html = '';
        for (let i = 13; i >= 0; i--) {
            const dateKey = addDaysToKey(this.dateKey, -i);
            const results = this.getResults(dateKey);
            const played = this.countDone(results) > 0;
            const totalText = played ? this.getTotal(results) : '–';
            html += dailyDayTemplate(formatDateShort(dateKey), totalText, this.getDayClass(i, played));
        }
        return html;
    }

    getDayClass(daysAgo, played) {
        if (daysAgo === 0) {
            return 'today';
        }
        return played ? 'played' : 'empty';
    }

    buildShareText() {
        const results = this.getResults(this.dateKey);
        let parts = '';
        for (let i = 0; i < DAILY_TASKS.length; i++) {
            const score = results[DAILY_TASKS[i].key];
            parts += DAILY_TASKS[i].title + ': ' + (score !== undefined ? score : '–') + '\n';
        }
        const total = this.getTotal(results);
        return 'GeoSeFa Tages-Challenge ' + formatDateGerman(this.dateKey) + '\n' + parts + 'Gesamt: ' + total + ' / 300';
    }

    async copyResult() {
        const text = this.buildShareText();
        try {
            await navigator.clipboard.writeText(text);
            this.setMessage('Ergebnis kopiert! Jetzt einfach bei WhatsApp einfügen.', 'green');
        } catch (error) {
            this.setMessage('Kopieren hat nicht geklappt.', 'error');
        }
    }
}
