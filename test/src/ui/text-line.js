import TextLine from '../../../src/ui/text-line';

describe('TextLine', () => {
    let textLine;

    describe('constructor(game)', () => {
        it('generates an object', () => {
            textLine = new TextLine(game);

            assert.isObject(textLine);
        });
    });
});
