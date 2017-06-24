import WadesTrailerLaundryRoom from './rooms/wades-trailer-laundry-room';
import WadesTrailerOutside from './rooms/wades-trailer-outside';

export default class AllRooms {
    constructor (game) {
        this.game = game;

        this._roomMap = {};

        this.roomList.forEach((room) => {
            this._roomMap[room.constructor.name] = room;
        });
    }

    get roomList () {
        return [
            new WadesTrailerLaundryRoom(this.game),
            new WadesTrailerOutside(this.game)
        ];
    }

    get roomMap () { return this._roomMap; }
}
