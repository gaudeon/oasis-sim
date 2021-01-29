import Verb from '../verb';
import RunCommandAction from '../../../game-actions/run-command';

export default class NorthWestVerb extends Verb {
    constructor () {
        super();

        this._word = 'northwest';

        this._aliases = ['nw'];
    }

    actions (rgi, room, universe, lexemePhrase) {
        super.actions(rgi, room, universe, lexemePhrase);

        try {
            return room.commandNorthWest();
        } catch (error) {
            return new RunCommandAction('error ' + error.message);
        }
    }

    helpText () {
        return super.helpText() + 'Move towards the northwest';
    }
}
