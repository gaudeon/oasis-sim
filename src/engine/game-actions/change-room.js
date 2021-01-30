import GameAction from '../game-action';

export default class ChangeRoomAction extends GameAction {
    constructor (data) {
        super(data);

        this._type = 'change-room';
    }

    run (rgi, buffer, room, universe, lastCommand) {
        if (this.debug && console) {
            console.log(`--- Start Change Room Action ---`);
            console.log(`RGI: `, rgi);
            console.log(`RGI: Buffer: `, buffer);
            console.log(`RGI: Room: `, room);
            console.log(`RGI: Universe: `, universe);
            console.log(`RGI: Last Command: `, lastCommand);
        }

        // get next room
        let nextRoom;
        if (typeof universe.findRoom(this.data.room) !== 'object') { // set the starting room if we don't have one defined
            nextRoom = universe.findRoom(universe.startingRoomId);
        } else {
            nextRoom = universe.findRoom(this.data.room);
        }

        // update scene data so we are tracking the current state somewhere
        rgi.scene.room = nextRoom;

        rgi.scene.preRoomDesc = this.data.preRoomDesc;

        rgi.scene.postRoomDesc = this.data.postRoomDesc;

        rgi.scene.lastCommand = lastCommand;

        // run actions prior to look (preRoomDesc)
        rgi.executeActions(this.data.preRoomDesc, nextRoom, universe);

        // output look description of room
        rgi.exec('look', nextRoom, universe, false, 'room');

        // run actions after look (postRoomDesc)
        rgi.executeActions(this.data.postRoomDesc, nextRoom, universe);

        if (this.debug && console) {
            console.log(`--- End Change Room Action ---`);
        }
    }
}
