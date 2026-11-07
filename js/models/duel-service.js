class DuelService {
    constructor(cloud, auth, profiles) {
        this.cloud = cloud;
        this.auth = auth;
        this.profiles = profiles;
    }

    createId() {
        return 'm' + Date.now() + Math.floor(Math.random() * 100000);
    }

    async createMatch(opponent, gameKey, mode) {
        const uid = this.auth.getUid();
        const me = this.profiles.getCurrent();
        const players = {};
        players[uid] = { name: me.name, score: 0, finished: false };
        players[opponent.uid] = { name: opponent.name, score: 0, finished: false };
        const match = { game: gameKey, mode: mode, createdBy: uid, createdAt: Date.now(), status: mode === 'live' ? 'invited' : 'running', players: players };
        const id = this.createId();
        const ok = await this.cloud.put('matches/' + id, match);
        const entry = { game: gameKey, mode: mode, fromName: me.name, fromUid: uid, toName: opponent.name, createdAt: match.createdAt };
        await this.cloud.put('inbox/' + opponent.uid + '/' + id, entry);
        await this.cloud.put('inbox/' + uid + '/' + id, entry);
        return ok ? { ...match, id: id } : null;
    }

    async getMatch(id) {
        const result = await this.cloud.get('matches/' + id);
        return result.ok && result.data ? { ...result.data, id: id } : null;
    }

    async setStatus(id, status) {
        return await this.cloud.put('matches/' + id + '/status', status);
    }

    async updateScore(id, score, finished, seconds) {
        const data = seconds === undefined ? { score: score, finished: finished } : { score: score, finished: finished, time: seconds };
        return await this.cloud.patch('matches/' + id + '/players/' + this.auth.getUid(), data);
    }

    async loadInbox() {
        const result = await this.cloud.get('inbox/' + this.auth.getUid());
        if (!result.ok || !result.data) {
            return [];
        }
        const ids = Object.keys(result.data);
        const entries = [];
        for (let i = 0; i < ids.length; i++) {
            entries.push({ ...result.data[ids[i]], id: ids[i] });
        }
        const fresh = await this.removeOldEntries(entries);
        const sorted = this.sortNewestFirst(fresh);
        return sorted.slice(0, 20);
    }

    async removeOldEntries(entries) {
        const fresh = [];
        for (let i = 0; i < entries.length; i++) {
            if (Date.now() - entries[i].createdAt > DUEL_KEEP_DAYS * 86400000) {
                await this.cloud.remove('matches/' + entries[i].id);
                await this.cloud.remove('inbox/' + this.auth.getUid() + '/' + entries[i].id);
            } else {
                fresh.push(entries[i]);
            }
        }
        return fresh;
    }

    sortNewestFirst(entries) {
        const sorted = [];
        for (let i = 0; i < entries.length; i++) {
            let position = sorted.length;
            for (let j = sorted.length - 1; j >= 0; j--) {
                position = sorted[j].createdAt < entries[i].createdAt ? j : position;
            }
            sorted.splice(position, 0, entries[i]);
        }
        return sorted;
    }

    async loadMatches(entries) {
        const matches = [];
        for (let i = 0; i < entries.length; i++) {
            const match = await this.getMatch(entries[i].id);
            if (match) {
                matches.push(match);
            }
        }
        return matches;
    }

    getOpponentUid(match) {
        const uids = Object.keys(match.players);
        return uids[0] === this.auth.getUid() ? uids[1] : uids[0];
    }

    isExpired(match) {
        return match.status === 'invited' && Date.now() - match.createdAt > DUEL_INVITE_MINUTES * 60000;
    }

    getOutcome(match) {
        const mine = match.players[this.auth.getUid()];
        const theirs = match.players[this.getOpponentUid(match)];
        if (!mine.finished || !theirs.finished) {
            return '';
        }
        if (mine.score === theirs.score) {
            return this.compareTime(match, mine, theirs);
        }
        return mine.score > theirs.score ? 'win' : 'loss';
    }

    isTimeDecided(match) {
        const mine = match.players[this.auth.getUid()];
        const theirs = match.players[this.getOpponentUid(match)];
        return mine.score === theirs.score && this.compareTime(match, mine, theirs) !== 'draw';
    }

    compareTime(match, mine, theirs) {
        const config = DUEL_GAMES.filter(game => game.key === match.game)[0];
        const hasTimes = mine.time !== undefined && theirs.time !== undefined;
        if ((config && config.timed) || !hasTimes || mine.time === theirs.time) {
            return 'draw';
        }
        return mine.time < theirs.time ? 'win' : 'loss';
    }
}
