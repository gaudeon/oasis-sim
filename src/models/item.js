import Model from './model';

export default class ItemModel extends Model {
    constructor (node, universe) {
        super(node, universe);

        this._key = node.item;
    }
}