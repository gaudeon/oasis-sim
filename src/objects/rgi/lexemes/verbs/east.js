import Verb from '../verb';
import RunCommandAction from '../../../game-actions/run-command';

export default class EastVerb extends Verb {
    constructor () {
        super();

        this._word = 'east';

        this._aliases = ['e'];
    }

    actions (room, player) {
        super.actions(room, player);

        try {
            return room.commandEast();
        } catch (error) {
            return new RunCommandAction('error ' + error.message);
        }
    }

    helpText () {
        return 'Move eastward.';
    }
}
