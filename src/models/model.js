import interpolateStyles from "../utils/interpolate-styles";

export default class Model {
    constructor (node, universe) {
        this._universe = universe;

        this._node = node;

        this._type = node.tags[0];

        this._id = node.name;

        this._key = 'undefined';

        this._name = interpolateStyles(node.displayName || 'undefined');

        this._description = node.description || 'undefined';

        // children
        this._rooms = [];
        this._doors = [];
        this._npcs = [];
        this._items = [];
        this._eventTriggers = [];

        if (node.childrenNames) {
            node.childrenNames.forEach(child => {
                let matches = child.match(/^\[\[((door|item|npc|event|room)(?:-([^\-]+))+)\]\]$/i);

                if (matches !== undefined && matches.length > 0 && matches[1] !== undefined && matches[2] !== undefined) {
                    const id = matches[1];
                    const type = matches[2];

                    switch (type.toLowerCase()) {
                        case 'room': // FORMAT: Room-<id>
                            this._rooms.push(id);
                            break;
                        case 'door': // FORMAT: Door-<direction>-<id>
                            this._doors.push(id);
                            break;
                        case 'item': // FORMAT: Item-<id>
                            this._items.push(id);
                            break;
                        case 'npc': // FORMATE: Npc-<id>
                            this._npcs.push(id);
                            break;
                        case 'event':
                            this._eventTriggers.push(id);
                            break;
                    }
                }
                else {
                    throw new Error(`Unidentified child node ${child} associated with ${this._id}`);
                }
            });
        }
    }

    // accessors
    get universe () { return this._universe; }

    get node () { return this._node; }

    get type () { return this._type; }

    get id () { return this._id; }

    get key () { return this._key; }

    get name () { return this._name; }

    get description () { return this._description; }

    get fullDescription () {
        return '{{npcHighlight}}'+ this.name + '\n\n{{defaultDescription}}' + this.description.trim().replace(/^\w/, (c) => c.toUpperCase());
    }

    get doors () { return _.map(this._doors, id => this.universe.findDoor(id)); }

    get npcs () { return _.map(this._npcs, id => this.universe.findNpc(id)); }

    get items () { return _.map(this._items, id => this.universe.findItem(id)); }

    get rooms () { return _.map(this._rooms, id => this.universe.findRoom(id)); }

    get eventTriggers () { return _.map(this._eventTriggers, id => this.universe.findEventTrigger(id)); }

    // search methods
    findNpcByName (name) {
        return (_.filter(this._npcs, npc => { return npc.key.match(new RegExp(name, 'i')); }))[0];
    }

    findDoorByDirection (direction) {
        return (_.filter(this.doors, door => { return door.direction === direction; }))[0];
    }

    findItemByName (name) {
        return (_.filter(this._items, item => { return item.key.match(new RegExp(name, 'i')); }))[0];
    }

    findEventTriggersByEvent (event) {
        return (_.filter(this._eventTriggers, eventTrigger => { return eventTrigger.key.match(new RegExp(event, 'i')); }))[0];
    }

    // children descriptions accessors
    get npcDescriptions () {
        let npcDescriptions = [];

        this.npcs.forEach(npc => {
            npcDescriptions.push('{{defaultDescription}} There is ' + npc.description + '.');
        });

        return npcDescriptions;
    }

    get doorDescriptions () {
        let doorDescriptions = [];

        this.doors.forEach(door => {
            doorDescriptions.push('{{defaultDescription}} There is ' + door.description + '.');
        });

        return doorDescriptions;
    }

    get itemDescriptions () {
        let itemDescriptions = [];

        this.items.forEach(item => {
            let itemLocation = this.node[item.name + '-Location'];

            itemDescriptions.push('{{defaultDescription}} There is ' + item.description + (itemLocation ? ' ' + itemLocation : '') + '.');
        });

        return itemDescriptions;
    }

    get childrenDescriptions () {
        return {
            items: this.itemDescriptions,
            doors: this.doorDescriptions,
            npcs: this.npcDescriptions
        };
    }
}