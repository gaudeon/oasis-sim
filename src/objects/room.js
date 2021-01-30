import ChangeRoomAction from '../engine/game-actions/change-room';
import TextAction from '../engine/game-actions/text';

export default class Room {
    constructor (universe, inventory, node) {
        this._universe = universe;
        this._inventory = inventory;
        this._node = node;

        this._name = node.name || 'undefined';
        this._description = node.description || 'undefined';

        this._doors = [];
        this._npcs = [];

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

    // room info
    get node () { return this._node; }

    get name () { return this._name; }

    get description () { return this._description; }

    get universe () { return this._universe; }

    // npcs
    get npcs () { return this._npcs }

    findNpcByName (name) {
       return (_.filter(this._npcs, npc => { return npc.name.match(new RegExp('^npc-' + name, 'i')); }))[0];
    }

    getNpcsDescription (firstNewLine = false) {
        let npcDescriptions = [];

        this.npcs.forEach(npc => {
            npcDescriptions.push('{{defaultDescription}} There is ' + npc.description + '.');
        });

        return npcDescriptions;
    }

    // doors
    get doors () { return this._doors }

    get exits () { return this.doors; }

    findDoorByDirection (direction) {
        return (_.filter(this.doors, door => { return door.name.match(new RegExp('^door-' + direction + '-', 'i')); }))[0];
    }

    get north () { return this.findDoorByDirection('north'); }

    get south () { return this.findDoorByDirection('south'); }

    get east () { return this.findDoorByDirection('east'); }

    get west () { return this.findDoorByDirection('west'); }

    get northeast () { return this.findDoorByDirection('northeast'); }

    get northwest () { return this.findDoorByDirection('northwest'); }

    get southeast () { return this.findDoorByDirection('southeast'); }

    get southwest () { return this.findDoorByDirection('southwest'); }

    get up () { return this.findDoorByDirection('up'); }

    get down () { return this.findDoorByDirection('down'); }

     // the room exits
    getExitsDescription (firstNewLine = false) {
        let exitDescriptions = [];

        this.exits.forEach(door => {
            exitDescriptions.push('{{defaultDescription}} There is ' + door.description + '.');
        });

        return exitDescriptions;
    }

    // items
    get inventory () { return this._inventory }

    get items () { return this.inventory.items; }

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
        let door = this.findDoorByDirection(direction);

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
