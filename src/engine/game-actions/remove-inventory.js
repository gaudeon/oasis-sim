import GameAction from '../game-action';

export default class RemoveInventoryAction extends GameAction {
    constructor (data) {
        super(data);

        this._type = 'remove-inventory';

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

    run (rgi, buffer, room, universe2, lastCommand) {
        if (this.debug && console) {
            console.log(`--- Start Remove Inventory Action ---`);
            console.log(`RGI: `, rgi);
            console.log(`RGI: Buffer: `, buffer);
            console.log(`RGI: Room: `, room);
            console.log(`RGI: Universe: `, universe);
            console.log(`RGI: Last Command: `, lastCommand);
        }

        this.items.forEach(item => {
            if (this.debug && console) {
                console.log(`RGI Removing Item: `, item);
            }

            this.target.inventory.removeItem(item);
        });

        if (this.debug && console) {
            console.log(`--- End Remove Inventory Action ---`);
        }
    }
}
