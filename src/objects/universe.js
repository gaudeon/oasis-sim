import Map from '../config/map';
import Room from './room';
import Item from './item';
import Door from './door';

export default class Universe {
    constructor (scene) {
        this.scene = scene;
        this.loadMap();
    }

    loadMap () {
        this.rooms = {};
        this.items = {};
        this.doors = {};
        this.startingRoomId = undefined;

        Map.forEach(node => {
            let type = node.tags[0] || 'broken';

            switch (type.toLowerCase()) {
                case 'room':
                    this.rooms[node.name] = new Room(this, node);
                    if (node.isStartingRoom) {
                        this.startingRoomId = node.name;
                    }
                    break;
                case 'item':
                    this.items[node.name] = new Item(this, node);
                    break;
                case 'door':
                    this.doors[node.name] = new Door(this, node);
                    break;
                default:
                    throw('Could not identify type of node for ' + node.name, node);
            }
        });
    }
}
