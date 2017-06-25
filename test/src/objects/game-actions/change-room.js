import ChangeRoomAction from '../../../../src/objects/game-actions/change-room';

describe('ChangeRoomAction', () => {
    let changeRoom;

    describe('constructor()', () => {
        it('generates an object', () => {
            changeRoom = new ChangeRoomAction();

            assert.isObject(changeRoom);
        });
    });
});
