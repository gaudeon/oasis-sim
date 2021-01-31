import AllVerbs from './lexemes/all-verbs';
import PhraseVerb from './phrases/phrase-verb';
import PhraseVerbString from './phrases/phrase-verb-string';
import PhraseVerbNoun from './phrases/phrase-verb-noun';
import PhraseVerbNounString from './phrases/phrase-verb-noun-string';

export default class Lexer {
    constructor (rgi, debug = false) {
        this.rgi = rgi;

        this.verbs = new AllVerbs();

        this.debug = debug;
    }

    tokenize (command, room, universe, source = 'admin') {
        if (this.debug && console) {
            console.log(`--- Start Lexer Tokenize --- `);
            console.log(`Lexer command: `, command);
            console.log(`Lexer room: `, command);
            console.log(`Lexer universe: `, command);
            console.log(`Lexer source: `, command);
        }

        let words = this.cleanPrepositions(this.cleanArticles(command.replace(/\s+$/, '').split(/\s+/)));

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

            if (wordsCopy.length < phrase.phraseTemplate.length) { // no need to match on phrases that don't support a short command
                continue;
            }

            if (this.debug && console) {
                console.log(`Lexer: Testing Phrase Class: ${phrase.constructor.name}`);
            }

            // run through each lexeme in a phrase and attempt to match each word in command to it's lexeme counterpart
            for (let lexemeIndex = 0; lexemeIndex < phrase.phraseTemplate.length; lexemeIndex++) {
                let word = wordsCopy.shift();

                if (typeof word === 'undefined') {
                    break;
                }

                if (this.debug && console) {
                    console.log(`Lexer: Looking for ${phrase.phraseTemplate[lexemeIndex]}`);
                }

                let findMethod = this.lexemeToFindMethod[phrase.phraseTemplate[lexemeIndex]];
                let lexeme = findMethod.call(this, word, phrase.phraseTemplateACL[lexemeIndex], wordsCopy, room, universe, source);

                if (typeof lexeme !== 'undefined') {
                    foundPhrase.push(lexeme);

                    if (this.debug && console) {
                        console.log(`Lexer: Found ${phrase.phraseTemplate[lexemeIndex]}! Class: ${lexeme.constructor.name}`);
                    }
                } else {
                    if (this.debug && console) {
                        console.log(`Lexer: ${phrase.phraseTemplate[lexemeIndex]} not found!`);
                    }

                    break;
                }
            }

            if (foundPhrase.length === phrase.phraseTemplate.length) { // we found a valid phrase pattern with the command the user entered
                found = true;
                lexemePhrase = phrase;
                lexemePhrase.tokenSentence = foundPhrase;

                if (this.debug && console) {
                    console.log(`Lexer: Matching Phrase found! Class: ${lexemePhrase.constructor.name}`);
                }

                break;
            }
        }

        if (!found) {
            throw new Error('No valid lexeme phrase found.');
        }

        if (this.debug && console) {
            console.log(`Lexer found lexemePhrase: `, lexemePhrase);
            console.log(`--- End Lexer Tokenize --- `);
        }

        return lexemePhrase;
    }

    get lexemePhrases () {
        return [
            new PhraseVerbNounString(),
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

    findVerb (word, wordACL, words, room, universe, source) {
        let verb = this.verbs.findVerb(word, wordACL, words, room, universe);

        if (this.debug && console) {
            console.log(`Lexer: FindVerb Result: ${typeof verb === 'undefined' ? 'undefined' : verb.constructor.name}`);
        }

        if (source && source === 'player' && verb && !verb.playerCanExecute) { // check to see if the player can execute this verb
            return undefined;
        }

        return verb;
    }

    findString (word, wordACL, words, room, universe, source) {
        let s = word + ' ' + words.join(' ');

        if (this.debug && console) {
            console.log(`Lexer: FindString Result: ${s}`);
        }

        return s;
    }

    findNoun (word, wordACL, words, room, universe, source) {
        let match;

        if (this.debug && console) {
            console.log('Lexer findNoun: word -> ', word);
            console.log('Lexe findNoun: wordACL -> ', wordACL);
            console.log('Lexer findNoun: words -> ', words);
            console.log('Lexer findNoun: room -> ', room);
            console.log('Lexer findNoun: universe -> ', universe);
            console.log('Lexer findNoun: source -> ', source);
        }

        if (word.match(/^(self|myself|me)$/)) {
            match = universe.player;

            if (this.debug && console) {
                console.log(`Lexer: subject matched the player`);
            }
        } else if (word.match(/^(room|surroundings)$/)) {
            match = room

            if (this.debug && console) {
                console.log(`Lexer: subject matched the room`);
            }
        } else if (word.match(/^(north|south|east|west|northeast|northwest|southeast|southwest|up|down)$/)) {
            let door = room.findDoorByDirection(word);

            if (door !== undefined) {
                match = door;

                if (this.debug && console) {
                    console.log(`Lexer: subject matched an exit`);
                }
            }
        } else {
            if (this.debug && console) {
                console.log(`Lexer: subject was not player/room/exit looking for an item or npc`);
            }

            let roomItem = room.findItemByName(word);

            if (roomItem !== undefined) {
                match = roomItem;
                match.from = room;

                if (this.debug && console) {
                    console.log(`Lexer: subject matched an item in the room`);
                }
            } else {
                let playerItem = universe.player.avatar.findItemByName(word);

                if (playerItem !== undefined) {
                    match = playerItem;
                    match.from = universe.player;

                    if (this.debug && console) {
                        console.log(`Lexer: subject matched an item on the player`);
                    }
                } else {
                    let npc = room.findNpcByName(word);

                    if (npc !== undefined) {
                        match = npc;
                        match.from = room;

                        if (this.debug && console) {
                            console.log(`Lexer: subject matched an npc`);
                        }
                    } 
                }
            }
        }

        if (this.debug && console) {
            console.log(`Lexer: FindNoun Result: ${typeof match === 'undefined' ? 'undefined' : match.constructor.name}`);
        }

        return match || '';
    }

    cleanArticles (words) {
        return _.filter(words, (word) => { return !word.match(/^(?:a|an|the)$/i); });
    }

    cleanPrepositions (words) {
        return _.filter(words, (word) => { return !word.match(/^(?:aboard|about|above|absent|across|after|against|along|alongside|amid|apropos|apud|around|as|astride|at|atop|ontop|bar|before|behind|beneath|beside|besides|between|beyond|but|by|chez|circa|come|despite|during|except|for|from|in|inside|into|less|like|minus|near|notwithstanding|of|off|on|onto|opposite|out|outside|over|pace|past|per|post|pre|pro|qua|re|sans|save|short|since|than|thorugh|throughout|to|toward|under|underneath|unlike|until|upon|upside|versus|via|vice|with|within|without|worth)$/i); });
    }
}
