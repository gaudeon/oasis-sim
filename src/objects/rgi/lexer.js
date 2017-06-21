import LookVerb from './lexemes/verbs/look';

export default class Lexer {
    constructor () {
        this.verbMap = this._buildLexemeVerbMap();
    }

    tokenize (command) {
        let words = command.split(/ /);

        if (!words.length) { // no command found
            throw new Error('No words found');
        }

        let found = false;
        let lexemePhrase = [];

        // run through each phrase pattern and see if the command submitted matches one of them
        for (let lexemePhraseIndex = 0; lexemePhraseIndex < this.lexemePhrases.length; lexemePhraseIndex++) {
            let wordsCopy = Object.assign([], words);
            let foundPhrase = [];
            let phrase = this.lexemePhrases[lexemePhraseIndex];

            // run through each lexeme in a phrase and attempt to match each word in command to it's lexeme counterpart
            for (let lexemeIndex = 0; lexemeIndex < phrase.length; phrase++) {
                let word = wordsCopy.shift();
                let findMethod = this.lexemeToFindMethod[phrase[lexemeIndex]];
                let lexeme = findMethod.call(this, word);

                if (typeof lexeme !== 'undefined') {
                    foundPhrase.push(lexeme);
                } else {
                    break;
                }
            }

            if (foundPhrase.length === phrase.length) {
                found = true;
                lexemePhrase = foundPhrase;
                break;
            }
        }

        if (!found) {
            throw new Error('No valid lexeme phrase found.');
        }

        return lexemePhrase;
    }

    findVerb (word) {
        let letters = word.toLowerCase().splt('');
        let key = '';

        letters.forEach((letter) => {
            key += letter;

            if (_.has(this.verbMap, key)) {
                return this.verbMap[key];
            }
        });

        return null;
    }

    get lexemePhrases () {
        return [
            ['verb']
        ];
    }

    get lexemeToFindMethod () {
        return {
            verb: this.findVerb
        }
    }

    get lexemeVerbs () {
        return [
            new LookVerb()
        ]
    }

    _buildLexemeVerbMap () {
        let map = {};

        this.lexemeVerbs.forEach((verb) => {
            verb.aliases.forEach((alias) => {
                map[alias] = verb;
            });
        });

        return map;
    }
}
