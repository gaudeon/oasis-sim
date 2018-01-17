import fontConfig from '../../assets/json/fonts.json';
import TextStyle from './text-style';

// Represents the list of all text styles defined in assets/json/fonts.json
export default class AllTextStyles {
    constructor () {
        this._styleMap = {};

        this._styleList = [];

        Object.keys(fontConfig.textStyles).forEach(textStyle => {
            if (textStyle == 'default') {
                // ignore default key
                return;
            }

            // use default values whenever a textStyle doesn't set it
            let textStyleObj = new TextStyle(
                textStyle,
                fontConfig.textStyles[textStyle].font || fontConfig.defaultTextStyle.font,
                fontConfig.textStyles[textStyle].fontSize || fontConfig.defaultTextStyle.fontSize,
                fontConfig.textStyles[textStyle].fill || fontConfig.defaultTextStyle.fill,
                fontConfig.textStyles[textStyle].stroke || fontConfig.defaultTextStyle.stroke
            );

            this._styleList.push(textStyleObj);

            this._styleMap[textStyle] = textStyleObj;
        });

        // Add in the default style
        let defaultStyleObj = new TextStyle(
            'default',
            fontConfig.defaultTextStyle.font,
            fontConfig.defaultTextStyle.fontSize,
            fontConfig.defaultTextStyle.fill,
            fontConfig.defaultTextStyle.stroke
        );

        this._styleList.push(defaultStyleObj);

        this._styleMap['default'] = defaultStyleObj;
    }

    get styleMap () { return this._styleMap; }

    get styleList () { return this._styleList; }

    get styleKeys () { return Object.keys(this._styleMap); }

    get defaultStyle () { return this._styleMap['default']; }

    // used for matching text style tags in text
    get textStyleTagRegExp () {
        if (this._textStyleRegExp) {
            return this._textStyleRegExp;
        }

        let regExp = '\\{\\{\\s*(?:' +
                     this.styleKeys.join('|') +
                     ')\\s*\\}\\}'; // \{\{\s*(?:Color|AnotherColor|Etc)\s*\}\}

        this._textStyleRegExp = new RegExp(regExp, 'g');

        return this._textStyleRegExp;
    }

    stripTextStyleTag (tag) {
        return tag.replace(/\{\{\s*/, '').replace(/\s*\}\}/, '');
    }

    // convert a {{tag}} to a TextStyle object
    tagToTextStyle (tag) {
        return this._styleMap[this.stripTextStyleTag(tag)] || this._styleMap['default'];
    }
}
