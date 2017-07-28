import LexemePhrase from '../lexeme-phrase';

export default class PhraseVerb extends LexemePhrase {
    constructor () {
        super();

        this._phraseTemplate = ['verb'];

        // NOTE: All verbs are allowed in this phrase
    }
}
