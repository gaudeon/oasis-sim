import Verb from '../verb';
import TextAction from '../../../game-actions/text';

export default class InventoryVerb extends Verb {
    constructor () {
        super();

        this._word = 'inventory';

        this._aliases = ['inv', 'i'];
    }

    actions (room, player) {
        super.actions(room, player);

        let description = player.commandLook();

        let itemsTextAction = new TextAction('{{itemDescription}}' + description.items);

        return [itemsTextAction];
    }

    helpText () {
        return super.helpText() + 'Look at your inventory.';
    }
}
