import Verb from '../verb';
import RunCommandAction from '../../../game-actions/run-command';

export default class NorthEastVerb extends Verb {
    constructor () {
        super();

        this._word = 'northeast';

        this._aliases = ['ne'];
    }

    actions (rgi, room, universe, lexemePhrase) {
        super.actions(rgi, room, universe, lexemePhrase);

        try {
            return room.commandNorthEast();
        } catch (error) {
            return new RunCommandAction('error ' + error.message);
        }
    }

    helpText () {
        return super.helpText() + 'Move towards the northeast';
    }
}
