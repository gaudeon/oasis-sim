import Verb from '../verb';
import RunCommandAction from '../../../game-actions/run-command';

export default class NorthVerb extends Verb {
    constructor () {
        super();

        this._word = 'north';

        this._aliases = ['n'];
    }

    actions (rgi, room, universe, lexemePhrase) {
        super.actions(rgi, room, universe, lexemePhrase);

        try {
            return room.commandNorth();
        } catch (error) {
            return new RunCommandAction('error ' + error.message);
        }
    }

    helpText () {
        return super.helpText() + 'Move northward.';
    }
}
