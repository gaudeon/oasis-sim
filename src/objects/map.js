import mapJSON from '../../assets/json/map.json';

export default class Map {
    constructor () {
        this._currentRoom = mapJSON[0];
    }

    get currentRoom () { return this._currentRoom; }
}
