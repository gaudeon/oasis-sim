import Verb from '../verb';
import RunCommandAction from '../../../game-actions/run-command';

export default class SouthVerb extends Verb {
    constructor () {
        super();

        this._word = 'south';

        this._aliases = ['s'];
    }

    actions (room) {
        super.actions(room);

        try {
            return room.commandSouth();
        } catch (error) {
            return new RunCommandAction('error ' + error);
        }
    }
}
