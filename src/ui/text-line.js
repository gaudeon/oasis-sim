export default class TextLine extends Phaser.Text {
    constructor (game, x = 0, y = 0, text = '', style = {}) {
        super(game, x, y, '', style);

        this._animSpeed = style.animSpeed || 100;
        this._animSize = 0;
        this._animText = text;

        this.events.onTextAnimationComplete = new Phaser.Signal();

        this.game.time.events.repeat(Phaser.Timer.SECOND / this._animSpeed, text.length, this.animateText, this);
    }

    animateText () {
        this._animSize++;
        this.text = this._animText.substr(0, this._animSize);

        if (this._animText.length === this.text.length) {
            this.events.onTextAnimationComplete.dispatch();
        }
    }
}
