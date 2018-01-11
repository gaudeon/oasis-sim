import Room from '../../../src/objects/room';

describe('Room', () => {
    let room;

    describe('constructor()', () => {
        it('generates an object', () => {
            room = new Room({ game: global.game });

            assert.isObject(room);
        });
    });

    describe('name', () => {
        it('is defined', () => {
            assert.isDefined(room.name);
        });
    })

    describe('description', () => {
        it('is defined', () => {
            assert.isDefined(room.description);
        });
    })
});
