import Verb from '../verb';
import RunCommandAction from '../../../game-actions/run-command';

export default class SouthVerb extends Verb {
    constructor () {
        super();

        this._word = 'south';

        this._aliases = ['s'];
    }

    actions (rgi, room, universe, lexemePhrase) {
        super.actions(rgi, room, universe, lexemePhrase);

        try {
            return room.commandSouth();
        } catch (error) {
            return new RunCommandAction('error ' + error.message);
        }
    }

    helpText () {
        return super.helpText() + 'Move southward';
    }
}
