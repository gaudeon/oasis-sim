import Verb from '../verb';
import RunCommandAction from '../../../game-actions/run-command';
import TextAction from '../../../game-actions/text';

export default class GetVerb extends Verb {
    constructor () {
        super();

        this._word = 'get';

        this._aliases = ['g', 'take', 'pick'];

        this.colorItems = '#90EE90'; // MediumOrchid
    }

    actions (room, player) {
        super.actions(room, player);

        if (typeof this.source !== 'undefined') {
            room.inventory.removeItem(this.source);
            player.inventory.addItem(this.source);

            let getTextAction = new TextAction('You obtained a ' + this.source.brief + '.');
            getTextAction.style = {fill: this.colorItems, stroke: this.colorItems};

            return getTextAction;
        } else {
            return new RunCommandAction('error Hmm, I wonder what I should take?');
        }
    }

    helpText () {
        return 'Attempt to pick up an item in the room.';
    }
}
