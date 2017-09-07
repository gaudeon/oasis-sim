export default class Item {
    constructor (game, containerOrientation) {
        this._name = 'Generic Item';

        this._brief = 'a generic item'; // part of what is displayed in room breif / look commands in the form "There is a <item_brief> <item_containerOrientation>."

        this._description = 'a generic item.' // display in "look at <item>" commands in the form "You see <item>";

        this._containerOrientation = containerOrientation || '';
    }

    get name () { return this._name; }

    get brief () { return this._brief; }

    getBriefDescription () { return '{{itemDescription}}' + this._brief + '{{defaultDescription}}' + (this._containerOrientation !== '' ? ` ${this._containerOrientation}` : '') + '.'; }

    get description () { return this._description; }

    get containerOrientation () { return this._containerOrientation; }

    set containerOrientation (orientation) { this._containerOrientation = orientation; }

    get key () { return this.prototype.constructor.name };
}
