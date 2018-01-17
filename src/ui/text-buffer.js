import colorConfig from '../../assets/json/colors.json';
import fontConfig from '../../assets/json/fonts.json';
import TextPart from './text-part';

export default class TextBuffer extends Phaser.Group {
    constructor (game) {
        super(game);

        this._lineQueue = []; // all lines get added here
        this._queueProcessing = false; // used to make sure _addNextTextLine isn't called multiple times

        this._paddingLeft = 20;
        this._fontSize = fontConfig.defaultTextStyle.fontSize;
        this._lineSpacing = 1.5;
        this._lastTextStyle = this.defaultTextStyle;

        this.y = this.bottomY - this.lineHeight;

        this.events = {
            onStartAddingLines: new Phaser.Signal(),
            onDoneAddingLines: new Phaser.Signal()
        };
    }

    // Public Methods

    addText (text) {
        let displayLines = this._splitTextIntoLines(text);

        if (displayLines.length <= 0) { // no lines just just be done
            return;
        }

        displayLines.forEach((line) => {
            let colorChanges = line.match(this.textStyleRegExp);

            let textByColor = line.split(this.textStyleRegExp);

            let lineParts = [];
            for (let i = 0; i < textByColor.length; i++) { // add each part of the line and it's style
                let textStyle;
                if (i === 0 || colorChanges.length <= i - 1) {
                    textStyle = this._lastTextStyle || this.defaultTextStyle;
                } else {
                    let styleTag = this._getTextStyleFromTag(colorChanges[i - 1]);
                    let styleByDimension;
                    if (fontConfig.textStyles[styleTag]) {
                        styleByDimension = fontConfig.textStyles[styleTag];
                    }
                    textStyle = styleByDimension || this.defaultTextStyle;
                }

                this._lastTextStyle = this._convertStyle(textStyle);

                lineParts.push({
                    text: textByColor[i],
                    style: this._lastTextStyle
                });
            }

            this._lineQueue.push({
                lineParts: lineParts
            });
        });

        if (!this._queueProcessing) {
            this._queueProcessing = true;
            this._addNextTextLine();
        }
    }

    // Accessors

    get defaultTextStyle () {
        return this._convertStyle(fontConfig.defaultTextStyle);
    }

    get fontSize () { return this._fontSize; }

    get paddingLeft () { return this._paddingLeft; }

    get lineSpacing () { return this._lineSpacing; }

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

    // Private Methods

    _addNextTextPart (x, y, text, style, remainingParts, partsGroup) {
        let textLine = new TextPart(this.game, x, y, text, style);

        partsGroup.add(textLine);

        if (remainingParts.length) {
            let part = remainingParts.shift();

            textLine.events.onTextAnimationComplete.addOnce(() => {
                this._addNextTextPart(x + textLine.width, y, part.text, part.style, remainingParts, partsGroup);
            });
        } else {
            if (this._lineQueue.length) {
                this._queueProcessing = true;
                textLine.events.onTextAnimationComplete.addOnce(() => {
                    this._addNextTextLine();
                })
            } else {
                this.events.onDoneAddingLines.dispatch();
                this._queueProcessing = false;
            }
        }
    }

    _addNextTextLine () {
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

            this._addNextTextPart(x, y, part.text, part.style, partsList, partsGroup);
        } else {
            let textLine = new TextPart(this.game, x, y, queueItem.text, queueItem.style);

            this.add(textLine);

            if (this._lineQueue.length) {
                this._queueProcessing = true;
                textLine.events.onTextAnimationComplete.addOnce(() => {
                    this._addNextTextLine();
                })
            } else {
                this.events.onDoneAddingLines.dispatch();
                this._queueProcessing = false;
            }
        }
    };

    _convertColorWord (color) {
        return colorConfig[color] ? colorConfig[color] : color; // if the color word isn't found just return the arg because it could be a hex color
    }

    _convertFontKey (font) {
        return fontConfig.fonts[font] ? fontConfig.fonts[font].familyName : font;
    }

    _convertStyle (style) {
        style.font = this._convertFontKey(style.font);
        style.fill = this._convertColorWord(style.fill);
        style.stroke = this._convertColorWord(style.stroke);
        style.fontSize = this._fontSize;

        return style;
    }

    _getTextStyleFromTag (tag) {
        return tag.replace(/\{\{\s*/, '').replace(/\s*\}\}/, '');
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
