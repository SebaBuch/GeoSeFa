let selectedStartAvatar = 'skin-1';

function showProfileCreate() {
    stopCurrentGame();
    setTheme('home');
    updateHeader();
    selectedStartAvatar = 'skin-1';
    const cancelHtml = profileService.hasProfile() ? profileCancelTemplate() : '';
    showContent(profileCreateTemplate(buildStartAvatarOptions(), cancelHtml));
}

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

function createProfile(event) {
    event.preventDefault();
    const name = escapeHtml(document.getElementById('profile-name').value.trim());
    if (name === '') {
        document.getElementById('message').innerHTML = 'Bitte gib einen Namen ein.';
        return;
    }
    profileService.createProfile(name, selectedStartAvatar);
    changeProfileData();
    achievementService.unlockIf(profileService.profiles.length >= 2, 'hidden-family');
}

function switchProfile(profileId) {
    profileService.select(profileId);
    changeProfileData();
}

function changeProfileData() {
    achievementService = new AchievementService(storageService, profileService);
    lastQuizSettings = null;
    showHome();
}

function showProfile() {
    if (!profileService.hasProfile()) {
        return;
    }
    stopCurrentGame();
    setTheme('home');
    showContent(profilePageTemplate(buildProfileCard(), buildOptionSections(), buildProfileList(), settingsTemplate(soundService.settings.percent)));
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
        html += isUnlocked ? profileOptionTemplate(options[i], preview, selectedClass) : profileOptionLockedTemplate(options[i], preview);
    }
    return html;
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

function buildProfileList() {
    let html = '';
    for (let i = 0; i < profileService.profiles.length; i++) {
        const profile = profileService.profiles[i];
        const avatarHtml = buildProfileAvatar(profile, profile.frame, 'avatar-small');
        const level = profileService.getLevelInfo(profile.xp).level;
        const isCurrent = profile.id === profileService.currentId;
        html += isCurrent ? profileListCurrentTemplate(profile, avatarHtml, level) : profileListItemTemplate(profile, avatarHtml, level);
    }
    return html + profileNewButtonTemplate();
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

function exportProfile() {
    const backup = profileService.createBackup();
    const blob = new Blob([JSON.stringify(backup)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'GeoSeFa-' + backup.profile.name + '-' + getDateKey(new Date()) + '.json';
    link.click();
    URL.revokeObjectURL(link.href);
    setSettingsMessage('Sicherung wurde heruntergeladen.', 'green');
}

async function importProfile(input) {
    if (input.files.length > 0) {
        await readBackupFile(input.files[0]);
    }
}

async function readBackupFile(file) {
    try {
        const backup = JSON.parse(await file.text());
        if (!profileService.importBackup(backup)) {
            return setSettingsMessage('Das ist keine GeoSeFa-Sicherung.', 'red');
        }
        changeProfileData();
    } catch (error) {
        console.error('Import fehlgeschlagen:', error);
        setSettingsMessage('Die Datei konnte nicht gelesen werden.', 'red');
    }
}

function setSettingsMessage(text, type) {
    const element = document.getElementById('settings-message');
    if (element) {
        element.innerHTML = text;
        element.className = 'message ' + type;
    }
}

function showCompare() {
    if (!profileService.hasProfile()) {
        return;
    }
    stopCurrentGame();
    setTheme('home');
    const profiles = profileService.profiles;
    let headHtml = '';
    for (let i = 0; i < profiles.length; i++) {
        headHtml += compareHeadTemplate(profiles[i], buildProfileAvatar(profiles[i], profiles[i].frame, 'avatar-medium'));
    }
    showContent(compareTemplate(headHtml, buildCompareRows(profiles), profiles.length > 1 ? '' : compareHintTemplate()));
}

function buildCompareRows(profiles) {
    let html = '';
    for (let i = 0; i < COMPARE_ROWS.length; i++) {
        const values = profiles.map(profile => getCompareValue(profile, COMPARE_ROWS[i]));
        const best = Math.max(...values);
        let cellsHtml = '';
        for (let j = 0; j < values.length; j++) {
            cellsHtml += compareCellTemplate(formatNumber(values[j]), values[j] === best && best > 0 ? 'best' : '');
        }
        html += compareRowTemplate(COMPARE_ROWS[i].label, cellsHtml);
    }
    return html;
}

function getCompareValue(profile, row) {
    if (row.source === 'level') {
        return profileService.getLevelInfo(profile.xp).level;
    }
    if (row.source === 'profile') {
        return profile[row.key] || 0;
    }
    if (row.source === 'achievements') {
        return Object.keys(storageService.loadForProfile(profile.id, 'achievements', {})).length;
    }
    return getStoredCompareValue(profile, row);
}

function getStoredCompareValue(profile, row) {
    if (row.source === 'storage') {
        return storageService.loadForProfile(profile.id, row.key, 0);
    }
    if (row.source === 'counter') {
        return storageService.loadForProfile(profile.id, 'achievement-counters', {})[row.key] || 0;
    }
    return storageService.loadForProfile(profile.id, 'stats-' + row.key, {})[row.field] || 0;
}
