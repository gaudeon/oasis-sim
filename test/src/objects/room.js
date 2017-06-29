import Room from '../../../src/objects/room';

describe('Room', () => {
    let room;

    describe('constructor()', () => {
        it('generates an object', () => {
            room = new Room(global.game);

            assert.isObject(room);
        });
    });

    describe('key', () => {
        it('is defined', () => {
            assert.isDefined(room.key);
        });
    })

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
