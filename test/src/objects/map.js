import Map from '../../../src/objects/map';

describe('Map', () => {
    let map;

    describe('constructor()', () => {
        it('generates an object', () => {
            map = new Map();

            assert.isObject(map);
        });
    });

    describe('currentRoom', () => {
        it('returns a room', () => {
            let room = map.currentRoom;

            assert.isObject(room);
        })
    });
});
