import RoomState from '../../../src/states/room';

describe('RoomState', () => {
    let roomState;

    describe('constructor()', () => {
        it('generates an object', () => {
            roomState = new RoomState(game);

            assert.isObject(roomState);
        });
    });
});
