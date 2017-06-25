import Verb from '../verb';
import TextAction from '../../../game-actions/text';

export default class ErrorVerb extends Verb {
    constructor () {
        super();

        this._word = 'error';

        this.colorError = '#FFB6C1'; // LightPink
    }

    actions (room) {
        super.actions(room);

        let action = new TextAction(this.stringData);
        action.style = {fill: this.colorError, stroke: this.colorError};

        return action;
    }
}
