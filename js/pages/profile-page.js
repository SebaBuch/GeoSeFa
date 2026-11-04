let selectedStartAvatar = 'skin-1';

function buildStartAvatarOptions() {
    const skins = SHOP_ITEMS.filter(item => item.slot === 'skin' && item.price === 0);
    let html = '';
    for (let i = 0; i < skins.length; i++) {
        const selectedClass = skins[i].id === selectedStartAvatar ? 'selected' : '';
        const outfit = { ...DEFAULT_OUTFIT, skin: skins[i].id };
        html += startAvatarTemplate(skins[i], bodyTemplate(buildAvatarSvg(outfit, true), 'body-small'), selectedClass);
    }
    return html;
}

function selectStartAvatar(skinId) {
    selectedStartAvatar = skinId;
    document.getElementById('start-avatars').innerHTML = buildStartAvatarOptions();
}

function changeProfileData() {
    achievementService = new AchievementService(storageService, profileService);
    startInviteWatcher();
    nameService.claim(profileService.getCurrent().name);
    lastQuizSettings = null;
    showHome();
}

function showProfile() {
    if (!profileService.hasProfile()) {
        return;
    }
    stopCurrentGame();
    setTheme('home');
    const accountHtml = accountTemplate(authService.session.email);
    const cardHtml = buildProfileCard() + buildFavoritesHtml(getFavorites(), achievementService.unlocked);
    showContent(profilePageTemplate(cardHtml, buildOptionSections(), accountHtml, settingsTemplate(soundService.settings.percent)));
}

function buildProfileCard() {
    const profile = profileService.getCurrent();
    const info = profileService.getLevelInfo(profile.xp);
    const isMax = info.level >= MAX_LEVEL;
    const percent = isMax ? 100 : Math.round(info.current / info.needed * 100);
    const xpText = isMax ? 'Maximales Level erreicht · ' + profile.xp + ' XP' : info.current + ' / ' + info.needed + ' XP bis Level ' + (info.level + 1);
    const bestStreak = profileService.getBestStreak();
    const rankIndex = profileService.getRankIndex(bestStreak);
    const avatarHtml = bodyTemplate(buildAvatarSvg(profile.outfit, true), 'body-profile');
    return profileCardTemplate(profile, avatarHtml, RANKS[rankIndex].title, getRankText(rankIndex, bestStreak), info.level, percent, xpText);
}

function getRankText(rankIndex, bestStreak) {
    const bestText = 'Beste Tages-Serie: ' + formatDays(bestStreak);
    if (rankIndex === RANKS.length - 1) {
        return bestText + ' · Höchster Rang erreicht';
    }
    const nextRank = RANKS[rankIndex + 1];
    return bestText + ' · Nächster Rang: ' + nextRank.title + ' ab ' + formatDays(nextRank.days);
}

function buildOptionSections() {
    let html = '';
    for (let i = 0; i < PROFILE_OPTION_TYPES.length; i++) {
        const type = PROFILE_OPTION_TYPES[i];
        const options = PROFILE_OPTIONS.filter(option => option.type === type.key);
        html += profileSectionTemplate(type.title, buildOptionButtons(options));
    }
    return html;
}

function buildOptionButtons(options) {
    const profile = profileService.getCurrent();
    let html = '';
    for (let i = 0; i < options.length; i++) {
        const preview = buildOptionPreview(options[i], profile);
        const selectedClass = profile[options[i].type] === options[i].value ? 'selected' : '';
        const isUnlocked = profileService.isOptionUnlocked(options[i]);
        html += isUnlocked ? profileOptionTemplate(options[i], preview, selectedClass) : profileOptionLockedTemplate(options[i], preview, getOptionLockText(options[i]));
    }
    return html;
}

function getOptionLockText(option) {
    return option.achievement ? 'Alle Erfolge' : 'ab Level ' + option.level;
}

function buildOptionPreview(option, profile) {
    if (option.type === 'frame') {
        return buildProfileAvatar(profile, option.value, 'avatar-medium');
    }
    return option.type === 'theme' ? themePreviewTemplate(option.value) : '';
}

function chooseProfileOption(type, value) {
    profileService.chooseOption(type, value);
    updateHeader();
    showProfile();
}

function showLeaderboard() {
    if (!profileService.hasProfile()) {
        return;
    }
    stopCurrentGame();
    setTheme('home');
    showContent(leaderboardTemplate(buildTopLists()));
}

function buildTopLists() {
    let html = '';
    for (let i = 0; i < TOP_LISTS.length; i++) {
        const entries = storageService.getTopScores(TOP_LISTS[i].key);
        html += topListTemplate(TOP_LISTS[i].title, buildTopRows(entries, TOP_LISTS[i].unit));
    }
    return html;
}

function buildTopRows(entries, unit) {
    if (entries.length === 0) {
        return topEmptyTemplate();
    }
    let html = '';
    for (let i = 0; i < entries.length; i++) {
        html += topRowTemplate(i + 1, entries[i].score + ' ' + unit, entries[i].detail, formatDateGerman(entries[i].date));
    }
    return html;
}

