export default class Door {
    constructor (direction, description, room) {
        if (typeof direction !== 'string' || !direction.match(/^(?:north|south|east|west|northeast|northwest|southeast|southwest|up|down)$/i)) {
            throw new Error('direction not valid.');
        }

        if (typeof description !== 'string') {
            throw new Error('description not valid.');
        }

        if (typeof room !== 'string') {
            throw new Error('room not valid.');
        }

        this._direction = direction.toLowerCase();
        this._description = description;
        this._room = room;
    }

    get direction () { return this._direction; }

    get description () { return this._description; }

    get room () { return this._room; }
}
