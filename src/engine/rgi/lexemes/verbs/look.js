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
                    if (typeof this.source.commandLook === 'function') {
                        actions = this.source.commandLook();
                    } else if (typeof this.source.description !== 'undefined') {
                        actions = [new TextAction('{{defaultDescription}}You see ' + this.source.description + '.')];
                    } else {
                        throw new Error(`Invalid source ${typeof this.source}`);
                    }
                }

                if (typeof actions === 'undefined') {
                    actions = [new TextAction('{{defaultDescription}}You don\'t see anything noteworthy about it.')];
                }

                break;

            // otherwise just assume we are looking at the room
            default:
                actions = room.commandLook();
        }

        return actions;
    }

    helpText () {
        return super.helpText() + 'Look more closely at the room or at something in the room.';
    }
}
