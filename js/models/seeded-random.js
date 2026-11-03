class SeededRandom {
    constructor(text) {
        this.seed = this.createSeed(text);
    }

    createSeed(text) {
        let seed = 7;
        for (let i = 0; i < text.length; i++) {
            seed = (seed * 31 + text.charCodeAt(i)) % 2147483647;
        }
        return seed > 0 ? seed : 1;
    }

    next() {
        this.seed = (this.seed * 16807) % 2147483647;
        return (this.seed - 1) / 2147483646;
    }

    index(length) {
        return Math.floor(this.next() * length);
    }

    pickText(list) {
        const sorted = [...list];
        sorted.sort();
        return sorted[this.index(sorted.length)];
    }

    pick(list) {
        const codes = list.map(item => item.code);
        const code = this.pickText(codes);
        const matches = list.filter(item => item.code === code);
        return matches[0];
    }

    shuffle(list) {
        const copy = [...list];
        for (let i = copy.length - 1; i > 0; i--) {
            const randomIndex = this.index(i + 1);
            const temp = copy[i];
            copy[i] = copy[randomIndex];
            copy[randomIndex] = temp;
        }
        return copy;
    }

    sortByCode(list) {
        const codes = list.map(item => item.code);
        codes.sort();
        const sorted = [];
        for (let i = 0; i < codes.length; i++) {
            const matches = list.filter(item => item.code === codes[i]);
            sorted.push(matches[0]);
        }
        return sorted;
    }
}
