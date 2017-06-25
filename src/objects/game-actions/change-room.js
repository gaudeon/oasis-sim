import GameAction from '../game-action';

export default class ChangeRoomAction extends GameAction {
    constructor (data) {
        super(data);

        this._type = 'change-room';
    }

    run (rgi, buffer, room) {
        room.game.state.start('Room', false, false, this.data);
    }
}
