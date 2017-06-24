import AllVerbs from './lexemes/all-verbs';
import PhraseVerb from './phrases/phrase-verb';
import PhraseVerbString from './phrases/phrase-verb-string';

export default class Lexer {
    constructor (rgi) {
        this.rgi = rgi;

        this.verbs = new AllVerbs();
    }

    tokenize (command) {
        let words = command.split(/ /);

        if (!words.length) { // no command found
            throw new Error('No words found');
        }

        let found = false;
        let lexemePhrase = null;

        // run through each phrase pattern and see if the command submitted matches one of them
        for (let lexemePhraseIndex = 0; lexemePhraseIndex < this.lexemePhrases.length; lexemePhraseIndex++) {
            let wordsCopy = Object.assign([], words);
            let foundPhrase = [];
            let phrase = this.lexemePhrases[lexemePhraseIndex];

            // run through each lexeme in a phrase and attempt to match each word in command to it's lexeme counterpart
            for (let lexemeIndex = 0; lexemeIndex < phrase.phraseTemplate.length; lexemeIndex++) {
                let word = wordsCopy.shift();

                if (typeof word === 'undefined') {
                    break;
                }

                let findMethod = this.lexemeToFindMethod[phrase.phraseTemplate[lexemeIndex]];
                let lexeme = findMethod.fn.call(findMethod.context, word, wordsCopy);

                if (typeof lexeme !== 'undefined') {
                    foundPhrase.push(lexeme);
                } else {
                    break;
                }
            }

            if (foundPhrase.length === phrase.phraseTemplate.length) { // we found a valid phrase pattern with the command the user entered
                found = true;
                lexemePhrase = phrase;
                lexemePhrase.tokenSentence = foundPhrase;
                break;
            }
        }

        if (!found) {
            throw new Error('No valid lexeme phrase found.');
        }

        return lexemePhrase;
    }

    get lexemePhrases () {
        return [
            new PhraseVerbString(),
            new PhraseVerb()
        ];
    }

    get lexemeToFindMethod () {
        return {
            verb: {
                fn: this.verbs.findVerb,
                context: this.verbs
            },
            string: {
                fn: this.findString,
                context: this
            }
        }
    }

    findString (word, words) {
        let s = word + ' ' + words.join(' ');

        return s;
    }
}
