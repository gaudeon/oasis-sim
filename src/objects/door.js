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

    get description () {
        let preposition = '';

        switch (this._direction) {
            case 'up':
                preposition = '{{exitDescription}}upward{{defaultDescription}}';
                break;
            case 'down':
                preposition = '{{exitDescription}}downward{{defaultDescription}}';
                break;
            default:
                preposition = 'to the {{exitDescription}}' + this._direction + '{{defaultDescription}}';
                break;
        };

        return this._description + ' ' + preposition;
    }

    get room () { return this._room; }
}
