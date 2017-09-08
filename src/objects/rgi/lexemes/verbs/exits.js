import Verb from '../verb';
import TextAction from '../../../game-actions/text';

export default class LookVerb extends Verb {
    constructor () {
        super();

        this._word = 'exits';

        this._aliases = [];
    }

    actions (room, player) {
        super.actions(room, player);

        let exitsTextAction = new TextAction('{{exitDescription}}' + room.commandExits());

        return [exitsTextAction];
    }

    helpText () {
        return super.helpText() + 'Look for exits in the current room.';
    }
}
