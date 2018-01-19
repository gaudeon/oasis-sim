import LexemePhrase from '../lexeme-phrase';

export default class PhraseVerbString extends LexemePhrase {
    constructor () {
        super();

        this._phraseTemplate = ['verb', 'string'];

        this._phraseTemplateACL = [
            {
                error: true,
                help: true
            },
            undefined
        ];
    }
}
