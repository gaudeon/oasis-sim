import Verb from '../verb';
import TextAction from '../../../game-actions/text';

export default class InventoryVerb extends Verb {
    constructor () {
        super();

        this._word = 'inventory';

        this._aliases = ['inv', 'i'];
    }

    actions (room, player, lexemePhrase) {
        super.actions(room, player, lexemePhrase);

        let description = player.avatar.commandLook();

        let itemsTextAction = new TextAction('{{itemDescription}}' + description.items);

        return [itemsTextAction];
    }

    helpText () {
        return super.helpText() + 'Look at your inventory.';
    }
}
