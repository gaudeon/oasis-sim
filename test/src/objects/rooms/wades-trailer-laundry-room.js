import WadesTrailerLaundryRoom from '../../../../src/objects/rooms/wades-trailer-laundry-room';

describe('WadesTrailerLaundryRoom', () => {
    let wadesTrailerLaundryRoom;

    describe('constructor(game)', () => {
        it('generates an object', () => {
            wadesTrailerLaundryRoom = new WadesTrailerLaundryRoom(game);

            assert.isObject(wadesTrailerLaundryRoom);
        });
    });
});
