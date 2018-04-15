import Lexer from './rgi/lexer';
import Parser from './rgi/parser';
import GameAction from './game-action';

// RGI === Regular Grammar Interpreter
export default class RGI {
    constructor (buffer, debug = false) {
        this.textBuffer = buffer;
        this.scene = buffer.scene;
        this.debug = debug;
        this.lexer = new Lexer(this, debug);
        this.parser = new Parser(this, debug);
    }

    exec (command, room, player, outputCommand = true, source = 'admin') {
        let lexemePhrase;
        let commands;
        const outputText = () => {
            if (outputCommand) {
                this.outputCommand(command);
            }
        };

        if (this.debug && console) {
            console.log(`--- Start RGI Exec ---`);
            console.log(`RGI: Command: ${command}`);
            console.log(`RGI: Room: `, room);
            console.log(`RGI: Player: `, player);
        }

        try {
            lexemePhrase = this.lexer.tokenize(command, room, player, source);

            commands = this.parser.parse(lexemePhrase, source);
        } catch (error) {
            outputText();

            const errorText = 'I don\'t know how to do that.';

            this.exec('error ' + errorText, room, player, false);

            return;
        }

        let actions = [];

        commands.forEach((command) => {
            actions = _.concat(actions, command.actions(room, player, lexemePhrase));
        });

        if (this.debug && console) {
            console.log(`RGI: Processing list of commands into list of actions:`, actions);
        }

        // only output text command if we aren't moving to a new room
        if (_.findIndex(actions, (action) => { return action.type === 'change-room'; }) < 0) {
            outputText();
        }

        this.executeActions(actions, room, player, outputCommand ? command : undefined);

        if (this.debug && console) {
            console.log(`--- Finish RGI Exec ---`);
        }
    }

    // run each action in a list of game actions
    executeActions (actions, room, player, lastCommand) {
        if (!Array.isArray(actions)) {
            throw new Error('actions is not an array', actions);
        }

        actions.forEach((action) => {
            if (action instanceof Promise) {
                action.then(realAction => {
                    if (realAction instanceof GameAction) {
                        realAction.run(this, this.textBuffer, room, player, lastCommand);
                    } else {
                        throw new Error('Not a valid game action', action);
                    }
                })
            } else {
                if (action instanceof GameAction) {
                    action.run(this, this.textBuffer, room, player, lastCommand);
                } else {
                    throw new Error('Not a valid game action', action);
                }
            }
        });
    }

    outputCommand (command) {
        this.textBuffer.addText('\n{{default}}> ' + command);
    }
}
