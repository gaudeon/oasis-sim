import Model from './model';

export default class EventTriggerModel extends Model {
    constructor (node, universe) {
        super(node, universe);

        this._key = node.event;

        this._type = node.type;

        this._data = node.data;
    }

    get type () { return this._type; }

    get data () { return this._data; }
}