import Lexer from './rgi/lexer';
import Parser from './rgi/parser';

// RGI === Regular Grammar Interpreter
export default class RGI {
    constructor (buffer) {
        this.textBuffer = buffer;
        this.lexer = new Lexer(this);
        this.parser = new Parser(this);
    }

    exec (command, room, player, outputCommand = true) {
        let lexemePhrase;
        let commands;
        const outputText = () => {
            if (outputCommand) {
                this.outputCommand(command);
            }
        };

        try {
            lexemePhrase = this.lexer.tokenize(command, room, player);

            commands = this.parser.parse(lexemePhrase);
        } catch (error) {
            outputText();

            const errorText = 'I don\'t know how to do that.';

            this.exec('error ' + errorText, room, player, false);

            return;
        }

        let actions = [];

        commands.forEach((command) => {
            actions = _.concat(actions, command.actions(room, player));
        });

        // only output text commnad if we aren't moving to a new room
        if (_.findIndex(actions, (action) => { return action.type === 'change-room'; }) < 0) {
            outputText();
        }

        actions.forEach((action) => {
            action.run(this, this.textBuffer, room, player, outputCommand ? command : undefined);
        });
    }

    outputCommand (command) {
        this.textBuffer.addText('\n> ' + command);
    }
}
