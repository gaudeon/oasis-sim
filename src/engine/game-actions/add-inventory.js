import GameAction from '../game-action';

export default class AddInventoryAction extends GameAction {
    constructor (data) {
        super(data);

        this._type = 'add-inventory';

        if (!this.data.target) {
            throw new Error('target not defined')
        }

        this._target = this.data.target;

        if (this.data.items.length <= 0) {
            throw new Error('items not defined');
        }

        this._items = this.data.items;
    }

    get target () { return this._target; }

    get items () { return this._items; }

    run (rgi, buffer, room, universe, lastCommand) {
        this.items.forEach(item => {
            this.target.inventory.addItem(item);
        });
    }
}
