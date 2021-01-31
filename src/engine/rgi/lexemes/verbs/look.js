import Verb from '../verb';
import TextAction from '../../../game-actions/text';
import Player from '../../../../objects/player';
import Room from '../../../../objects/room';
import Npc from '../../../../objects/npc';
import Item from '../../../../objects/item';

export default class LookVerb extends Verb {
    constructor () {
        super();

        this._word = 'look';

        this._aliases = ['l'];
    }

    actions (rgi, room, universe, lexemePhrase) {
        super.actions(rgi, room, universe, lexemePhrase);

        let actions;

        switch (lexemePhrase.constructor.name) {
            // if we are supposed to have a noun, attempt to find it's description
            case 'PhraseVerbNoun':
                if (typeof this.source !== 'undefined') {
                    if (this.source instanceof Player) {
                        actions = this.lookAtPlayer(this.source)
                    } else if (this.source instanceof Room) {
                        actions = this.lookAtRoom(this.source);
                    } else if (this.source instanceof Item) {
                        actions = this.lookAtItem(this.source);
                    } else if (this.source instanceof Npc) {
                        actions = this.lookAtNpc(this.source);
                    } else if (typeof this.source.description !== 'undefined') {
                        actions = [new TextAction('{{defaultDescription}}You see ' + this.source.description + '.')];
                    }
                }

                if (typeof actions === 'undefined') {
                    actions = [new TextAction('{{defaultDescription}}You don\'t see anything noteworthy about it.')];
                }

                break;

            // otherwise just assume we are looking at the room
            default:
                actions = this.lookAtRoom(room);
        }

        return actions;
    }

    lookAtPlayer (player) {
        let description = player.avatar.commandLook();

        let itemsTextAction = new TextAction('{{itemHighlight}}' + description.items);

        return [itemsTextAction];
    }

    lookAtRoom (room) {
        let briefTextAction = new TextAction('{{defaultDescription}}' + room.commandLook());

        return [briefTextAction];
    }

    lookAtItem (item) {
        let briefTextAction = new TextAction('{{defaultDescription}}' + item.commandLook());

        return [briefTextAction];
    }

    lookAtNpc (npc) {
        let briefTextAction = new TextAction('{{defaultDescription}}' + npc.commandLook());

        return [briefTextAction];
    }

    helpText () {
        return super.helpText() + 'Look more closely at the room or at something in the room.';
    }
}
