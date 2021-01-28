import LexemePhrase from '../lexeme-phrase';

export default class PhraseVerbNoun extends LexemePhrase {
    constructor () {
        super();

        this._phraseTemplate = ['verb', 'noun'];

        // verbs allowed to be a part of this lexeme phrase
        this._phraseTemplateACL = [
            {
                look: true,
                get: true,
                put: true
            },
            undefined
        ];
    }
}
