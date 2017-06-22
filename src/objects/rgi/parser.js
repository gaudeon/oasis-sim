export default class Parser {
    parse (lexemePhrase) {
        let commands = [];
        switch (lexemePhrase.phraseTemplateKey) {
            case 'verb':
                commands = this.processPhraseVerb(lexemePhrase);
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
}
