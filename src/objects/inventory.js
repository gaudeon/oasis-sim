export default class Inventory {
    constructor (world) {
        this.world = world;
        this.game = world.game;

        this._items = [];
    }

    get items () { return this._items; }

    _loadItem (id = '') {
        if (typeof id === 'object') {
            return id;
        }

        return this.world.items[ id.replace(/^\[\[/, '').replace(/\]\]$/, '') ]; // get rid of [[ ]] if still there
    }

    get itemObjs () { return this._items.map(i => { return this._loadItem(i); }) }

    addItem (item) { this._items.push(item); }

    removeItem (removeItem) {
        _.remove(this._items, (item) => {
            return item === removeItem;
        });
    }
}
