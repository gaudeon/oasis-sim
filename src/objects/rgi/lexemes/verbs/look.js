import Verb from '../verb';
import TextAction from '../../../game-actions/text';
import Player from '../../../player';
import Room from '../../../room';

export default class LookVerb extends Verb {
    constructor () {
        super();

        this._word = 'look';

        this._aliases = ['l'];
    }

    actions (room, player) {
        super.actions(room, player);

        if (typeof this.source !== 'undefined') {
            let briefTextAction;

            if (this.source instanceof Player) {
                return this.lookAtPlayer(player);
            } else if (this.source instanceof Room) {
                return this.lookAtRoom(room);
            } if (typeof this.source.description !== 'undefined') {
                briefTextAction = new TextAction('{{defaultDescription}}You see ' + this.source.description);
            } else {
                briefTextAction = new TextAction('{{defaultDescription}}You don\'t see anything else noteworthy about it.');
            }

            return [briefTextAction];
        } else {
            return this.lookAtRoom(room);
        }
    }

    lookAtPlayer (player) {
        let description = player.commandLook();

        let itemsTextAction = new TextAction('{{itemDescription}}' + description.items);

        return [itemsTextAction];
    }

    lookAtRoom (room) {
        let briefTextAction = new TextAction('{{defaultDescription}}' + room.commandLook());

        return [briefTextAction];
    }

    helpText () {
        return super.helpText() + 'Look more closely at the room or at something in the room.';
    }
}
