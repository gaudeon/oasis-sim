import Model from './model';

export default class NpcModel extends Model {
    constructor (node, universe) {
        super(node, universe);

        this._key = node.npc;
    }
}