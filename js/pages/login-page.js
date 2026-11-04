let isLoginBusy = false;

function showLogin() {
    stopCurrentGame();
    setTheme('home');
    updateHeader();
    selectedStartAvatar = 'skin-1';
    showContent(loginTemplate(buildStartAvatarOptions(), buildLegacyOptions()));
}

function buildLegacyOptions() {
    const legacy = profileService.getLegacyProfiles();
    if (legacy.length === 0) {
        return '';
    }
    let html = '';
    for (let i = 0; i < legacy.length; i++) {
        const level = profileService.getLevelInfo(legacy[i].xp).level;
        html += selectOptionTemplate(legacy[i].id, legacy[i].name + ' (Level ' + level + ')');
    }
    return legacySelectTemplate(html);
}

function readValue(elementId) {
    const element = document.getElementById(elementId);
    return element ? element.value.trim() : '';
}

function setFormMessage(elementId, text, type) {
    const element = document.getElementById(elementId);
    element.innerHTML = text;
    element.className = 'message ' + type;
}

async function submitLogin(event) {
    event.preventDefault();
    if (isLoginBusy) {
        return;
    }
    isLoginBusy = true;
    setFormMessage('login-message', 'Melde an ...', '');
    const result = await authService.signIn(readValue('login-email'), readValue('login-password'));
    isLoginBusy = false;
    if (result.error) {
        return setFormMessage('login-message', result.error, 'red');
    }
    await finishLogin();
}

async function finishLogin() {
    showContent(loadingTemplate('Lade deinen Spielstand ...'));
    const state = await syncService.startSession();
    if (state === 'empty') {
        const name = escapeHtml(authService.session.email.split('@')[0]);
        profileService.createAccountProfile(authService.getUid(), name, 'skin-1', '');
    }
    if (!profileService.hasProfile()) {
        return showError('Dein Spielstand konnte nicht geladen werden. Prüfe deine Internetverbindung und lade die Seite neu.');
    }
    changeProfileData();
}

async function submitRegister(event) {
    event.preventDefault();
    const name = escapeHtml(readValue('register-name'));
    if (name === '' || isLoginBusy) {
        return setFormMessage('register-message', 'Bitte gib einen Namen ein.', 'red');
    }
    isLoginBusy = true;
    const result = await authService.signUp(readValue('register-email'), readValue('register-password'));
    isLoginBusy = false;
    if (result.error) {
        return setFormMessage('register-message', result.error, 'red');
    }
    await finishRegister(result.uid, name);
}

async function finishRegister(uid, name) {
    const legacyId = readValue('register-legacy');
    showContent(loadingTemplate('Speichere deinen Spielstand ...'));
    profileService.createAccountProfile(uid, name, selectedStartAvatar, legacyId);
    await syncService.upload();
    changeProfileData();
}

async function sendPasswordMail() {
    const email = readValue('login-email');
    if (email === '') {
        return setFormMessage('login-message', 'Gib oben deine E-Mail ein, dann klick nochmal auf „Passwort vergessen“.', 'yellow');
    }
    const result = await authService.sendPasswordReset(email);
    const text = result.ok ? 'Wir haben dir eine E-Mail zum Zurücksetzen geschickt.' : result.error;
    setFormMessage('login-message', text, result.ok ? 'green' : 'red');
}

async function logout() {
    showContent(loadingTemplate('Speichere und melde ab ...'));
    await syncService.upload();
    authService.logout();
    profileService.clearCurrent();
    showLogin();
}
