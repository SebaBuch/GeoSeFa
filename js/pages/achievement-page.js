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
    const favoritesHtml = buildFavoritesHtml(getFavorites(), achievementService.unlocked);
    showContent(achievementsPageTemplate(unlockedCount, ACHIEVEMENTS.length, favoritesHtml, buildAchievementCategories(achievementService.unlocked, true)));
}

function getFavorites() {
    return storageService.load('favorite-achievements', {});
}

function toggleFavorite(id) {
    const favorites = getFavorites();
    if (favorites[id]) {
        delete favorites[id];
    } else if (Object.keys(favorites).length < FAVORITE_COUNT && achievementService.isUnlocked(id)) {
        favorites[id] = true;
    }
    storageService.save('favorite-achievements', favorites);
    const scrollPosition = window.scrollY;
    showAchievements();
    window.scrollTo(0, scrollPosition);
}

function buildFavoritesHtml(favorites, unlockedMap) {
    const shown = ACHIEVEMENTS.filter(achievement => favorites[achievement.id] && unlockedMap[achievement.id] !== undefined);
    let html = '';
    for (let i = 0; i < shown.length; i++) {
        html += achievementItemTemplate(shown[i], 'unlocked achievement-' + shown[i].tier, 'Lieblingserfolg', '');
    }
    return html === '' ? '' : favoritesTemplate(html);
}

function buildFavoriteButton(achievement, isUnlocked, isOwn) {
    if (!isOwn || !isUnlocked) {
        return '';
    }
    const isFavorite = getFavorites()[achievement.id] === true;
    return favoriteButtonTemplate(achievement.id, isFavorite ? 'active' : '', isFavorite ? '★' : '☆');
}

function buildAchievementCategories(unlockedMap, isOwn) {
    let html = '';
    for (let i = 0; i < ACHIEVEMENT_CATEGORIES.length; i++) {
        const category = ACHIEVEMENT_CATEGORIES[i];
        const items = ACHIEVEMENTS.filter(achievement => achievement.category === category);
        const unlocked = items.filter(achievement => unlockedMap[achievement.id] !== undefined);
        html += achievementCategoryTemplate(category, unlocked.length, items.length, buildAchievementItems(items, unlockedMap, isOwn));
    }
    return html;
}

function buildAchievementItems(items, unlockedMap, isOwn) {
    let html = '';
    for (let i = 0; i < items.length; i++) {
        const isUnlocked = unlockedMap[items[i].id] !== undefined;
        const className = isUnlocked ? 'unlocked achievement-' + items[i].tier : 'locked';
        const lockedText = isOwn ? getProgressText(items[i]) : (items[i].hidden ? 'Versteckt' : 'Gesperrt');
        const statusText = isUnlocked ? 'Seit ' + formatDateGerman(unlockedMap[items[i].id]) : lockedText;
        html += achievementItemTemplate(getShownAchievement(items[i], isUnlocked), className, statusText, buildFavoriteButton(items[i], isUnlocked, isOwn));
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
    if (achievement.id === 'all-done') {
        return 'Fortschritt: ' + achievementService.getUnlockedCount() + ' / ' + (ACHIEVEMENTS.length - 1);
    }
    if (!achievement.counter) {
        return 'Gesperrt';
    }
    const current = Math.min(achievementService.getCounter(achievement.counter), achievement.goal);
    return 'Fortschritt: ' + current + ' / ' + achievement.goal;
}
