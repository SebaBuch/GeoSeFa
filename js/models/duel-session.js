class DuelSession {
    constructor(match, service) {
        this.match = match;
        this.service = service;
        this.intervalId = null;
        this.isFinished = false;
        this.isBusy = false;
    }

    start() {
        this.startTime = Date.now();
        this.tick();
        this.intervalId = setInterval(() => this.tick(), 2000);
    }

    async tick() {
        if (this.isBusy) {
            return;
        }
        this.isBusy = true;
        await this.sendScore();
        const match = await this.service.getMatch(this.match.id);
        this.isBusy = false;
        if (match) {
            this.match = match;
            this.handleUpdate();
        }
    }

    async sendScore() {
        if (!this.isFinished && currentGame && currentGame.duel === this) {
            await this.service.updateScore(this.match.id, currentGame.getDuelScore(), false);
        }
    }

    handleUpdate() {
        const outcome = this.service.getOutcome(this.match);
        renderDuelPanel(this.match, outcome);
        if (outcome !== '') {
            clearInterval(this.intervalId);
            rewardDuel(this.match, outcome);
        }
    }

    stopPolling() {
        clearInterval(this.intervalId);
    }

    async finish(score) {
        this.isFinished = true;
        const seconds = Math.round((Date.now() - this.startTime) / 100) / 10;
        await this.service.updateScore(this.match.id, score, true, seconds);
        this.tick();
    }
}
