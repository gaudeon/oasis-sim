import Verb from '../verb';
import RunCommandAction from '../../../game-actions/run-command';
import TextAction from '../../../game-actions/text';
import AddInventoryAction from '../../../game-actions/add-inventory';
import RemoveInventoryAction from '../../../game-actions/remove-inventory';

export default class GetVerb extends Verb {
    constructor () {
        super();

        this._word = 'get';

        this._aliases = ['g', 'take', 'pick'];
    }

    actions (room, player, lexemePhrase) {
        super.actions(room, player, lexemePhrase);

        if (typeof this.source !== 'undefined') {
            let actions = [];

            let removeItemAction = new RemoveInventoryAction({ target: room, items: [this.source] });
            actions.push(removeItemAction);

            let addItemAction = new AddInventoryAction({ target: player, items: [this.source] });
            actions.push(addItemAction);

            let getTextAction = new TextAction('{{itemDescription}}You obtained a ' + this.source.brief + '.');
            actions.push(getTextAction);

            return actions;
        } else {
            return new RunCommandAction('error Hmm, I wonder what I should take?');
        }
    }

    helpText () {
        return super.helpText() + 'Attempt to pick up an item in the room.';
    }
}
