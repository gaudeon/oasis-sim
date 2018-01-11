export default class Door {
    constructor (world = {}, node = {}) {
        this.world = world;
        this.game = world.game;
        this.node = node;

        let direction;
        if (node.name) {
            let nameParts = node.name.split(/-/); // FORMAT: Door-<direction>-<id>
            direction = nameParts[1];
        }

        if (typeof direction !== 'string' || !direction.match(/^(?:north|south|east|west|northeast|northwest|southeast|southwest|up|down)$/i)) {
            throw new Error('direction not valid.');
        }

        this._direction = direction.toLowerCase();
        this._description = node.description || 'undefined';

        if (node.childrenNames) {
            this._room = this.node.childrenNames[0].replace(/^\[\[/, '').replace(/\]\]$/, '');
        }
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
