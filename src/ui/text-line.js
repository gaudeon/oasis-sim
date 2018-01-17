import AllTextStyles from './all-text-styles';
import TextPart from './text-part';

// A group of text parts (parsed from a line of parts) displayed on one 'line' of the display
export default class TextLine extends Phaser.Group {
    constructor (game, x = 0, y = 0, text = '') {
        super(game);

        this.x = x;
        this.y = y;
        this.text = text;

        this._styles = new AllTextStyles();

        this._textParts = TextLine.parseText(this.text, this._styles);
    }

    static parseText (text, styles = new AllTextStyles()) {
        let colorChanges = text.match(styles.textStyleRegExp);

        let textByColor = text.split(styles.textStyleRegExp);

        let lineParts = [];
        let lastTextStyle;
        for (let i = 0; i < textByColor.length; i++) { // add each part of the line and it's style
            let textStyle;
            if (i === 0 || colorChanges.length <= i - 1) {
                textStyle = lastTextStyle || styles.styleMap['default'];
            } else {
                textStyle = styles.tagToTextStyle(colorChanges[i - 1]);
            }

            lastTextStyle = textStyle;

            lineParts.push({
                text: textByColor[i],
                style: lastTextStyle
            });
        }

        return lineParts;
    }
}
