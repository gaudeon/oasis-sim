import Inventory from './inventory';
import Room from './room';
import Item from './item';
import Door from './door';
import Npc from './npc';
import EventTrigger from './event-trigger';

export default class Universe {
    constructor (model, player) {
        this._player = player;

        this._model = model;

        this._events = new Phaser.Events.EventEmitter();

        this.objectIndex = {};
    }

    get player () { return this._player }

    get model () { return this._model }

    get events () { return this._events }

    get startingRoom () { return this.findRoom(this.model.startingRoomId) }

    findRoom(id) { return this.findObject(id) }

    findItem(id) { return this.findObject(id) }

    findDoor(id) { return this.findObject(id) }

    findNpc(id) { return this.findObject(id) }

    findEventTrigger(id) { return this.findObject(id) }

    findObject(id) {
        id = this.cleanId(id);

        let theObject = this.objectIndex[id];

        if (theObject === undefined) {
            theObject = this.objectIndex[id] = this.loadObject(id);
        }

        return theObject;
    }

    loadObject (id) {
        id = this.cleanId(id);

        let model = this.model.findModel(id);

        if (this.objectIndex[id] !== undefined) {
            return this.objectIndex[id];
        }

        let result = undefined;
        switch (model.type.toLowerCase()) {
            case 'room':
                result = new Room(model, new Inventory(), this);
                break;
            case 'item':
                result = new Item(model, new Inventory(), this);
                break;
            case 'door':
                result = new Door(model, this);
                break;
            case 'npc':
                result = new Npc(model, new Inventory(), this);
                break;
            case 'event':
                result = new EventTrigger(model, this);
                break;
            default:
                throw('Could not identify type of node for ' + node.name, node);
        }

        return result;
    }

    cleanId(id) { return id.replace(/^\[\[/,'').replace(/\]\]$/); }
}
