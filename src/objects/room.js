import Door from './door';
import Inventory from './inventory';
import ChangeRoomAction from './game-actions/change-room';
import NullAction from './game-actions/null';
import TextAction from './game-actions/text';

export default class Room {
    constructor (game) {
        this.game = game;

        this._name = 'Generic Room'
        this._description = '';
        this._flavorText = '';

        this.briefTextColor = '#87CEEB'; // SkyBlue

        this._inventory = new Inventory(game);

        // doors
        this.doors = {
            north: undefined,
            south: undefined,
            east: undefined,
            west: undefined,
            northeast: undefined,
            northwest: undefined,
            southeast: undefined,
            southwest: undefined,
            up: undefined,
            down: undefined
        };
    }

    // generate text actions (for preRoomDesc / postRoomDesc)
    briefTextAction (text) {
        let action = new TextAction('{{defaultDescription}}' + text);
        return action;
    }

    // room info
    get key () { return this.constructor.name; }

    get name () { return this._name; }

    get description () { return this._description; }

    get flavorText () { return this._flavorText; }

    get inventory () { return this._inventory; }

    get items () { return this._inventory.items; }

    // doors
    setNorth (description, room) { this.doors.north = new Door('north', description, room); }

    get north () { return this.doors.north; }

    // event method called when moving in this direction from current room
    onNorth () { return [new NullAction()]; }

    setSouth (description, room) { this.doors.south = new Door('south', description, room); }

    get south () { return this.doors.south; }

    // event method called when moving in this direction from current room
    onSouth () { return [new NullAction()]; }

    setEast (description, room) { this.doors.east = new Door('east', description, room); }

    get east () { return this.doors.east; }

    // event method called when moving in this direction from current room
    onEast () { return [new NullAction()]; }

    setWest (description, room) { this.doors.west = new Door('west', description, room); }

    get west () { return this.doors.west; }

    // event method called when moving in this direction from current room
    onWest () { return [new NullAction()]; }

    setNortheast (description, room) { this.doors.northeast = new Door('northeast', description, room); }

    get northeast () { return this.doors.northeast; }

    // event method called when moving in this direction from current room
    onNortheast () { return [new NullAction()]; }

    setNorthwest (description, room) { this.doors.northwest = new Door('northwest', description, room); }

    get northwest () { return this.doors.northwest; }

    // event method called when moving in this direction from current room
    onNorthwest () { return [new NullAction()]; }

    setSoutheast (description, room) { this.doors.southeast = new Door('southeast', description, room); }

    get southeast () { return this.doors.southeast; }

    // event method called when moving in this direction from current room
    onSoutheast () { return [new NullAction()]; }

    setSouthwest (description, room) { this.doors.southwest = new Door('southwest', description, room); }

    get southwest () { return this.doors.southwest; }

    // event method called when moving in this direction from current room
    onSouthwest () { return [new NullAction()]; }

    setUp (description, room) { this.doors.up = new Door('up', description, room); }

    get up () { return this.doors.up; }

    // event method called when moving in this direction from current room
    onUp () { return [new NullAction()]; }

    setDown (description, room) { this.doors.down = new Door('down', description, room); }

    get down () { return this.doors.down; }

    // event method called when moving in this direction from current room
    onDown () { return [new NullAction()]; }

    get exits () { return _.filter(Object.values(this.doors), (door) => { return typeof door !== 'undefined'; }); }

    // the room description
    getGeneralDescription () {
        let description = 'You are ' + this.description + '.';

        description = description + ' ' + this.flavorText;

        return description;
    }

    // the room inventory
    getInventoryDescription () {
        let itemDescriptions = [];

        this.items.forEach((item) => {
            itemDescriptions.push('There is a ' + item.getBriefDescription());
        });

        return itemDescriptions;
    }

    // the room exits
    getExitsDescription (firstNewLine = false) {
        let exitDescriptions = [];

        this.exits.forEach((door, i) => {
            exitDescriptions.push('There is ' + door.description + '.');
        });

        return exitDescriptions;
    }

    // all descriptive details about a room
    get allDetails () {
        return {
            general: this.getGeneralDescription(),
            items: this.getInventoryDescription(),
            exits: this.getExitsDescription()
        };
    }

    // command methods
    commandBrief () {
        let description = '{{defaultDescription}}' + this.allDetails.general;

        this.allDetails.items.forEach((item) => {
            description = description + ' ' + item;
        });

        this.allDetails.exits.forEach((exit) => {
            description = description + ' ' + exit;
        });

        return description;
    };

    commandExits (firstNewLine = false) {
        let description = firstNewLine ? '\n' : '';
        description = description + this.getExitsDescription().join('\n');
        return description;
    };

    commandLook () {
        return this.commandBrief();
    };

    _directionCommandEvent (direction) {
        let actions;

        switch (direction) {
            case 'north':
                actions = this.onNorth();
                break;
            case 'south':
                actions = this.onSouth();
                break;
            case 'east':
                actions = this.onEast();
                break;
            case 'west':
                actions = this.onWest();
                break;
            case 'northeast':
                actions = this.onNortheast();
                break;
            case 'northwest':
                actions = this.onNorthwest();
                break;
            case 'southeast':
                actions = this.onSoutheast();
                break;
            case 'southwest':
                actions = this.onSouthwest();
                break;
            case 'up':
                actions = this.onUp();
                break;
            case 'down':
                actions = this.onDown();
                break;
        }

        if (!Array.isArray(actions)) {
            return [actions];
        }

        return actions;
    }

    _directionCommand (direction) {
        if (typeof this.doors[direction] === 'undefined') {
            throw new Error('There doesn\'t seem to be anything in that direction');
        }

        return new ChangeRoomAction({
            room: this.doors[direction].room,
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
