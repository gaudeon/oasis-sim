import Verb from '../verb';
import RunCommandAction from '../../../game-actions/run-command';

export default class SouthWestVerb extends Verb {
    constructor () {
        super();

        this._word = 'southwest';

        this._aliases = ['sw'];
    }

    actions (room, player, lexemePhrase) {
        super.actions(room, player, lexemePhrase);

        try {
            return room.commandSouthWest();
        } catch (error) {
            return new RunCommandAction('error ' + error.message);
        }
    }

    helpText () {
        return super.helpText() + 'Move towards the southwest';
    }
}
