import Verb from '../verb';
import RunCommandAction from '../../../game-actions/run-command';
import TextAction from '../../../game-actions/text';
import AddInventoryAction from '../../../game-actions/add-inventory';
import RemoveInventoryAction from '../../../game-actions/remove-inventory';
import Item from '../../../../objects/item';
import Player from '../../../../objects/player';

export default class GetVerb extends Verb {
    constructor () {
        super();

        this._word = 'get';

        this._aliases = ['g', 'take', 'pick'];
    }

    actions (rgi, room, universe, lexemePhrase) {
        super.actions(rgi, room, universe, lexemePhrase);

        if (typeof this.source !== 'undefined' && this.source instanceof Item && !(this.source.from instanceof Player)) {
            let actions = [];

            let removeItemAction = new RemoveInventoryAction({ target: room, items: [this.source] });
            actions.push(removeItemAction);

            this.source.containerOrientation = ''; // TODO: make handling container orientation more robust

            let addItemAction = new AddInventoryAction({ target: universe.player, items: [this.source] });
            actions.push(addItemAction);

            let getTextAction = new TextAction('{{itemHighlight}}You obtained ' + this.source.description + '.');
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
