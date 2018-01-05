import Verb from '../verb';
import TextAction from '../../../game-actions/text';

export default class ErrorVerb extends Verb {
    constructor () {
        super();

        this._word = 'error';

        this._playerCanExecute = false;
    }

    actions (room, player, lexemePhrase) {
        super.actions(room, player, lexemePhrase);

        let action = new TextAction('{{error}}' + this.stringData);

        return action;
    }

    helpText () {
        return super.helpText() + 'Admin command to output error messages.';
    }
}
