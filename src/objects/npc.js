export default class Npc {
    constructor (universe = {}, node = {}) {
        this.universe = universe;
        this.game = universe.game;
        this.node = node;

        this._name = node.name;

        this._description = this._reformatTextStyles(node.description);

        this._key = node.key;
    }

    get name () { return this._name; }

    get description () { return this._description; }

    get key () { return this._key; }

    _reformatTextStyles(text) {
        let textStylesRegEx = new RegExp("<([^\>]+)>", "g");

        return text.replaceAll(textStylesRegEx, (match, style) => {
            return `{{${style}}}`;
        });
    }
}