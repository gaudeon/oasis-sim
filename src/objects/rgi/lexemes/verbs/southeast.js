import Verb from '../verb';
import RunCommandAction from '../../../game-actions/run-command';

export default class SouthEastVerb extends Verb {
    constructor () {
        super();

        this._word = 'southeast';

        this._aliases = ['se'];
    }

    actions (room, player) {
        super.actions(room, player);

        try {
            return room.commandSouthEast();
        } catch (error) {
            return new RunCommandAction('error ' + error.message);
        }
    }

    helpText () {
        return 'Move towards the southeast';
    }
}
