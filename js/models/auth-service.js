const AUTH_URL = 'https://identitytoolkit.googleapis.com/v1/accounts:';
const TOKEN_URL = 'https://securetoken.googleapis.com/v1/token?key=';

const AUTH_ERRORS = {
    EMAIL_EXISTS: 'Diese E-Mail ist schon registriert. Melde dich an.',
    EMAIL_NOT_FOUND: 'E-Mail oder Passwort ist falsch.',
    INVALID_PASSWORD: 'E-Mail oder Passwort ist falsch.',
    INVALID_LOGIN_CREDENTIALS: 'E-Mail oder Passwort ist falsch.',
    INVALID_EMAIL: 'Die E-Mail-Adresse ist ungültig.',
    WEAK_PASSWORD: 'Das Passwort muss mindestens 6 Zeichen haben.',
    MISSING_PASSWORD: 'Bitte gib ein Passwort ein.',
    TOO_MANY_ATTEMPTS_TRY_LATER: 'Zu viele Versuche. Warte kurz und versuch es nochmal.',
    CREDENTIAL_TOO_OLD_LOGIN_AGAIN: 'Bitte gib dein Passwort nochmal ein.'
};

class AuthService {
    constructor(storage) {
        this.storage = storage;
        this.session = storage.loadGlobal('session', null);
    }

    isConfigured() {
        return !FIREBASE_API_KEY.startsWith('HIER') && !FIREBASE_DB_URL.startsWith('HIER');
    }

    isLoggedIn() {
        return this.session !== null;
    }

    getUid() {
        return this.session ? this.session.uid : '';
    }

    async signUp(email, password) {
        return await this.sendAuthRequest('signUp', email, password);
    }

    async signIn(email, password) {
        return await this.sendAuthRequest('signInWithPassword', email, password);
    }

    async sendAuthRequest(action, email, password) {
        try {
            const body = { email: email, password: password, returnSecureToken: true };
            const response = await fetch(AUTH_URL + action + '?key=' + FIREBASE_API_KEY, this.createJsonOptions(body));
            const data = await response.json();
            return response.ok ? this.startSession(data) : { error: this.translateError(data) };
        } catch (error) {
            console.error('Anmeldung fehlgeschlagen:', error);
            return { error: 'Keine Verbindung zum Server. Bist du online?' };
        }
    }

    startSession(data) {
        this.saveSession(data.localId, data.email, data.idToken, data.refreshToken, data.expiresIn);
        return { uid: data.localId };
    }

    async sendPasswordReset(email) {
        try {
            const body = { requestType: 'PASSWORD_RESET', email: email };
            const response = await fetch(AUTH_URL + 'sendOobCode?key=' + FIREBASE_API_KEY, this.createJsonOptions(body));
            const data = await response.json();
            return response.ok ? { ok: true } : { error: this.translateError(data) };
        } catch (error) {
            console.error('Passwort-Mail fehlgeschlagen:', error);
            return { error: 'Keine Verbindung zum Server. Bist du online?' };
        }
    }

    async deleteAccount() {
        try {
            const body = { idToken: await this.getToken() };
            const response = await fetch(AUTH_URL + 'delete?key=' + FIREBASE_API_KEY, this.createJsonOptions(body));
            const data = await response.json();
            return response.ok ? { ok: true } : { error: this.translateError(data) };
        } catch (error) {
            console.error('Konto konnte nicht gelöscht werden:', error);
            return { error: 'Keine Verbindung zum Server. Bist du online?' };
        }
    }

    createJsonOptions(body) {
        return { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) };
    }

    translateError(data) {
        const code = data.error && data.error.message ? data.error.message : '';
        const key = code.split(' ')[0];
        return AUTH_ERRORS[key] || 'Das hat nicht geklappt (' + code + ').';
    }

    saveSession(uid, email, idToken, refreshToken, expiresIn) {
        const expiresAt = Date.now() + (Number(expiresIn) - 60) * 1000;
        this.session = { uid: uid, email: email, idToken: idToken, refreshToken: refreshToken, expiresAt: expiresAt };
        this.storage.saveGlobal('session', this.session);
    }

    async getToken() {
        if (!this.session) {
            return '';
        }
        if (Date.now() >= this.session.expiresAt) {
            await this.refreshToken();
        }
        return this.session ? this.session.idToken : '';
    }

    async refreshToken() {
        try {
            const options = { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: 'grant_type=refresh_token&refresh_token=' + encodeURIComponent(this.session.refreshToken) };
            const response = await fetch(TOKEN_URL + FIREBASE_API_KEY, options);
            const data = await response.json();
            if (response.ok) {
                this.saveSession(data.user_id, this.session.email, data.id_token, data.refresh_token, data.expires_in);
            } else {
                this.handleRefreshError(data);
            }
        } catch (error) {
            console.error('Token konnte nicht erneuert werden:', error);
        }
    }

    handleRefreshError(data) {
        const code = data.error && data.error.message ? data.error.message : '';
        if (['USER_DISABLED', 'USER_NOT_FOUND', 'INVALID_REFRESH_TOKEN', 'TOKEN_EXPIRED'].includes(code)) {
            this.logout();
            window.location.reload();
        }
    }

    logout() {
        this.session = null;
        this.storage.saveGlobal('session', null);
    }
}
