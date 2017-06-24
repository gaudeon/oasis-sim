export default class Parser {
    constructor (rgi) {
        this.rgi = rgi;
    }

    parse (lexemePhrase) {
        let commands = [];
        switch (lexemePhrase.phraseTemplateKey) {
            case 'verb':
                commands = this.processPhraseVerb(lexemePhrase);
                break;
            case 'verb-string':
                commands = this.processPhraseVerbString(lexemePhrase);
                break;
            default:
                throw new Error('Provided lexeme phrase does not have a supported pattern');
        }

        return commands;
    }

    processPhraseVerb (lexemePhrase) {
        // no need to take further action
        return lexemePhrase.tokenSentence;
    }

    processPhraseVerbString (lexemePhrase) {
        // no need to take further action
        let verb = lexemePhrase.tokenSentence[0];
        verb.stringData = lexemePhrase.tokenSentence[1];

        return [verb];
    }
}
