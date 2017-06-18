import fontConfig from '../../assets/json/fonts.json';
import TextLine from './text-line';

export default class TextBuffer extends Phaser.Group {
    constructor (game) {
        super(game);

        this._paddingLeft = 20;
        this._fontSize = 20;
        this._fillColor = 'white';
        this._strokeColor = 'white';
        this._lineSpacing = 1.5;
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

    addText (text, fontKey = 'rubik', overrideStyle = {}) {
        let displayLines = this.splitTextIntoLines(text);

        this.addNextTextLine(displayLines, this.lineStyle(fontKey, overrideStyle));
    }

    addNextTextLine (lines, style) {
        this.y -= this.lineHeight;
        let x = this.paddingLeft;
        let y = this.bottomY - this.lineHeight + this.children.length * this.lineHeight;
        let line = lines.shift();

        let textLine = new TextLine(this.game, x, y, line, style);

        if (lines.length) {
            textLine.events.onTextAnimationComplete.add(() => {
                this.addNextTextLine(lines, style);
            })
        }

        this.add(textLine);
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
        let words = text.split(' ');
        let lines = [''];

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
