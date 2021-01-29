import Verb from '../verb';
import RunCommandAction from '../../../game-actions/run-command';

export default class DownVerb extends Verb {
    constructor () {
        super();

        this._word = 'down';

        this._aliases = ['d'];
    }

    actions (rgi, room, universe, lexemePhrase) {
        super.actions(rgi, room, universe, lexemePhrase);

        try {
            return room.commandDown();
        } catch (error) {
            return new RunCommandAction('error ' + error.message);
        }
    }

    helpText () {
        return super.helpText() + 'Move downward.';
    }
}
