import LexemePhrase from '../lexeme-phrase';

export default class PhraseVerbNounString extends LexemePhrase {
    constructor () {
        super();

        this._phraseTemplate = ['verb', 'noun', 'string'];

         // verbs allowed to be a part of this lexeme phrase
        this._phraseTemplateACL = [
            {
                tell: true,
            },
            undefined
        ];
    }
}
