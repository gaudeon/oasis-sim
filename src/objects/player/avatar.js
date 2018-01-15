import Inventory from '../inventory';

export default class PlayerAvatar {
    constructor (universe) {
        this.universe = universe;
        this.game = universe.game;

        this._inventory = new Inventory(universe);
    }

    get inventory () { return this._inventory; }

    get items () { return this._inventory.items; }

    commandLook () {
        let description = {};

        if (this.items.length) {
            description.items = 'You are carrying: \n';

            this.items.forEach((item) => {
                let article = '\t\t\t\tA';

                description.items = description.items + article + ' ' + item.description + '\n';
            });
        } else {
            description.items = 'You are not carrying anything.';
        }

        return description;
    };
}
