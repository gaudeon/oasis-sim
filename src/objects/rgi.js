import Lexer from './rgi/lexer';
import Parser from './rgi/parser';

// RGI === Regular Grammar Interpreter
export default class RGI {
    constructor (buffer) {
        this.textBuffer = buffer;
        this.lexer = new Lexer(this);
        this.parser = new Parser(this);
    }

    exec (command, room, outputCommand = true) {
        let lexemePhrase;

        if (outputCommand) {
            this.textBuffer.addText('');
            this.textBuffer.addText('> ' + command);
        }

        try {
            lexemePhrase = this.lexer.tokenize(command);
        } catch (error) {
            return error;
        }

        let commands = this.parser.parse(lexemePhrase);

        commands.forEach((command) => {
            command.setContext(this, this.textBuffer, room);
            command.exec();
        });
    }
}
