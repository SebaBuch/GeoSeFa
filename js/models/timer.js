class Timer {
    constructor(elementId) {
        this.elementId = elementId;
        this.seconds = 0;
        this.limit = 0;
        this.intervalId = null;
        this.game = null;
    }

    start(limitSeconds, game) {
        this.stop();
        this.seconds = 0;
        this.limit = limitSeconds;
        this.game = game;
        this.render();
        this.intervalId = setInterval(() => this.tick(), 1000);
    }

    tick() {
        this.seconds++;
        this.render();
        if (this.limit > 0 && this.seconds >= this.limit) {
            this.stop();
            this.game.handleTimeUp();
        }
    }

    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    render() {
        const element = document.getElementById(this.elementId);
        if (!element) {
            return;
        }
        const shownSeconds = this.limit > 0 ? this.limit - this.seconds : this.seconds;
        element.innerHTML = formatTime(shownSeconds);
    }
}
