export default class GameAction {
    constructor (data) {
        this._type = 'generic';

        this._data = data;
    }

    get type () { return this._type; }

    get data () { return this._data; }

    run (rgi, buffer, room) { /* nothing here */ }
}
