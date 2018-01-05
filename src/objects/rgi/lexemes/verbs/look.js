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

    actions (room, player, lexemePhrase) {
        super.actions(room, player, lexemePhrase);

        let actions;

        switch (lexemePhrase.constructor.name) {
            case 'PhraseVerbNoun':
                if (typeof this.source !== 'undefined') {
                    if (this.source instanceof Player) {
                        actions = this.lookAtPlayer(player);
                    } else if (this.source instanceof Room) {
                        actions = this.lookAtRoom(room);
                    } else if (typeof this.source.description !== 'undefined') {
                        actions = [new TextAction('{{defaultDescription}}You see ' + this.source.description + '.')];
                    }
                }

                if (typeof actions === 'undefined') {
                    actions = [new TextAction('{{defaultDescription}}You don\'t see anything noteworthy about it.')];
                }

                break;
            default:
                actions = this.lookAtRoom(room);
        }

        return actions;
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
