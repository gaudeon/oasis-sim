import TextStyle from './text-style';

// A portion of text displayed with a particular style
export default class TextPart extends Phaser.GameObjects.Text {
    constructor (scene, x = 0, y = 0, text = '', style = {}) {
        super(scene, x, y, '', (style instanceof TextStyle) ? style.toPhaserTextStyle() : style);

        this._printSpeed = 15;
        this._printedCount = 0;
        this._printText = text;
        this._elapsedMS = 0;
        this._isInitialized = false;
        this._isPrinting = false;
    }

    get isPrinting () { return this._isPrinting; }

    update (time, delta) {
        if (this._isInitialized == false) {
            this._isPrinting = this._isInitialized = true;

            this.emit('StartPrinting', this);
        }
        else if (this._isPrinting) {
            this._elapsedMS += delta;

            if (this._elapsedMS > this._printSpeed) {
                this._printedCount++;
                this.setText(this._printText.substr(0, this._printedCount));

                this._elapsedMS = 0;

                if (this.text.length >= this._printText.length) {
                    this._isPrinting = false;

                    this.emit('DonePrinting', this);
                }
            }
        }
    }
}
