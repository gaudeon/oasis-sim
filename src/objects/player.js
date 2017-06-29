import Inventory from './inventory';

export default class Player {
    constructor (game) {
        this.game = game;

        this._inventory = new Inventory(game);
    }

    get inventory () { return this._inventory; }

    get items () { return this._inventory.items; }
}
