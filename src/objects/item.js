import interpolateDescription from "../utils/interpolate-description";

export default class Item {
    constructor (universe, inventory, node) {
        this._universe = universe;
        this._inventory = inventory;
        this._node = node;

        this._id = node.name;

        this._key = node.item;

        this._name = node.displayName || 'undefined';

        this._description = interpolateDescription(node.description || 'undefined');

        if (node.childrenNames) {
            node.childrenNames.forEach(child => {
                let matches = child.match(/^\[\[((door|item|npc)(?:-([^\-]+))+)\]\]$/i);
                const id = matches[1];
                const type = matches[2];

                switch (type.toLowerCase()) {
                    case 'door': // FORMAT: Door-<direction>-<id>
                        this._doors.push(universe.findDoor(id));
                        break;
                    case 'item': // FORMAT: Item-<id>
                        this._inventory.addItem(universe.findItem(id));
                        break;
                    case 'npc': // FORMATE: Npc-<id>
                        this._npcs.push(universe.findNpc(id));
                        break;
                }
            });
        }
    }

    get node () { return this._node; }

    get id () { return this._id; }

    get key () { return this._key; }

    get name () { return this._name; }

    get description () { return this._description; }

    get universe () { return this._universe; }

    get inventory () { return this._inventory; }

    get items () { return this._inventory.items; }

     // items
    findItemByName (name) { return this._inventory.findItem(name) }

    // the room description
    getGeneralDescription () {
        return '{{itemHighlight}}'+ this.name + '\n\n{{defaultDescription}}' + this.description.trim().replace(/^\w/, (c) => c.toUpperCase());
    }

    // the room inventory
    getInventoryDescription () {
        let itemDescriptions = [];

        this.items.forEach(item => {
            let itemLocation = this.node[item.name + '-Location'];

            itemDescriptions.push('{{defaultDescription}} There is ' + item.description + (itemLocation ? ' ' + itemLocation : '') + '.');
        });

        return itemDescriptions;
    }

    // commands methods
    commandLook () {
        let description = '{{defaultDescription}}' + this.getGeneralDescription();

        if (this.items.length > 0) {
            description = description + `\n\n\${this.name} contains:\n\n` + this.getInventoryDescription();
        }

        return description;
    }
}
