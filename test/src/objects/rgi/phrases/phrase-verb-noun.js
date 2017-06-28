import PhraseVerbNoun from '../../../../../src/objects/rgi/phrases/phrase-verb-noun';

describe('PhraseVerbNoun', () => {
    let phraseVerbNoun;

    describe('constructor()', () => {
        it('generates an object', () => {
            phraseVerbNoun = new PhraseVerbNoun();

            assert.isObject(phraseVerbNoun);
        });
    });
});
