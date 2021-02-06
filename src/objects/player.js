import TextAction from '../engine/game-actions/text';

export default class Player {
    constructor (name, inventory) {
        this._name = name;

        this._inventory = inventory;
    }

    get name () { return this._name; }

    get inventory () { return this._inventory; }

    // command methods 
    commandLook () {
        let description = '';

        if (this.items.length) {
            description = description + '{{defaultDescription}}You are carrying: \n';

            this.inventory.items.forEach((item) => {
                let article = '\t\t\t\t';

                description = description + article + ' ' + item.description + '\n';
            });
        } else {
            description = description + '{{defaultDescription}}You are not carrying anything.';
        }

        return [new TextAction(description)];
    };
}
