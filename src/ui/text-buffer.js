import AllTextStyles from './all-text-styles';
import TextLine from './text-line';

export default class TextBuffer extends Phaser.GameObjects.Container {
    constructor (scene, x = 0, y = 0) {
        super(scene);

        this.x = x;
        this.y = this._startY = y;

        this._lineQueue = []; // all lines get added here
        this._isPrinting = false; // used to make sure _addNextTextLine isn't called multiple times

        this._lastTextStyle = this.defaultTextStyle;

        this._styles = new AllTextStyles();
        this._fontSize = this._styles.defaultStyle.fontSize;
    }

    // Public Methods

    addText (text) {
        this._lineQueue = this._lineQueue.concat(this._splitTextIntoLines(text));
    }

    preUpdate (time, delta) {
        if (this._lineQueue.length > 0 && this._isPrinting == false) {
            this._isPrinting = true;

            this.emit('StartPrinting', this);

            this._printNextLine();
        }

        this.children.forEach(child => {
            if (child.update) {
                child.update(time, delta);
            }
        });
    }

    clear () {
        this.removeAll(true);

        this.y = this._startY;
    }

    // Accessors
    get children () { return this.getAll(); }

    get lineCharWidth () { return this.scene.sys.game.config.width / (this._fontSize / 2); }

    get isPrinting () { return this._isPrinting; }

    // Private Methods

    _printNextLine (lastTextStyle) {
        let line = this._lineQueue.shift();

        let x = 0;
        let y = this.children.length > 0 ? this.children[this.children.length - 1].y + this.children[this.children.length - 1].lineHeight : 0;

        let textLine = new TextLine(this.scene, x, y, line, lastTextStyle); // this helps maintain the last text style set from the previous line

        this.y -= textLine.lineHeight; // move buffer up by new lines lineheight

        textLine.once('DonePrinting', lastTextStyle => {
            if (this._lineQueue.length == 0) {
                this._isPrinting = false;

                this.emit('DonePrinting', this);
            } else {
                this._printNextLine(lastTextStyle);
            }
        });

        this.add(textLine);
    }

    _splitTextIntoLines (text) {
        if (typeof text === 'undefined') { // no lines returned if nothing given as a param
            return [];
        }

        let lines = [''];
        text.split(/\n/).forEach((subText, index, splitText) => {
            let words = subText.split(' ');

            words.forEach((word) => {
                let currentLine = lines.length - 1;
                let lineWithoutTags = lines[currentLine].replace(this._styles.textStyleTagRegExp, '');
                let wordWithoutTags = word.replace(this._styles.textStyleTagRegExp, ''); // we don't want to account for tags in the length of text when splitting up lines
                let tmpText = lineWithoutTags + ' ' + wordWithoutTags;

                if (tmpText.length > this.lineCharWidth) {
                    lines.push(word);
                } else {
                    lines[currentLine] = lines[currentLine] + ' ' + word;
                }
            });

            // add another new line if we found newlines and we are not at the last piece of subText
            if (splitText.length > 1 && index < splitText.length - 1) {
                lines.push('');
            }
        });

        return lines;
    }
}
