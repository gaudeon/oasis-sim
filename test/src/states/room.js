import {describe, it} from 'mocha';
import chai from 'chai';
import env from '../../env';
import RoomState from '../../../src/states/room';

const assert = chai.assert;

env.gameReady.then((game) => {
    describe('RoomState', () => {
        let roomState;

        describe('constructor()', () => {
            it('generates an object', () => {
                roomState = new RoomState(game);

                assert.isObject(roomState);
            });
        });
    });
});
