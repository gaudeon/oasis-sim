import Verb from '../verb';
import TextAction from '../../../game-actions/text';

export default class LookVerb extends Verb {
    constructor () {
        super();

        this._word = 'look';
        this.colorBrief = '#87CEEB'; // SkyBlue
        this.colorItems = '#90EE90'; // MediumOrchid
        this.colorExits = '#90EE90'; // LightGreen
        this._aliases = ['l'];
    }

    actions (room, player) {
        super.actions(room, player);

        if (typeof this.source !== 'undefined') {
            let briefTextAction;

            if (typeof this.source.description !== 'undefined') {
                briefTextAction = new TextAction('You see ' + this.source.description);
            } else {
                briefTextAction = new TextAction('You don\'t see anything else noteworthy about it.');
            }

            briefTextAction.style = {fill: this.colorBrief, stroke: this.colorBrief};

            return [briefTextAction];
        } else {
            let description = room.commandLook();

            let briefTextAction = new TextAction(description.brief);
            briefTextAction.style = {fill: this.colorBrief, stroke: this.colorBrief};

            let itemsTextAction = new TextAction(description.items);
            itemsTextAction.style = {fill: this.colorItems, stroke: this.colorItems};

            let exitsTextAction = new TextAction(description.exits);
            exitsTextAction.style = {fill: this.colorExits, stroke: this.colorExits};

            return [briefTextAction, itemsTextAction, exitsTextAction];
        }
    }

    helpText () {
        return 'Look more closely at the room or at something in the room.';
    }
}
