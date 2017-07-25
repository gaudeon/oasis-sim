import AllVerbs from './lexemes/all-verbs';
import AllItems from '../all-items';
import PhraseVerb from './phrases/phrase-verb';
import PhraseVerbString from './phrases/phrase-verb-string';
import PhraseVerbNoun from './phrases/phrase-verb-noun';

export default class Lexer {
    constructor (rgi) {
        this.rgi = rgi;

        this.verbs = new AllVerbs();
        this.items = new AllItems();
    }

    tokenize (command, room, player, source = 'admin') {
        let words = this.cleanPrepositions(this.cleanArticles(command.split(/ /)));

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

            if (wordsCopy.length < phrase.phraseTemplate.length) { // no need to match on phrases to don't support a short command
                continue;
            }

            // run through each lexeme in a phrase and attempt to match each word in command to it's lexeme counterpart
            for (let lexemeIndex = 0; lexemeIndex < phrase.phraseTemplate.length; lexemeIndex++) {
                let word = wordsCopy.shift();

                if (typeof word === 'undefined') {
                    break;
                }

                let findMethod = this.lexemeToFindMethod[phrase.phraseTemplate[lexemeIndex]];
                let lexeme = findMethod.call(this, word, phrase.phraseTemplateACL[lexemeIndex], wordsCopy, room, player, source);

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
            new PhraseVerbNoun(),
            new PhraseVerbString(),
            new PhraseVerb()
        ];
    }

    get lexemeToFindMethod () {
        return {
            verb: this.findVerb,
            string: this.findString,
            noun: this.findNoun
        }
    }

    findVerb (word, wordACL, words, room, player, source) {
        let verb = this.verbs.findVerb(word, wordACL, words, room, player);

        if (source && source === 'player' && !verb.playerCanExecute) { // check to see if the player can execute this verb
            return undefined;
        }

        return verb;
    }

    findString (word, wordACL, words, room, player, source) {
        let s = word + ' ' + words.join(' ');

        return s;
    }

    findNoun (word, wordACL, words, room, player, source) {
        let matches = [];

        room.items.forEach((item) => {
            if (item.brief.match(new RegExp(word, 'i'))) {
                matches.push(item);
            }
        });

        if (matches.length >= 1) {
            return matches[0];
        }
    }

    cleanArticles (words) {
        return _.filter(words, (word) => { return !word.match(/^(?:a|an|the)$/i); });
    }

    cleanPrepositions (words) {
        return _.filter(words, (word) => { return !word.match(/^(?:aboard|about|above|absent|across|after|against|along|alongside|amid|apropos|apud|around|as|astride|at|atop|ontop|bar|before|behind|beneath|beside|besides|between|beyond|but|by|chez|circa|come|despite|during|except|for|from|in|inside|into|less|like|minus|near|notwithstanding|of|off|on|onto|opposite|out|outside|over|pace|past|per|post|pre|pro|qua|re|sans|save|short|since|than|thorugh|throughout|to|toward|under|underneath|unlike|until|upon|upside|versus|via|vice|with|within|without|worth)$/i); });
    }
}
