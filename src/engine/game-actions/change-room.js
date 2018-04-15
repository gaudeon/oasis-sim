import GameAction from '../game-action';

export default class ChangeRoomAction extends GameAction {
    constructor (data) {
        super(data);

        this._type = 'change-room';
    }

    run (rgi, buffer, room, player, lastCommand) {
        // get next room
        let nextRoom;
        if (typeof rgi.scene.universe.rooms[this.data.room] !== 'object') { // set the starting room if we don't have one defined
            nextRoom = rgi.scene.universe.startingRoomId;
        } else {
            nextRoom = rgi.scene.universe.rooms[this.data.room];
        }

        // update scene data so we are tracking the current state somewhere
        rgi.scene.room = nextRoom;

        rgi.scene.preRoomDesc = this.data.preRoomDesc;

        rgi.scene.postRoomDesc = this.data.postRoomDesc;

        rgi.scene.lastCommand = lastCommand;

        // run actions prior to look (preRoomDesc)
        rgi.executeActions(this.data.preRoomDesc, nextRoom, player);

        // output look description of room
        rgi.exec('look', nextRoom, player, false, 'player');

        // run actions after look (postRoomDesc)
        rgi.executeActions(this.data.postRoomDesc, nextRoom, player);
    }
}
