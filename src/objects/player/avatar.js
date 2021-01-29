import Inventory from '../inventory';

export default class PlayerAvatar {
    constructor (universe) {
        this.universe = universe;
        this.game = universe.game;

        this._inventory = new Inventory(universe);
    }

    get inventory () { return this._inventory; }

    get items () { return this._inventory.items; }

    findItemByName (name) {
       return this._inventory.findItem(name);
    }

    commandLook () {
        let description = {};

        if (this.items.length) {
            description.items = '{{defaultDescription}}You are carrying: \n';

            this.items.forEach((item) => {
                let article = '\t\t\t\t';

                description.items = description.items + article + ' ' + item.description + '\n';
            });
        } else {
            description.items = '{{defaultDescription}}You are not carrying anything.';
        }

        return description;
    };
}
