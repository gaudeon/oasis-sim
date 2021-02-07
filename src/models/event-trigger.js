import Model from './model';

export default class EventTriggerModel extends Model {
    constructor (node, universe) {
        super(node, universe);

        this._key = node.event;

        this._action_type = node.type;

        this._action_data = node.data;
    }

    get action_type () { return this._action_type; }

    get action_data () { return this._action_data; }
}