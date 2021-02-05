import Model from './model';

export default class DoorModel extends Model {
    constructor (node, universe) {
        super(node, universe);

        this._key = node.door;

        let direction;
        if (this._name) {
            let nameParts = node.door.split(/-/); // FORMAT: Door-<direction>-<id>
            direction = nameParts[0];
        }

        if (typeof direction !== 'string' || !direction.match(/^(?:north|south|east|west|northeast|northwest|southeast|southwest|up|down)$/i)) {
            throw new Error('direction not valid.');
        }

        this._direction = direction.toLowerCase();
    }

    get direction () { return this._direction; }

    get description () {
        let preposition = '';

        switch (this._direction) {
            case 'up':
                preposition = '{{exitHighlight}}upward{{defaultDescription}}';
                break;
            case 'down':
                preposition = '{{exitHighlight}}downward{{defaultDescription}}';
                break;
            default:
                preposition = 'to the {{exitHighlight}}' + this._direction + '{{defaultDescription}}';
                break;
        };

        return this._description + ' ' + preposition;
    }

    get room () { return this._rooms[0]; }
}