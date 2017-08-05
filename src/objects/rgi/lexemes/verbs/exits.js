import Verb from '../verb';
import TextAction from '../../../game-actions/text';

export default class LookVerb extends Verb {
    constructor () {
        super();

        this._word = 'exits';
        this.colorExits = '#90EE90'; // LightGreen
        this._aliases = [];
    }

    actions (room, player) {
        super.actions(room, player);

        let exitsTextAction = new TextAction(room.commandExits());
        exitsTextAction.style = {fill: this.colorExits, stroke: this.colorExits};

        return [exitsTextAction];
    }

    helpText () {
        return super.helpText() + 'Look for exits in the current room.';
    }
}
