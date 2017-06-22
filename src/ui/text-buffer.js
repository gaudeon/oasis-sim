import fontConfig from '../../assets/json/fonts.json';
import TextLine from './text-line';

export default class TextBuffer extends Phaser.Group {
    constructor (game) {
        super(game);

        this._lineQueue = []; // all lines get added here
        this._queueProcessing = false; // used to make sure addNextTextLine isn't called multiple times

        this._paddingLeft = 20;
        this._fontSize = 20;
        this._fillColor = 'white';
        this._strokeColor = 'white';
        this._lineSpacing = 1.5;
        this.y = this.bottomY - this.lineHeight;
        this.events = {
            onStartAddingLines: new Phaser.Signal(),
            onDoneAddingLines: new Phaser.Signal()
        };
    }

    lineStyle (fontKey, overrideStyle = {}) {
        let lineStyle = {
            fill: this.fillColor,
            font: fontConfig.fonts[fontKey].familyName,
            fontSize: this.fontSize,
            stroke: this.strokeColor
        };

        _.merge(lineStyle, overrideStyle);

        return lineStyle;
    }

    addText (text, overrideStyle = {}, fontKey = 'rubik') {
        let displayLines = this.splitTextIntoLines(text);
        let style = this.lineStyle(fontKey, overrideStyle);

        displayLines.forEach((line) => {
            this._lineQueue.push({
                line: line,
                style: style
            });
        });

        if (!this._queueProcessing) {
            this._queueProcessing = true;
            this.addNextTextLine();
        }
    }

    addNextTextLine () {
        this.events.onStartAddingLines.dispatch();

        this.y -= this.lineHeight;
        let x = this.paddingLeft;
        let y = this.lineHeight + this.children.length * this.lineHeight;
        let queueItem = this._lineQueue.shift();

        let textLine = new TextLine(this.game, x, y, queueItem.line, queueItem.style);

        this.add(textLine);

        if (this._lineQueue.length) {
            textLine.events.onTextAnimationComplete.add(() => {
                this.addNextTextLine();
            })
        } else {
            this.events.onDoneAddingLines.dispatch();
            this._queueProcessing = false;
        }
    };

    get fontSize () { return this._fontSize; }
    set fontSize (size) { this._fontSize = size; }

    get paddingLeft () { return this._paddingLeft; }
    set paddingLeft (amount) { this._paddingLeft = amount; }

    get fillColor () { return this._fillColor; }
    set fillColor (color) { this._fillColor = color; }

    get strokeColor () { return this._strokeColor; }
    set strokeColor (color) { this._strokeColor = color; }

    get lineSpacing () { return this._lineSpacing; }
    set lineSpacing (spacing) { this._lineSpacing = spacing; }

    get lineHeight () { return this._fontSize * this._lineSpacing; }

    get lineCharWidth () { return this.game.width / (this.fontSize / 2); }

    get bottomY () { return this.game.height - this.lineHeight; }

    splitTextIntoLines (text) {
        text.replace('\n', ''); // no actual newlines

        let lines = [''];
        let words = text.split(' ');

        words.forEach((word) => {
            let currentLine = lines.length - 1;
            let tmpText = lines[currentLine] + ' ' + word;

            if (tmpText.length > this.lineCharWidth) {
                lines.push(word);
            } else {
                lines[currentLine] = lines[currentLine] + ' ' + word;
            }
        });

        return lines;
    }
}
