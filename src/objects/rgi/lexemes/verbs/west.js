import Verb from '../verb';
import RunCommandAction from '../../../game-actions/run-command';

export default class WestVerb extends Verb {
    constructor () {
        super();

        this._word = 'west';

        this._aliases = ['w'];
    }

    actions (room, player) {
        super.actions(room, player);

        try {
            return room.commandWest();
        } catch (error) {
            return new RunCommandAction('error ' + error.message);
        }
    }

    helpText () {
        return super.helpText() + 'Move westward.';
    }
}
