export default class Parser {
    constructor (rgi, debug = false) {
        this.rgi = rgi;
        this.debug = debug;
    }

    parse (lexemePhrase, source = 'admin') {
        let commands = [];
        switch (lexemePhrase.phraseTemplateKey) {
            case 'verb':
                commands = this.processPhraseVerb(lexemePhrase);
                break;
            case 'verb-string':
                commands = this.processPhraseVerbString(lexemePhrase);
                break;
            case 'verb-noun':
                commands = this.processPhraseVerbNoun(lexemePhrase);
                break;
            default:
                throw new Error('Provided lexeme phrase does not have a supported pattern');
        }

        if (this.debug && console) {
            console.log('Parser: Processed Lexeme Phrase into array of commands:', commands);
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

    processPhraseVerbNoun (lexemePhrase) {
        let verb = lexemePhrase.tokenSentence[0];
        verb.source = lexemePhrase.tokenSentence[1];

        return [verb];
    }
}
