export default class EventTrigger {
    constructor (universe, node) {
        this._universe = universe;
        this._node = node;

        this._id = node.name || 'undefined';

        this._event = node.event;

        this._type = node.type;

        this._data = node.data;
    }

    // model related
    get node () { return this._node; }

    get id () { return this._id; }

    get event () { return this._event; }

    get type () { return this._type; }

    get data () { return this._data; }

    get universe () { return this._universe; }
}