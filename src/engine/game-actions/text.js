import GameAction from '../game-action';

export default class TextAction extends GameAction {
    constructor (data) {
        super(data);

        this._type = 'text';
    }

    run (rgi, buffer, room, player, lastCommand) {
        buffer.addText(this.data);
    }
}
