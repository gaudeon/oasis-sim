import AllRooms from '../../../src/objects/all-rooms';

describe('AllRooms', () => {
    let allRooms;

    describe('constructor(game)', () => {
        it('generates an object', () => {
            allRooms = new AllRooms(game);

            assert.isObject(allRooms);
        });
    });
});
