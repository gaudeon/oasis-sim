import LexemePhrase from '../lexeme-phrase';

export default class PhraseVerbNoun extends LexemePhrase {
    constructor () {
        super();

        this._phraseTemplate = ['verb', 'noun'];

        this._phraseTemplateACL = [
            {
                look: true,
                get: true
            },
            undefined
        ];
    }
}
