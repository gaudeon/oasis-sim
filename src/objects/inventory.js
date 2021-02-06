export default class Inventory {
    constructor (universe = {}) {
        this.universe = universe;

        this._items = [];
    }

    get items () { return this._items; }

    addItem (item) { this._items.push(item); }

    removeItem (removeItem) {
        _.remove(this._items, item => {
            return item.model.key === removeItem.model.key;
        });
    }

    findItem (name) {
       return (_.filter(this._items, item => { 
           return item.model.key.match(new RegExp(name, 'i')); 
       }))[0];
    }
}
