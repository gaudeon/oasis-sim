export default class Item {
    constructor (world = {}, node = {}) {
        this.world = world;
        this.game = world.game;
        this.node = node;

        this._name = node.name;

        this._description = node.description

        this._key = node.key;
    }

    get name () { return this._name; }

    get description () { return this._description; }

    get key () { return this._key; }
}
