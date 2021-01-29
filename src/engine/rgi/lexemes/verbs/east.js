import Verb from '../verb';
import RunCommandAction from '../../../game-actions/run-command';

export default class EastVerb extends Verb {
    constructor () {
        super();

        this._word = 'east';

        this._aliases = ['e'];
    }

    actions (rgi, room, universe, lexemePhrase) {
        super.actions(rgi, room, universe, lexemePhrase);

        try {
            return room.commandEast();
        } catch (error) {
            return new RunCommandAction('error ' + error.message);
        }
    }

    helpText () {
        return super.helpText() + 'Move eastward.';
    }
}
