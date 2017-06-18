import TextBuffer from '../../../src/ui/text-buffer';

describe('TextBuffer', () => {
    let textBuffer;

    describe('constructor()', () => {
        it('generates an object', () => {
            textBuffer = new TextBuffer(game);

            assert.isObject(textBuffer);
        });
    });
});
