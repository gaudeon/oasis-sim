export default class Room {
    constructor (data) {
        if (typeof data !== 'object') {
            throw new Error('room data provided is not an object');
        }

        this._data = data;
    }

    get key () { return this._data.key; }

    get name () { return this._data.name; }

    get description () { return this._data.description; }
}
