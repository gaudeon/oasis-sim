import Verb from '../verb';
import TextAction from '../../../game-actions/text';

export default class InventoryVerb extends Verb {
    constructor () {
        super();

        this._word = 'inventory';

        this._aliases = ['inv', 'i'];
    }

    actions (rgi, room, universe, lexemePhrase) {
        super.actions(rgi, room, universe, lexemePhrase);

        let description = universe.player.avatar.commandLook();

        let itemsTextAction = new TextAction('{{defaultDescription}}' + description.items);

        return [itemsTextAction];
    }

    helpText () {
        return super.helpText() + 'Look at your inventory.';
    }
}
