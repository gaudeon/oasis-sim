import Inventory from './inventory';
import ChangeRoomAction from '../engine/game-actions/change-room';
import TextAction from '../engine/game-actions/text';

export default class Room {
    constructor (universe = {}, node = {}) {
        this.universe = universe;
        this.game = universe.game;
        this.node = node;

        this._name = node.name || 'undefined';
        this._description = node.description || 'undefined';

        // items in the room
        this._inventory = new Inventory(this.universe);

        // doors
        this._doors = [];

        // npcs
        this._npcs = [];

        if (node.childrenNames) {
            node.childrenNames.forEach(child => {
                let id = child.replace(/^\[\[/, '').replace(/\]\]$/, '');
                let idParts = id.split(/-/);

                switch (idParts[0].toLowerCase()) {
                    case 'door': // FORMAT: Door-<direction>-<id>
                        this._doors.push(id);
                        break;
                    case 'item': // FORMAT: Item-<id>
                        this._inventory.addItem(id);
                        break;
                    case 'npc': // FORMATE: Npc-<id>
                        this._npcs.push(id);
                        break;
                }
            });
        }
    }

    // room info
    get name () { return this._name; }

    get description () { return this._description; }

    get inventory () { return this._inventory; }

    get items () { return this._inventory.items; }

    // npcs
    get npcs () { return this._npcs; }

    findNpcByName (name) {
       let npcId = (_.filter(this._npcs, npc => { return npc.match(new RegExp('^npc-' + name, 'i')); }))[0];

       if (npcId) {
           return this._loadNpc(npcId);
       }

       return undefined;
    }

    _loadNpc (id = '') {
        if (typeof id === 'object') {
            return id;
        }

        return this.universe.npcs[ id.replace(/^\[\[/, '').replace(/\]\]$/, '') ]; // get rid of [[ ]] if still there
    }

    getNpcsDescription (firstNewLine = false) {
        let npcDescriptions = [];

        this.npcs.forEach(npc => {
            npcDescriptions.push('{{defaultDescription}} There is ' + this._loadNpc(npc).description + '.');
        });

        return npcDescriptions;
    }

    // doors
    _filterDoorByDirection (direction) {
        return (_.filter(this._doors, door => { return door.match(new RegExp('^door-' + direction + '-', 'i')); }))[0];
    }

    findDoorByDirection (direction) {
        let doorId = this._filterDoorByDirection(direction);

        return doorId ? this._loadDoor(doorId) : undefined;
    }

    get north () { return this._filterDoorByDirection('north'); }

    get south () { return this._filterDoorByDirection('south'); }

    get east () { return this._filterDoorByDirection('east'); }

    get west () { return this._filterDoorByDirection('west'); }

    get northeast () { return this._filterDoorByDirection('northeast'); }

    get northwest () { return this._filterDoorByDirection('northwest'); }

    get southeast () { return this._filterDoorByDirection('southeast'); }

    get southwest () { return this._filterDoorByDirection('southwest'); }

    get up () { return this._filterDoorByDirection('up'); }

    get down () { return this._filterDoorByDirection('down'); }

    // get exits () { return _.filter(Object.values(this.doors), (door) => { return typeof door !== 'undefined'; }); }
    get doors () { return this._doors; }
    get exits () { return this._doors; }

    _loadDoor (id = '') {
        if (typeof id === 'object') {
            return id;
        }

        return this.universe.doors[ id.replace(/^\[\[/, '').replace(/\]\]$/, '') ]; // get rid of [[ ]] if still there
    }

    // the room exits
    getExitsDescription (firstNewLine = false) {
        let exitDescriptions = [];

        this.exits.forEach(door => {
            exitDescriptions.push('{{defaultDescription}} There is ' + this._loadDoor(door).description + '.');
        });

        return exitDescriptions;
    }

    // items
    findItemByName (name) { return this._inventory.findItem(name) }

    _loadItem (id = '') {
        if (typeof id === 'object') {
            return id;
        }

        return this.universe.items[ id.replace(/^\[\[/, '').replace(/\]\]$/, '') ]; // get rid of [[ ]] if still there
    }

    // the room inventory
    getInventoryDescription () {
        let itemDescriptions = [];

        this.items.forEach(item => {
            let itemNode = this._loadItem(item);
            let itemLocation = this.node[itemNode.name + '-Location'];

            itemDescriptions.push('{{defaultDescription}} There is ' + itemNode.description + (itemLocation ? ' ' + itemLocation : '') + '.');
        });

        return itemDescriptions;
    }

    // the room description
    getGeneralDescription () {
        return this.description;
    }

    // all descriptive details about a room
    get allDetails () {
        return {
            general: this.getGeneralDescription(),
            items: this.getInventoryDescription(),
            exits: this.getExitsDescription(),
            npcs: this.getNpcsDescription()
        };
    }

    // command methods
    commandLook () {
        let description = '{{defaultDescription}}' + this.allDetails.general;

        this.allDetails.items.forEach((item) => {
            description = description + ' ' + item;
        });

        this.allDetails.exits.forEach((exit) => {
            description = description + ' ' + exit;
        });

        this.allDetails.npcs.forEach((npc) => {
            description = description + ' ' + npc;
        });

        return description;
    };

    commandExits (firstNewLine = false) {
        let description = firstNewLine ? '\n' : '';
        description = description + this.getExitsDescription().join('\n');
        return description;
    };

    _directionCommandEvent (direction) {
        let actions;

        switch (direction) {
            case 'north':
                actions = this._getActions('onNorth');
                break;
            case 'south':
                actions = this._getActions('onSouth');
                break;
            case 'east':
                actions = this._getActions('onEast');
                break;
            case 'west':
                actions = this._getActions('onWest');
                break;
            case 'northeast':
                actions = this._getActions('onNortheast');
                break;
            case 'northwest':
                actions = this._getActions('onNorthwest');
                break;
            case 'southeast':
                actions = this._getActions('onSoutheast');
                break;
            case 'southwest':
                actions = this._getActions('onSouthwest');
                break;
            case 'up':
                actions = this._getActions('onUp');
                break;
            case 'down':
                actions = this._getActions('onDown');
                break;
        }

        if (!Array.isArray(actions)) {
            return [actions];
        }

        return actions;
    }

    _getActions (event) {
        let actions = [];

        if (this.node[event]) {
            // TODO, support escaped characters
            let events = JSON.parse(this.node[event]);

            events.forEach(e => {
                switch (e.type) {
                    case 'TextAction':
                        actions.push(new TextAction('{{defaultDescription}}' + e.text + '\n'));
                        break;
                };
            });
        }

        return actions;
    }

    _directionCommand (direction) {
        let door = this._loadDoor(this[direction]);

        if (typeof door === 'undefined') {
            throw new Error('There doesn\'t seem to be anything in that direction');
        }

        return new ChangeRoomAction({
            room: door.room,
            preRoomDesc: this._directionCommandEvent(direction),
            postRoomDesc: []
        });
    }

    commandNorth () {
        return this._directionCommand('north');
    }

    commandSouth () {
        return this._directionCommand('south');
    }

    commandEast () {
        return this._directionCommand('east');
    }

    commandWest () {
        return this._directionCommand('west');
    }

    commandNorthEast () {
        return this._directionCommand('northeast');
    }

    commandNorthWest () {
        return this._directionCommand('northwest');
    }

    commandSouthEast () {
        return this._directionCommand('southeast');
    }

    commandSouthWest () {
        return this._directionCommand('southwest');
    }

    commandUp () {
        return this._directionCommand('up');
    }

    commandDown () {
        return this._directionCommand('down');
    }
}
