import GameAction from '../game-action';
import CallEventAction from './call-event';

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

        // let the room know the player has exited in a given direction
        let direction = this._direction;
        direction = direction.replace(/^\w/, (c) => c.toUpperCase());
        rgi.executeAction(new CallEventAction({
            event:`on${direction}`,
            eventSource: room,
            eventData: {
                direction
            }
        }), room, universe);

        rgi.scene.enterRoom(lastCommand, nextRoom);

        if (this.debug && console) {
            console.log(`--- End Change Room Action ---`);
        }
    }
}
