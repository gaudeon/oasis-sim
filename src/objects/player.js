import Inventory from './inventory';

export default class Player {
    constructor (game) {
        this.game = game;

        this._inventory = new Inventory(game);
    }

    get inventory () { return this._inventory; }

    get items () { return this._inventory.items; }

    commandLook () {
        let description = {};

        if (this.items.length) {
            description.items = 'You are carrying: ';

            this.items.forEach((item) => {
                let article = 'a';

                description.items = description.items + article + ' ' + item.brief;
            });
        } else {
            description.items = 'You are not carrying anything.';
        }

        return description;
    };
}
