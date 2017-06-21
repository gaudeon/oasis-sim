import Lexer from './rgi/lexer';
import Parser from './rgi/parser';

// RGI === Regular Grammar Interpreter
export default class RGI {
    constructor (buffer) {
        this.textBuffer = buffer;
        this.lexer = new Lexer();
        this.parser = new Parser();
    }

    exec (command, room) {
        let lexemePhrase;

        try {
            lexemePhrase = this.lexer.tokenize(command);
        } catch (error) {
            return error;
        }

        this.parser.parse(lexemePhrase);
    }

    findCommands (word) {
        let lcWord = word.toLowerCase();
        let possibleCommands = [];

        Object.keys(this.commands).forEach((command) => {
            if (command.match(lcWord)) {
                possibleCommands.push(command);
            }
        });

        return possibleCommands;
    }

    get commands () {
        return {
        };
    }
}
