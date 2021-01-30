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
            // we have lines to print so reset our buffer position, set us to be in printing mode then start printing text
            this.resetBuffer();

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

    get bufferHeight () {
        return _.reduce(this.children, (sum, line) => { return sum + line.lineHeight }, 0);
    }

    shiftBufferUp () {
        // if we are not printing and the buffer isn't yet showing the most recent text and the buffer is bigger than the screen, then we can move it up
        if (!this.isPrinting && this.y > this._startY - this.bufferHeight && this.bufferHeight > this.scene.sys.game.config.height) {
            this.y -= 16;
        }
    }

    shiftBufferDown () {
        // if we are not printing and the buffer isn't yet showing the earliest text and the buffer is bigger than the screen, then we can move it down
        if (!this.isPrinting && this.y < 0 && this.bufferHeight > this.scene.sys.game.config.height) {
            this.y += 16;
        }
    }

    gotoBufferTop () {
        // if we are not printing we can reset the position of the buffer
        if (!this.isPrinting) {
            this.y = 0;
        }
    }

    resetBuffer () {
        // if we are not printing we can reset the position of the buffer
        if (!this.isPrinting && this.bufferHeight > this.scene.sys.game.config.height) {
            this.y = this._startY - this.bufferHeight;
        }
    }

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
