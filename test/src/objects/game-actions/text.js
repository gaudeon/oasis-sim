import TextAction from '../../../../src/objects/game-actions/text';

describe('TextAction', () => {
    let text;

    describe('constructor()', () => {
        it('generates an object', () => {
            text = new TextAction();

            assert.isObject(text);
        });
    });
});
