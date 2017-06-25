import GameAction from '../../../src/objects/game-action';

describe('GameAction', () => {
    let gameAction;

    describe('constructor()', () => {
        it('generates an object', () => {
            gameAction = new GameAction();

            assert.isObject(gameAction);
        });
    });
});
