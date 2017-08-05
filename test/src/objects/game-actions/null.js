import NullAction from '../../../../src/objects/game-actions/null';

describe('NullAction', () => {
    let nullAction;

    describe('constructor()', () => {
        it('generates an object', () => {
            nullAction = new NullAction();

            assert.isObject(nullAction);
        });
    });
});
