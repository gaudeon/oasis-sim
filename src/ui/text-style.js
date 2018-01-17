import colorConfig from '../../assets/json/colors.json';
import fontConfig from '../../assets/json/fonts.json'

// Represents one of the available text styles defined in assets/json/fonts.json
export default class TextStyle {
    constructor (id, font, fontSize, fill, stroke) {
        this._id = id;
        this._font = font;
        this._fontSize = fontSize;
        this._fill = fill;
        this._stroke = stroke;
    }

    get id () { return this._id; }

    get font () { return this._font; }

    get fontSize () { return this._fontSize; }

    get fill () { return this._fill; }

    get stroke () { return this._stroke; }

    toPhaserTextStyle () {
        let style = {};

        style.font = fontConfig.fonts[this._font] ? fontConfig.fonts[this._font].familyName : this._font;

        style.fontSize = this._fontSize;

        // if the color word isn't found just return the arg because it could be a hex color
        style.fill = colorConfig[this._fill] ? colorConfig[this._fill] : this._fill;

        // if the color word isn't found just return the arg because it could be a hex color
        style.stroke = colorConfig[this._stroke] ? colorConfig[this._stroke] : this._stroke;

        return style;
    }
}
