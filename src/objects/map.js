import mapJSON from '../../assets/json/map.json';
import Room from './room';

export default class Map {
    constructor () {
        this._currentRoom = new Room(mapJSON[0]);
    }

    get currentRoom () { return this._currentRoom; }
}
