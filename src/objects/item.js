export default class Item {
    constructor (game) {
        this._name = 'Generic Item';

        this._brief = 'generic item';

        this._description = 'generic item';
    }

    get name () { return this._name; }

    get brief () { return this._brief }

    get description () { return this._description; }
}
