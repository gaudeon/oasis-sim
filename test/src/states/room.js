import RoomState from '../../../src/states/room';

describe('RoomState', () => {
    describe('constructor()', () => {
        it('generates an object', () => {
            let roomState = new RoomState(game);

            assert.isObject(roomState);
        });
    });
});
