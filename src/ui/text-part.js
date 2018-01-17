import TextStyle from './text-style';

// A portion of text displayed with a particular style
export default class TextPart extends Phaser.Text {
    constructor (game, x = 0, y = 0, text = '', style = {}) {
        super(game, x, y, '', (style instanceof TextStyle) ? style.toPhaserTextStyle() : style);

        this._animSpeed = style.animSpeed || 100;
        this._animSize = 0;
        this._animText = text;
        this._animTime = 0;
        this._animating = true;

        this.events.onTextAnimationComplete = new Phaser.Signal();

        this.game.time.events.repeat(Phaser.Timer.SECOND / this._animSpeed, text.length, this.animateText, this);
    }

    update () {
        if (this._animating == true) {
            this._animTime += this.game.time.elapsedMS;

            if (this._animTime > this._animSpeed) {
                this._animTime = 0;
            }
        }
    }

    animateText () {
        this._animSize++;
        this.text = this._animText.substr(0, this._animSize);

        if (this._animText.length === this.text.length) {
            this._animating = false;
            this.events.onTextAnimationComplete.dispatch();
        }
    }
}
