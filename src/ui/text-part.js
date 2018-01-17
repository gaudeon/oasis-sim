import TextStyle from './text-style';

// A portion of text displayed with a particular style
export default class TextPart extends Phaser.Text {
    constructor (game, x = 0, y = 0, text = '', style = {}) {
        super(game, x, y, '', (style instanceof TextStyle) ? style.toPhaserTextStyle() : style);

        this._printSpeed = 15;
        this._printedCount = 0;
        this._printText = text;
        this._elapsedMS = 0;
        this._isInitialized = false;
        this._isPrinting = false;

        this.events = this.events || new Phaser.Events();
        this.events.onStartPrinting = new Phaser.Signal();
        this.events.onDonePrinting = new Phaser.Signal();
    }

    get isPrinting () { return this._isPrinting; }

    update () {
        if (this._isInitialized == false) {
            this._isPrinting = this._isInitialized = true;

            this.events.onStartPrinting.dispatch();
        }
        else if (this._isPrinting) {
            this._elapsedMS += this.game.time.elapsedMS;

            if (this._elapsedMS > this._printSpeed) {
                this._printedCount++;
                this.text = this._printText.substr(0, this._printedCount);

                this._elapsedMS = 0;

                if (this.text.length >= this._printText.length) {
                    this._isPrinting = false;

                    this.events.onDonePrinting.dispatch();
                }
            }
        }

        super.update();
    }
}
