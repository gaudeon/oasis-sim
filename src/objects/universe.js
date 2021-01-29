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

        this.rooms = {};
        this.items = {};
        this.doors = {};
        this.npcs = {};
        this.startingRoomId = undefined;

        this.loadMap();
    }

    get player () { return this._player; }

    get events () { return this._events; }

    findRoom(id) { return this.rooms[id] ? this.rooms[id] : this.findNode(id) }

    findItem(id) { return this.items[id] ? this.items[id] : this.findNode(id) }

    findDoor(id) { return this.doors[id] ? this.doors[id] : this.findNode(id) }

    findNpc(id) { return this.npcs[id] ? this.npcs[id] : this.findNode(id) }

    findNode(id) {
        let node = (_.filter(Map, n => {
            n.name === id
        }))[0];

        if (node === undefined) {
            return node;
        }

        console.log(node);

        return this.loadNode(node);
    }

    loadMap () {
        Map.forEach(node => { this.loadNode(node) });
    }

    loadNode (node) {
        let type = node.tags[0] || 'broken';
        let result = undefined;

        switch (type.toLowerCase()) {
            case 'room':
                result = this.rooms[node.name] = new Room(this, new Inventory(), node);
                if (node.isStartingRoom) {
                    this.startingRoomId = node.name;
                }
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
