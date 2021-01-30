export default class Door {
    constructor (universe, node) {
        this._universe = universe;
        this._node = node;

        this._name = node.name;

        let direction;
        if (this._name) {
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

    get universe () { return this._universe; }

    get node () { return this._node; }

    get name () { return this._name; }

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

    get room () { return this._room; }
}
