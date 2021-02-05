export default class Item {
    constructor (model, inventory, universe) {
        this._universe = universe;

        this._model = model;

        this._inventory = inventory;

        // run through items this item has to start and add them to the inventory
        this.model.items.forEach(item => {
            this._inventory.addItem(universe.findItem(item.id));
        });
    }

    get universe () { return this._universe; }

    get model () { return this._model; }

    get inventory () { this._inventory; }

    // commands methods
    commandLook () {
        let description = this.model.description;

        if (this.inventory.items.length > 0) {
            description = description + `\n\n\${this.name} contains:\n\n`;

            this.inventory.items.forEach(item => {
                description = description + `\n${item.model.name}\n`;
            });
        }

        return description;
    }
}
