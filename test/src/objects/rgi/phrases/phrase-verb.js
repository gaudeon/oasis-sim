import PhraseVerb from '../../../../../src/objects/rgi/phrases/phrase-verb';

describe('PhraseVerb', () => {
    let phraseVerb;

    describe('constructor()', () => {
        it('generates an object', () => {
            phraseVerb = new PhraseVerb();

            assert.isObject(phraseVerb);
        });
    });
});
