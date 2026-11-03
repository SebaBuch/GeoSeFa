class SoundService {
    constructor() {
        this.sounds = {
            win: new Audio('sounds/hsv-torhymne.mp3'),
            wrong: new Audio('sounds/laughing.mp3'),
            low: new Audio('sounds/what-meme.mp3')
        };
        this.volume = 0.1;
        this.winSeconds = 9;
        this.stopTimeoutId = null;
        this.fadeIntervalId = null;
    }

    async play(name) {
        this.stop();
        const sound = this.sounds[name];
        sound.currentTime = 0;
        sound.volume = this.volume;
        try {
            await sound.play();
            return true;
        } catch (error) {
            console.warn('Sound konnte nicht abgespielt werden:', error);
            return false;
        }
    }

    async playWinSound() {
        const started = await this.play('win');
        if (started) {
            this.stopTimeoutId = setTimeout(() => this.fadeOut(), (this.winSeconds - 1) * 1000);
        }
    }

    playWrongSound() {
        this.play('wrong');
    }

    playLowScoreSound() {
        this.play('low');
    }

    fadeOut() {
        this.fadeIntervalId = setInterval(() => this.lowerVolume(), 100);
    }

    lowerVolume() {
        const newVolume = this.sounds.win.volume - this.volume / 10;
        if (newVolume <= 0) {
            this.stop();
        } else {
            this.sounds.win.volume = newVolume;
        }
    }

    stop() {
        clearTimeout(this.stopTimeoutId);
        clearInterval(this.fadeIntervalId);
        const names = Object.keys(this.sounds);
        for (let i = 0; i < names.length; i++) {
            this.sounds[names[i]].pause();
        }
        this.sounds.win.volume = this.volume;
    }
}
