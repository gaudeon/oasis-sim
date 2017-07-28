export default class Inventory {
    constructor (game) {
        this.game = game;

        this._items = [];
    }

    get items () { return this._items; }

    addItem (item) { this._items.push(item); }

    removeItem (removeItem) {
        _.remove(this._items, (item) => {
            return item === removeItem;
        });
    }
}
