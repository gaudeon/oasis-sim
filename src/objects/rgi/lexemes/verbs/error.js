import Verb from '../verb';
import TextAction from '../../../game-actions/text';

export default class ErrorVerb extends Verb {
    constructor () {
        super();

        this._word = 'error';

        this.colorError = '#FFB6C1'; // LightPink

        this._playerCanExecute = false;
    }

    actions (room, player) {
        super.actions(room, player);

        let action = new TextAction(this.stringData);
        action.style = {fill: this.colorError, stroke: this.colorError};

        return action;
    }

    helpText () {
        return 'Admin command to output error messages.';
    }
}
