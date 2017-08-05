import GameAction from '../game-action';

export default class ChangeRoomAction extends GameAction {
    constructor (data) {
        super(data);

        this._type = 'change-room';
    }

    run (rgi, buffer, room, player, lastCommand) {
        room.game.state.start('Room', false, false, this.data.room, this.data.preRoomDesc, this.data.postRoomDesc, lastCommand);
    }
}
