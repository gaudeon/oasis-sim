import Verb from '../verb';
import TextAction from '../../../game-actions/text';

export default class BriefVerb extends Verb {
    constructor () {
        super();

        this._word = 'brief';

        this._aliases = [];
    }

    actions (room, player) {
        super.actions(room, player);

        let description = room.commandBrief();

        let action = new TextAction('{{defaultDescription}}' + description);

        return action;
    }

    helpText () {
        return super.helpText() + 'Outputs a brief description of the room.';
    }
}
