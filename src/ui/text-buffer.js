import colorConfig from '../../assets/json/colors.json';
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
        this._lastTextStyle = this.defaultTextStyle;
        this.y = this.bottomY - this.lineHeight;
        this.events = {
            onStartAddingLines: new Phaser.Signal(),
            onDoneAddingLines: new Phaser.Signal()
        };
    }

    get currentDimension () { return 'earth'; } // earth or oasis

    get defaultTextStyle () {
        return this.convertStyle(fontConfig.textStyles['default'][this.currentDimension]);
    }

    convertStyle (style) {
        style.font = this.convertFontKey(style.font);
        style.fill = this.convertColorWord(style.fill);
        style.stroke = this.convertColorWord(style.stroke);

        return style;
    }

    convertColorWord (color) {
        return colorConfig[color] ? colorConfig[color] : color; // if the color word isn't found just return the arg because it could be a hex color
    }

    convertFontKey (font) {
        return fontConfig.fonts[font] ? fontConfig.fonts[font].familyName : font;
    }

    lineStyle (fontKey, overrideStyle = {}) {
        let lineStyle = {
            fill: this.fillColor,
            font: this.convertFontKey(fontKey),
            fontSize: this.fontSize,
            stroke: this.strokeColor
        };

        _.merge(lineStyle, overrideStyle);

        return lineStyle;
    }

    addText (text, overrideStyle = {}, fontKey = 'rubik') {
        let displayLines = this.splitTextIntoLines(text);

        if (displayLines.length <= 0) { // no lines just just be done
            return;
        }

        let style = this.lineStyle(fontKey, overrideStyle);

        displayLines.forEach((line) => {
            let colorChanges = line.match(this.textStyleRegExp);

            if (colorChanges && colorChanges.length > 0) {
                let textByColor = line.split(this.textStyleRegExp);

                let lineParts = [];
                for (let i = 0; i < textByColor.length; i++) { // add each part of the line and it's style
                    let textStyle;
                    if (i === 0) {
                        textStyle = this._lastTextStyle || this.defaultTextStyle;
                    } else {
                        let styleTag = this.getTextStyleFromTag(colorChanges[i - 1]);
                        let styleByDimension;
                        if (fontConfig.textStyles[styleTag]) {
                            styleByDimension = fontConfig.textStyles[styleTag][this.currentDimension];
                        }
                        textStyle = styleByDimension || this.defaultTextStyle;
                    }

                    this._lastTextStyle = this.convertStyle(textStyle);

                    lineParts.push({
                        text: textByColor[i],
                        style: this._lastTextStyle
                    });
                }

                this._lineQueue.push({
                    lineParts: lineParts
                });
            } else {
                this._lineQueue.push({
                    text: line,
                    style: style
                });
            }
        });

        if (!this._queueProcessing) {
            this._queueProcessing = true;
            this.addNextTextLine();
        }
    }

    addNextTextPart (x, y, text, style, remainingParts, partsGroup) {
        let textLine = new TextLine(this.game, x, y, text, style);

        partsGroup.add(textLine);

        if (remainingParts.length) {
            let part = remainingParts.shift();

            textLine.events.onTextAnimationComplete.addOnce(() => {
                this.addNextTextPart(x + textLine.width, y, part.text, part.style, remainingParts, partsGroup);
            });
        } else {
            if (this._lineQueue.length) {
                this._queueProcessing = true;
                textLine.events.onTextAnimationComplete.addOnce(() => {
                    this.addNextTextLine();
                })
            } else {
                this.events.onDoneAddingLines.dispatch();
                this._queueProcessing = false;
            }
        }
    }

    addNextTextLine () {
        this.events.onStartAddingLines.dispatch();

        this.y -= this.lineHeight;
        let x = this.paddingLeft;
        let y = this.lineHeight + this.children.length * this.lineHeight;
        let queueItem = this._lineQueue.shift();

        if (queueItem.lineParts) {
            this._queueProcessing = true; // queue is processing while it is processing all parts of a line

            let partsList = queueItem.lineParts;
            let part = partsList.shift();
            let partsGroup = new Phaser.Group(this.game);

            this.add(partsGroup);

            this.addNextTextPart(x, y, part.text, part.style, partsList, partsGroup);
        } else {
            let textLine = new TextLine(this.game, x, y, queueItem.text, queueItem.style);

            this.add(textLine);

            if (this._lineQueue.length) {
                this._queueProcessing = true;
                textLine.events.onTextAnimationComplete.addOnce(() => {
                    this.addNextTextLine();
                })
            } else {
                this.events.onDoneAddingLines.dispatch();
                this._queueProcessing = false;
            }
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

    get queueProcessing () { return this._queueProcessing; }

    get textStyleRegExp () {
        if (this._textStyleRegExp) {
            return this._textStyleRegExp;
        }

        let regExp = '\\{\\{\\s*(?:' +
                     Object.keys(fontConfig.textStyles).join('|') +
                     ')\\s*\\}\\}'; // \{\{\s*(?:Color|AnotherColor|Etc)\s*\}\}

        this._textStyleRegExp = new RegExp(regExp, 'g');

        return this._textStyleRegExp;
    }

    getTextStyleFromTag (tag) {
        return tag.replace(/\{\{\s*/, '').replace(/\s*\}\}/, '');
    }

    splitTextIntoLines (text) {
        if (typeof text === 'undefined') { // no lines returned if nothing given as a param
            return [];
        }

        let lines = [''];
        text.split(/\n/).forEach((subText, index, splitText) => {
            let words = subText.split(' ');

            words.forEach((word) => {
                let currentLine = lines.length - 1;
                let lineWithoutTags = lines[currentLine].replace(this.textStyleRegExp, '');
                let wordWithoutTags = word.replace(this.textStyleRegExp, ''); // we don't want to account for tags in the length of text when splitting up lines
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
