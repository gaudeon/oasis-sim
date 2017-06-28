export default class Item {
    constructor (game) {
        this._name = 'Generic Item';

        this._brief = 'a generic item'; // displayed in room look commands in the form "The room contains: <item> <item>"

        this._description = 'a generic item' // display in "look at <item>" commands in the form "You see <item>";
    }

    get name () { return this._name; }

    get brief () { return this._brief }

    get description () { return this._description; }

    get key () { return this.prototype.constructor.name };
}
