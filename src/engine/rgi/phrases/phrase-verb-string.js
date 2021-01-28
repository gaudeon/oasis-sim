import LexemePhrase from '../lexeme-phrase';

export default class PhraseVerbString extends LexemePhrase {
    constructor () {
        super();

        this._phraseTemplate = ['verb', 'string'];

         // verbs allowed to be a part of this lexeme phrase
        this._phraseTemplateACL = [
            {
                error: true,
                help: true
            },
            undefined
        ];
    }
}
