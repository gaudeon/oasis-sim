import AllRooms from '../../../src/objects/all-rooms';

describe('AllRooms', () => {
    let allRooms;

    describe('constructor()', () => {
        it('generates an object', () => {
            allRooms = new AllRooms();

            assert.isObject(allRooms);
        });
    });
});
