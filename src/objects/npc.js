import interpolateDescription from "../utils/interpolate-description";
import AllGameActions from "../engine/all-game-actions";

export default class Npc {
    constructor (universe, inventory, node) {
        this._universe = universe;
        this._inventory = inventory;
        this._node = node;

        this._name = node.name;

        this._description = interpolateDescription(node.description);

        this._key = node.key;

        this._room = undefined;

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

        this._setupEvents(node);
    }

    get node () { return this._node; }

    get name () { return this._name; }

    get description () { return this._description; }
    
    get universe () { return this._universe; }

    get inventory () { return this._inventory; }

    get items () { return this._inventory.items; }

    get key () { return this._key; }

    // room related
    get room () { return this._room; }

    set room (r) { this._room = r; }

    // items
    findItemByName (name) { return this._inventory.findItem(name) }

    // the room inventory
    getInventoryDescription () {
        let itemDescriptions = [];

        this.items.forEach(item => {
            let itemLocation = this.node[item.name + '-Location'];

            itemDescriptions.push('{{defaultDescription}} There is ' + item.description + (itemLocation ? ' ' + itemLocation : '') + '.');
        });

        return itemDescriptions;
    }

    _setupEvents(node) {
        const handledEvents = ['onPlayerEnter'];

        handledEvents.forEach(event => {
            if (node[event] === undefined) {
                return;
            }
            
            this.universe.events.on(event, (rgi, room, universe) => {
                if (room === this.room) {
                    let actionConfigList = JSON.parse(node[event]);

                    let actions = new AllGameActions().createActionsFromList(actionConfigList);

                    rgi.executeActions(actions, room, universe);
                }
            });
        });
    }
}