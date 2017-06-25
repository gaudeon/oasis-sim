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
        let commands;
        const outputText = (fn) => {
            if (typeof fn !== 'function') {
                fn = function () {};
            }

            if (outputCommand) {
                this.textBuffer.events.onDoneAddingLines.addOnce(() => {
                    fn();
                });
                this.textBuffer.addText('');
                this.textBuffer.addText('> ' + command);
            } else {
                fn();
            }
        };

        try {
            lexemePhrase = this.lexer.tokenize(command);

            commands = this.parser.parse(lexemePhrase);
        } catch (error) {
            outputText();

            const errorText = 'I don\'t know how to do that.';

            this.exec('error ' + errorText, room, false);

            return;
        }

        const commandDisplayPromise = new Promise((resolve, reject) => {
            outputText(resolve);
        });

        commandDisplayPromise.then(() => {
            let actions = [];

            commands.forEach((command) => {
                actions = _.concat(actions, command.actions(room));
            });

            actions.forEach((action) => {
                action.run(this, this.textBuffer, room);
            });
        });
    }
}
