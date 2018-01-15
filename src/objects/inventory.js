export default class Inventory {
    constructor (universe = {}) {
        this.universe = universe;
        this.game = universe.game;

        this._items = [];
    }

    _cleanId (id = '') {
        return id.replace(/^\[\[/, '').replace(/\]\]$/, ''); // get rid of [[ ]] if still there
    }

    _loadItem (id = '') {
        if (typeof id === 'object') {
            return id;
        }

        id = this._cleanId(id);

        return this.universe.items[ id ] ? this.universe.items[ id ] : id; // return the object form of an item as soon as we can (inital loads will just have the string name of items)
    }

    get items () { return this._items.map(i => { return this._loadItem(i); }); }

    addItem (item) { this._items.push(this._loadItem(item)); }

    removeItem (removeItem) {
        _.remove(this._items, item => {
            return this._loadItem(item).key === this._loadItem(removeItem).key;
        });
    }
}
