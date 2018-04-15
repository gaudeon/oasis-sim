import AllTextStyles from './all-text-styles';
import TextPart from './text-part';

// A group of text parts (parsed from a line of parts) displayed on one 'line' of the display
export default class TextLine extends Phaser.GameObjects.Container {
    constructor (scene, x = 0, y = 0, text = '', startingTextStyle) {
        super(scene);

        this.x = x;
        this.y = y;
        this.text = text;

        this._styles = new AllTextStyles();

        this._startingTextStyle = startingTextStyle || this._styles.styleMap['default']; // useful for a text buffer to maintain a text style across lines
        this._lastTextStyle; // last text style used

        this._isInitialized = false;
        this._isPrinting = false;

        this._textPartQueue = this._textPartArchive = this._parseText(this.text);
    }

    _parseText (text) {
        let colorChanges = text.match(this._styles.textStyleTagRegExp);

        let textByColor = text.split(this._styles.textStyleTagRegExp);

        let lineParts = [];
        for (let i = 0; i < textByColor.length; i++) { // add each part of the line and it's style
            let textStyle;
            if (i === 0 || colorChanges.length <= i - 1) {
                textStyle = this._lastTextStyle || this._startingTextStyle;
            } else {
                textStyle = this._styles.tagToTextStyle(colorChanges[i - 1]);
            }

            this._lastTextStyle = textStyle;

            lineParts.push({
                text: textByColor[i],
                style: this._lastTextStyle
            });
        }

        return lineParts;
    }

    get children () { return this.getAll(); }

    get lineHeight () {
        if (this._lineHeight) {
            return this._lineHeight;
        }

        this._lineHeight = _.reduce(this._textPartArchive, (max, part) => {
            let pt = new Phaser.GameObjects.Text(this.scene, 0, 0, '|MÉq', part.style.toPhaserTextStyle());
            return max > pt.height ? max : pt.height;
        }, 0);

        return this._lineHeight;
    }

    get isPrinting () { return this._isPrinting; }

    _printNextPart () {
        let part = this._textPartQueue.shift();

        let x = 0;

        if (this.children.length > 0) {
            x += this.children[this.children.length - 1].x + this.children[this.children.length - 1].width;
        }

        let textPart = new TextPart(this.scene, x, 0, part.text, part.style);

        textPart.once('DonePrinting', () => {
            if (this._textPartQueue.length == 0) {
                this._isPrinting = false;

                this.emit('DonePrinting', this._lastTextStyle, this);
            } else {
                this._printNextPart();
            }
        });

        this.add(textPart);
    }

    update (time, delta) {
        if (this._isInitialized == false) {
            this._isPrinting = this._isInitialized = true;

            this.emit('StartPrinting', this);

            this._printNextPart();
        }

        this.children.forEach(child => {
            if (child.update) {
                child.update(time, delta);
            }
        });
    }
}
