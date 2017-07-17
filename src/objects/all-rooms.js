import YourTrailerLivingRoom from './rooms/your-trailer/living-room';
import YourTrailerPorch from './rooms/your-trailer/porch';

export default class AllRooms {
    constructor (game) {
        this.game = game;

        this._roomMap = {};

        this.roomList.forEach((room) => {
            this._roomMap[room.name] = room;
        });
    }

    get roomList () {
        return [
            YourTrailerLivingRoom,
            YourTrailerPorch
        ];
    }

    get roomMap () { return this._roomMap; }
}
