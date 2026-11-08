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
        const emailName = escapeHtml(authService.session.email.split('@')[0]);
        const name = await nameService.findFreeName(nameService.isAllowed(emailName) ? emailName : 'Spieler');
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
    const result = await registerAccount(name);
    isLoginBusy = false;
    if (result.error) {
        return setFormMessage('register-message', result.error, 'red');
    }
    await finishRegister(result.uid, name);
}

async function registerAccount(name) {
    if (!nameService.isAllowed(name)) {
        return { error: 'Dieser Name ist nicht erlaubt. Bitte wähl einen anderen.' };
    }
    if (!await nameService.isFree(name)) {
        return { error: 'Der Name „' + name + '“ ist schon vergeben.' };
    }
    return await authService.signUp(readValue('register-email'), readValue('register-password'));
}

async function finishRegister(uid, name) {
    const legacyId = readValue('register-legacy');
    showContent(loadingTemplate('Speichere deinen Spielstand ...'));
    profileService.createAccountProfile(uid, name, selectedStartAvatar, legacyId);
    await nameService.claim(name);
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

function showDeleteAccount() {
    document.getElementById('delete-area').innerHTML = deleteAccountTemplate();
}

function hideDeleteAccount() {
    document.getElementById('delete-area').innerHTML = '';
}

async function confirmDeleteAccount(event) {
    event.preventDefault();
    if (isLoginBusy) {
        return;
    }
    isLoginBusy = true;
    setFormMessage('delete-message', 'Lösche Konto ...', '');
    const errorText = await deleteAccountData(readValue('delete-password'));
    isLoginBusy = false;
    if (errorText !== '') {
        return setFormMessage('delete-message', errorText, 'red');
    }
    showLoginWithMessage('Dein Konto wurde gelöscht.');
}

function showLoginWithMessage(text) {
    showLogin();
    setFormMessage('login-message', text, 'green');
}

async function deleteAccountData(password) {
    const uid = authService.getUid();
    const login = await authService.signIn(authService.session.email, password);
    if (login.error) {
        return login.error;
    }
    await nameService.release(profileService.getCurrent().name);
    if (!await syncService.deleteCloudData(uid)) {
        return 'Die Daten konnten nicht gelöscht werden. Bist du online?';
    }
    return await removeAccount(uid);
}

async function removeAccount(uid) {
    const result = await authService.deleteAccount();
    if (result.error) {
        return result.error;
    }
    profileService.removeProfile(uid);
    authService.logout();
    profileService.clearCurrent();
    return '';
}

function showRename() {
    stopCurrentGame();
    setTheme('home');
    showContent(renameTemplate());
}

async function submitRename(event) {
    event.preventDefault();
    if (isLoginBusy) {
        return;
    }
    isLoginBusy = true;
    const name = escapeHtml(readValue('rename-name'));
    const error = await checkNewName(name);
    isLoginBusy = false;
    if (error !== '') {
        return setFormMessage('rename-message', error, 'red');
    }
    await saveNewName(name);
}

async function checkNewName(name) {
    if (name === '') {
        return 'Bitte gib einen Namen ein.';
    }
    if (!nameService.isAllowed(name)) {
        return 'Dieser Name ist nicht erlaubt. Bitte wähl einen anderen.';
    }
    const isFree = await nameService.isFree(name);
    return isFree ? '' : 'Der Name „' + name + '“ ist schon vergeben.';
}

async function saveNewName(name) {
    isLoginBusy = true;
    const oldName = profileService.getCurrent().name;
    setFormMessage('rename-message', 'Speichere ...', '');
    profileService.rename(name);
    await nameService.release(oldName);
    await nameService.claim(name);
    await syncService.publishSummary();
    isLoginBusy = false;
    showHome();
}
