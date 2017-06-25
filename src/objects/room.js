import Door from './door';
import Inventory from './inventory';
import ChangeRoomAction from './game-actions/change-room';

export default class Room {
    constructor (game) {
        this.game = game;

        this._name = 'Generic Room'
        this._description = '';
        this._flavorText = '';

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

    setSouth (description, room) { this.doors.south = new Door('south', description, room); }

    get south () { return this.doors.south; }

    setEast (description, room) { this.doors.east = new Door('east', description, room); }

    get east () { return this.doors.east; }

    setWest (description, room) { this.doors.west = new Door('west', description, room); }

    get west () { return this.doors.west; }

    setNortheast (description, room) { this.doors.northeast = new Door('northeast', description, room); }

    get northeast () { return this.doors.northeast; }

    setNorthwest (description, room) { this.doors.northwest = new Door('northwest', description, room); }

    get northwest () { return this.doors.northwest; }

    setSoutheast (description, room) { this.doors.southeast = new Door('southeast', description, room); }

    get southeast () { return this.doors.southeast; }

    setSouthwest (description, room) { this.doors.southwest = new Door('southwest', description, room); }

    get southwest () { return this.doors.southwest; }

    setUp (description, room) { this._up = new Door('up', description, room); }

    get up () { return this._up; }

    setDown (description, room) { this._down = new Door('down', description, room); }

    get down () { return this._down; }

    get exits () { return _.filter(Object.values(this.doors), (door) => { return typeof door !== 'undefined'; }); }

    // command methods
    commandBrief () {
        let description = 'You are ' + this.description + '.';

        description = description + ' ' + this.flavorText;

        return description;
    };

    commandLook () {
        let description = {};
        description.brief = this.commandBrief();

        description.items = '\nThe room contains: ';

        this.items.forEach((item) => {
            let article = 'a';

            description.items = description.items + article + ' ' + item.brief;
        });

        description.exits = '';

        this.exits.forEach((door) => {
            let preposition;

            switch (door.direction) {
                case 'up':
                    preposition = 'upward';
                    break;
                case 'down':
                    preposition = 'downward';
                    break;
                default:
                    preposition = 'to the ' + door.direction;
                    break;
            };

            description.exits = description.exits + '\nThere is ' + door.description + ' ' + preposition + '.';
        });

        console.log(description);

        return description;
    };

    _directionCommand (direction) {
        if (typeof this[direction] === 'undefined') {
            throw new Error('There doesn\'t seem to be anything in that direction');
        }

        return new ChangeRoomAction(this[direction].room);
    }

    commandNorth () {
        return this._directionCommand('north');
    }

    commandSouth () {
        return this._directionCommand('south');
    }
}
