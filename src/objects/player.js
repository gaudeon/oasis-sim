import Inventory from './inventory';

export default class Player {
    constructor (world) {
        this.world = world;
        this.game = world.game;

        this._inventory = new Inventory(world);
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
