import Model from './model';

export default class RoomModel extends Model {
    constructor (node, universe) {
        super(node, universe);

        this._key = node.room;
    }
}