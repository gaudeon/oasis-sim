import WadesTrailerLaundryRoom from '../../../../src/objects/rooms/wades-trailer-laundry-room';

describe('WadesTrailerLaundryRoom', () => {
    let wadesTrailerLaundryRoom;

    describe('constructor()', () => {
        it('generates an object', () => {
            wadesTrailerLaundryRoom = new WadesTrailerLaundryRoom();

            assert.isObject(wadesTrailerLaundryRoom);
        });
    });
});
