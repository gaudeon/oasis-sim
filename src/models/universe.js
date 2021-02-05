import Map from '../config/map';
import RoomModel from './room';
import ItemModel from './item';
import DoorModel from './door';
import NpcModel from './npc';
import EventTriggerModel from './event-trigger';

export default class UniverseModel {
    constructor () {
        this.nodeNameIndex = {};
        this.modelIndex = {};
        this.startingRoomId = undefined;

        // build the node index from the map
        Map.forEach(node => {
            // index both the id and the [[id]] version
            this.nodeNameIndex[node.name] = node;

            if (node.isStartingRoom) {
                this.startingRoomId = node.name;
            }
        });
    }

    findRoom(id) { return this.findModel(id) }

    findItem(id) { return this.findModel(id) }

    findDoor(id) { return this.findModel(id) }

    findNpc(id) { return this.findModel(id) }

    findEventTrigger(id) { return this.findModel(id) }

    findModel(id) {
        id = this.cleanId(id);

        let model = this.modelIndex[id];

        if (model === undefined) {
            model = this.modelIndex[id] = this.loadModel(id);
        }

        return model;
    }

    loadModel (id) {
        id = this.cleanId(id);

        if (this.nodeNameIndex[id] === undefined) {
            throw new Error(`${id} does not exist in node index`);
        }

        if (this.modelIndex[id] !== undefined) {
            return this.modelIndex[id];
        }

        let node = this.nodeNameIndex[id];
        let type = node.tags[0];

        let result = undefined;
        switch (type.toLowerCase()) {
            case 'room':
                result = new RoomModel(node, this);
                break;
            case 'item':
                result = new ItemModel(node, this);
                break;
            case 'door':
                result = new DoorModel(node, this);
                break;
            case 'npc':
                result = new NpcModel(node, this);
                break;
            case 'event':
                result = new EventTriggerModel(node, this);
                break;
            default:
                throw new Error(`Could not identify type of node for ${node.name}`);
        }

        return result;
    }

    cleanId(id) { return id.replace(/^\[\[/,'').replace(/\]\]$/); }
}