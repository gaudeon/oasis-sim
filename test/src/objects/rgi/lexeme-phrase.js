import LexemePhrase from '../../../../src/objects/rgi/lexeme-phrase';

describe('LexemePhrase', () => {
    let lexemePhrase;

    describe('constructor()', () => {
        it('generates an object', () => {
            lexemePhrase = new LexemePhrase();

            assert.isObject(lexemePhrase);
        });
    });
});
