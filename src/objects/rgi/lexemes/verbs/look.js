import Verb from '../verb';
import TextAction from '../../../game-actions/text';

export default class LookVerb extends Verb {
    constructor () {
        super();

        this._word = 'look';
        this.colorBrief = '#87CEEB'; // SkyBlue
        this.colorExits = '#90EE90'; // LightGreen
        this._aliases = ['l'];
    }

    actions (room) {
        super.actions(room);

        let description = room.commandLook();

        let briefTextAction = new TextAction(description.brief);
        briefTextAction.style = {fill: this.colorBrief, stroke: this.colorBrief};

        let exitsTextAction = new TextAction(description.exits);
        exitsTextAction.style = {fill: this.colorExits, stroke: this.colorExits};

        return [briefTextAction, exitsTextAction];
    }
}
