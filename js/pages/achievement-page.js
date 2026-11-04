function updateAchievementButton() {
    const button = document.getElementById('achievement-button');
    if (button) {
        button.classList.toggle('hidden', !profileService.hasProfile());
        button.innerHTML = 'Erfolge ' + achievementService.getUnlockedCount() + ' / ' + ACHIEVEMENTS.length;
    }
}

function showAchievements() {
    if (!profileService.hasProfile()) {
        return;
    }
    stopCurrentGame();
    setTheme('home');
    const unlockedCount = achievementService.getUnlockedCount();
    showContent(achievementsPageTemplate(unlockedCount, ACHIEVEMENTS.length, buildAchievementCategories()));
}

function buildAchievementCategories() {
    let html = '';
    for (let i = 0; i < ACHIEVEMENT_CATEGORIES.length; i++) {
        const category = ACHIEVEMENT_CATEGORIES[i];
        const items = ACHIEVEMENTS.filter(achievement => achievement.category === category);
        const unlocked = items.filter(achievement => achievementService.isUnlocked(achievement.id));
        html += achievementCategoryTemplate(category, unlocked.length, items.length, buildAchievementItems(items));
    }
    return html;
}

function buildAchievementItems(items) {
    let html = '';
    for (let i = 0; i < items.length; i++) {
        const isUnlocked = achievementService.isUnlocked(items[i].id);
        const className = isUnlocked ? 'unlocked achievement-' + items[i].tier : 'locked';
        const statusText = isUnlocked ? 'Seit ' + formatDateGerman(achievementService.unlocked[items[i].id]) : getProgressText(items[i]);
        html += achievementItemTemplate(getShownAchievement(items[i], isUnlocked), className, statusText);
    }
    return html;
}

function getShownAchievement(achievement, isUnlocked) {
    if (achievement.hidden && !isUnlocked) {
        return { title: '???', description: 'Versteckter Erfolg. Spiel weiter, um ihn zu finden.' };
    }
    return achievement;
}

function getProgressText(achievement) {
    if (achievement.hidden) {
        return 'Versteckt';
    }
    if (!achievement.counter) {
        return 'Gesperrt';
    }
    const current = Math.min(achievementService.getCounter(achievement.counter), achievement.goal);
    return 'Fortschritt: ' + current + ' / ' + achievement.goal;
}
