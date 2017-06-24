import PhraseVerbString from '../../../../../src/objects/rgi/phrases/phrase-verb-string';

describe('PhraseVerbString', () => {
    let phraseVerbString;

    describe('constructor()', () => {
        it('generates an object', () => {
            phraseVerbString = new PhraseVerbString();

            assert.isObject(phraseVerbString);
        });
    });
});
