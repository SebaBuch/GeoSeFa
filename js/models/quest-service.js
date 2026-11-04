class QuestService {
    constructor(storage, profiles) {
        this.storage = storage;
        this.profiles = profiles;
    }

    getWeekKey() {
        const today = new Date();
        const daysSinceMonday = (today.getDay() + 6) % 7;
        return addDaysToKey(getDateKey(today), -daysSinceMonday);
    }

    getDaysLeft() {
        return 7 - (new Date().getDay() + 6) % 7;
    }

    getQuests() {
        const random = new SeededRandom('week-' + this.getWeekKey());
        const shuffled = random.shuffle(QUEST_POOL);
        return shuffled.slice(0, WEEKLY_QUEST_COUNT);
    }

    getState() {
        return this.storage.load('weekly-' + this.getWeekKey(), { progress: {}, done: [], bonus: false });
    }

    saveState(state) {
        this.storage.save('weekly-' + this.getWeekKey(), state);
    }

    track(counterName, amount) {
        if (!this.profiles.hasProfile() || amount <= 0) {
            return;
        }
        const quests = this.getQuests().filter(quest => quest.counter === counterName);
        for (let i = 0; i < quests.length; i++) {
            this.addProgress(quests[i], amount);
        }
    }

    addProgress(quest, amount) {
        const state = this.getState();
        if (state.done.includes(quest.id)) {
            return;
        }
        state.progress[quest.id] = (state.progress[quest.id] || 0) + amount;
        const isDone = state.progress[quest.id] >= quest.goal;
        state.done = isDone ? [...state.done, quest.id] : state.done;
        this.saveState(state);
        if (isDone) {
            this.rewardQuest(quest);
        }
    }

    rewardQuest(quest) {
        const toastId = createToastId();
        showToast(toastId, questToastTemplate(toastId, quest.text, quest.reward));
        this.profiles.addCoins(quest.reward);
        this.checkBonus();
    }

    checkBonus() {
        const state = this.getState();
        if (state.bonus || state.done.length < WEEKLY_QUEST_COUNT) {
            return;
        }
        state.bonus = true;
        this.saveState(state);
        const toastId = createToastId();
        showToast(toastId, questToastTemplate(toastId, 'Alle Wochenaufgaben geschafft!', WEEKLY_BONUS_COINS));
        this.profiles.addCoins(WEEKLY_BONUS_COINS);
    }
}
