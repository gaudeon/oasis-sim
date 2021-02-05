import ChangeRoomAction from '../engine/game-actions/change-room';
import AllGameActions from '../engine/all-game-actions';

export default class Room {
    constructor (model, inventory, universe) {
        this._universe = universe;

        this._model = model;

        this._inventory = inventory;

        this._events = new Phaser.Events.EventEmitter();

        // run through items this npc has to start and add them to the inventory
        this._model.items.forEach(item => {
            this._inventory.addItem(universe.findItem(item.id));
        });

        this._setupEvents();
    }

    get universe () { return this._universe; }

    get model () { return this._model; }

    get inventory () { return this._inventory; }

    get events () { return this._events; }

    // command methods
    commandLook () {
        let description = '{{defaultDescription}}' + this.model.fullDescription;

        this.model.childrenDescriptions.items.forEach((item) => {
            description = description + ' ' + item;
        });

        this.model.childrenDescriptions.doors.forEach((door) => {
            description = description + ' ' + door;
        });

        this.model.childrenDescriptions.npcs.forEach((npc) => {
            description = description + ' ' + npc;
        });

        return description;
    };

    commandExits (firstNewLine = false) {
        let description = firstNewLine ? '\n' : '';
        description = description + this.model.doorDescriptions.join('\n');
        return description;
    };

    _directionCommand (direction) {
        let door = this.model.findDoorByDirection(direction);

        if (typeof door === 'undefined') {
            throw new Error('There doesn\'t seem to be anything in that direction');
        }

        return new ChangeRoomAction({
            room: door.room,
            direction: direction
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

    // event handling
    _setupEvents() {
        // 'onNorth', 'onSouth', 'onEast', 'onWest', 'onNortheast', 'onNorthwest', 'onSoutheast', 'onSouthwest', 'onUp', 'onDown'

        let events = _.uniq(_.map(this.model.eventTriggers, eventTrigger => eventTrigger.key ));

        events.forEach(event => {
            this.events.on(event, (data, rgi, room, universe) => {
                let actions = [];
                _.filter(this.model.eventTriggers, eventTrigger => eventTrigger.key === event).forEach(eventTrigger => {
                    actions.push(new AllGameActions().createAction(eventTrigger.type, eventTrigger.data));
                });

                rgi.executeActions(actions, room, universe);
            });
        });
    }
}
