import Verb from '../verb';
import RunCommandAction from '../../../game-actions/run-command';

export default class NorthWestVerb extends Verb {
    constructor () {
        super();

        this._word = 'northwest';

        this._aliases = ['nw'];
    }

    actions (room, player) {
        super.actions(room, player);

        try {
            return room.commandNorthWest();
        } catch (error) {
            return new RunCommandAction('error ' + error.message);
        }
    }
}
