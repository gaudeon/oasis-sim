import GameAction from '../game-action';

export default class ChangeRoomAction extends GameAction {
    constructor (data) {
        super(data);

        // data
        //  room - the target room object
        //  direction - the direction of the door in the current room 

        this._type = 'change-room';

        if (data.direction === undefined || !data.direction.match(/^(north|south|east|west|northeast|northwest|southeast|southwest|up|down)$/i)) {
            throw new Error("direction not provided in data for this action");
        }
        this._direction = data.direction;
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

        // call any actions related to player moving into this new room in based on the direction of the exit in the current room
        let direction = this._direction;
        direction = direction.replace(/^\w/, (c) => c.toUpperCase());
        universe.events.emit(`on${direction}`, rgi, room, universe);

        rgi.scene.enterRoom(lastCommand, nextRoom);

        if (this.debug && console) {
            console.log(`--- End Change Room Action ---`);
        }
    }
}
