import Map from '../../assets/json/map';
import Room from './room';
import Item from './item';
import Door from './door';

export default class Universe {
    constructor (game) {
        this.game = game;
        this.loadMap();
    }

    loadMap () {
        this.rooms = {};
        this.items = {};
        this.doors = {};
        this.startingRoomId = undefined;

        Map.forEach(node => {
            let type = node.tags[0] || 'broken';

            switch (type) {
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
            }
        });
    }
}
