import Map from '../config/map';
import Inventory from './inventory';
import Room from './room';
import Item from './item';
import Door from './door';
import Npc from './npc';

export default class Universe {
    constructor (player) {
        this._player = player;

        this._events = new Phaser.Events.EventEmitter();

        this.nodeNameIndex = {};
        this.rooms = {};
        this.items = {};
        this.doors = {};
        this.npcs = {};
        this.startingRoomId = undefined;

        this.buildNodeNameIndex();
    }

    get player () { return this._player; }

    get events () { return this._events; }

    findRoom(id) { return this.rooms[id] !== undefined ? this.rooms[id] : this.loadNode(id) }

    findItem(id) { return this.items[id] !== undefined ? this.items[id] : this.loadNode(id) }

    findDoor(id) { return this.doors[id] !== undefined ? this.doors[id] : this.loadNode(id) }

    findNpc(id) { return this.npcs[id] !== undefined ? this.npcs[id] : this.loadNode(id) }

    buildNodeNameIndex () {
        Map.forEach(node => {
            // index both the id and the [[id]] version
            this.nodeNameIndex[node.name] = this.nodeNameIndex[`[[${node.name}]]`] = node;

            if (node.isStartingRoom) {
                this.startingRoomId = node.name;
            }
        });
    }

    loadNode (id) {
        let result = undefined;

        if (this.nodeNameIndex[id] === undefined) {
            return result;
        }

        let node = this.nodeNameIndex[id];
        let type = node.tags[0];

        switch (type.toLowerCase()) {
            case 'room':
                result = this.rooms[node.name] = new Room(this, new Inventory(), node);
                break;
            case 'item':
                result = this.items[node.name] = new Item(this, new Inventory(), node);
                break;
            case 'door':
                result = this.doors[node.name] = new Door(this, node);
                break;
            case 'npc':
                result = this.npcs[node.name] = new Npc(this, new Inventory(), node);
                break;
            default:
                throw('Could not identify type of node for ' + node.name, node);
        }

        return result;
    }
}
