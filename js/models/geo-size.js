class GeoSize extends BaseGame {
    constructor() {
        super();
        this.totalRounds = 10;
        this.boxSize = 260;
    }

    start() {
        this.round = 0;
        this.score = 0;
        this.finished = false;
        this.nextRound();
    }

    nextRound() {
        this.round++;
        this.checked = false;
        this.createPair();
        const leftSvg = this.shapes.getOutlineSvg(this.left.code, 'shape-left');
        const rightSvg = this.shapes.getOutlineSvg(this.right.code, 'shape-right');
        this.showScreen(geoSizeTemplate(this.left, this.right, leftSvg, rightSvg, this.round, this.totalRounds, this.score));
        this.updateSlider(50);
    }

    createPair() {
        const pool = this.getPlayableCountries().filter(country => country.area >= 1000);
        for (let attempt = 0; attempt < 200; attempt++) {
            const first = randomItem(pool);
            const second = randomItem(pool);
            const ratio = Math.max(first.area, second.area) / Math.min(first.area, second.area);
            if (first.code !== second.code && ratio <= 12) {
                this.left = first;
                this.right = second;
                return;
            }
        }
    }

    updateSlider(value) {
        if (this.checked) {
            return;
        }
        this.sliderValue = Number(value);
        document.getElementById('size-slider').value = this.sliderValue;
        document.getElementById('share-left').innerHTML = (100 - this.sliderValue) + ' %';
        document.getElementById('share-right').innerHTML = this.sliderValue + ' %';
        this.resizeShapes(this.sliderValue);
    }

    resizeShapes(rightShare) {
        const leftOutline = this.shapes.getOutline(this.left.code);
        const rightOutline = this.shapes.getOutline(this.right.code);
        const pixelsPerPercent = this.getPixelsPerPercent(leftOutline, rightOutline);
        const leftScale = Math.sqrt(pixelsPerPercent * (100 - rightShare) / leftOutline.area);
        const rightScale = Math.sqrt(pixelsPerPercent * rightShare / rightOutline.area);
        this.setShapeSize('shape-left', leftOutline, leftScale);
        this.setShapeSize('shape-right', rightOutline, rightScale);
    }

    getPixelsPerPercent(leftOutline, rightOutline) {
        this.boxSize = document.getElementById('size-box-left').clientWidth - 20;
        const leftMaxArea = leftOutline.area * Math.pow(this.getFitFactor(leftOutline, 1), 2);
        const rightMaxArea = rightOutline.area * Math.pow(this.getFitFactor(rightOutline, 1), 2);
        return Math.min(leftMaxArea, rightMaxArea) / 100;
    }

    getFitFactor(outline, scale) {
        const width = (outline.bounds.maxX - outline.bounds.minX) * scale;
        const height = (outline.bounds.maxY - outline.bounds.minY) * scale;
        return Math.min(this.boxSize / width, this.boxSize / height);
    }

    setShapeSize(elementId, outline, scale) {
        const element = document.getElementById(elementId);
        element.style.width = ((outline.bounds.maxX - outline.bounds.minX) * scale) + 'px';
        element.style.height = ((outline.bounds.maxY - outline.bounds.minY) * scale) + 'px';
    }

    check() {
        if (this.checked) {
            return;
        }
        this.checked = true;
        const realShare = this.right.area / (this.left.area + this.right.area) * 100;
        const difference = Math.abs(this.sliderValue - realShare);
        const points = Math.max(0, Math.round(100 - difference * 4));
        this.score += points;
        const guess = this.sliderValue;
        this.showRealShare(realShare);
        this.showRoundResult(realShare, points, guess);
    }

    showRealShare(realShare) {
        const rounded = Math.round(realShare);
        const slider = document.getElementById('size-slider');
        slider.value = rounded;
        slider.disabled = true;
        document.getElementById('share-left').innerHTML = (100 - rounded) + ' %';
        document.getElementById('share-right').innerHTML = rounded + ' %';
        document.getElementById('shape-left').classList.add('reveal');
        document.getElementById('shape-right').classList.add('reveal');
        this.resizeShapes(realShare);
    }

    showRoundResult(realShare, points, guess) {
        const leftText = this.left.name + ' ' + Math.round(100 - realShare) + ' % (' + formatNumber(this.left.area) + ' km²)';
        const rightText = this.right.name + ' ' + Math.round(realShare) + ' % (' + formatNumber(this.right.area) + ' km²)';
        const isLastRound = this.round >= this.totalRounds;
        const action = isLastRound ? 'finish' : 'nextRound';
        const label = isLastRound ? 'Ergebnis anzeigen' : 'Nächste Runde';
        const guessText = (100 - guess) + ' % | ' + guess + ' %';
        document.getElementById('size-result').innerHTML = geoSizeResultTemplate(guessText, leftText, rightText, points, action, label);
    }

    finish() {
        this.finished = true;
        const isRecord = this.storage.saveGameResult('geosize', true, this.score);
        this.playEndSound(isRecord, this.score < 400);
        const stats = this.storage.getGameStats('geosize');
        this.showScreen(scoreEndTemplate('GeoSize', this.score, this.totalRounds * 100, stats.highscore, this.getRecordText(isRecord), 'geosize'));
    }
}
