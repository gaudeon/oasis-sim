import Lexer from './rgi/lexer';
import Parser from './rgi/parser';
import GameAction from './game-action';

// RGI === Regular Grammar Interpreter
export default class RGI {
    constructor (buffer, playerCommandHistory, debug = false) {
        this.textBuffer = buffer;
        this.scene = buffer.scene;
        this.playerCommandHistory = playerCommandHistory;
        this.debug = debug;
        this.lexer = new Lexer(this, debug);
        this.parser = new Parser(this, debug);
    }

    exec (command, room, universe, outputCommand = true, source = 'admin') {
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
            console.log(`RGI: `, this);
            console.log(`RGI: Room: `, room);
            console.log(`RGI: Universe: `, universe);
        }

        try {
            lexemePhrase = this.lexer.tokenize(command, room, universe, source);

            commands = this.parser.parse(lexemePhrase, source);
        } catch (error) {
            outputText();

            let errorText = 'I don\'t know how to do that.';

            if (this.debug && console) {
                errorText += ` ${error}`;
            }

            this.exec('error ' + errorText, room, universe, false);

            return;
        }

        // track player commands
        if (source === 'player') {
            this.playerCommandHistory.add(command);
        }

        let actions = [];

        commands.forEach((command) => {
            actions = _.concat(actions, command.actions(this, room, universe, lexemePhrase));
        });

        if (this.debug && console) {
            console.log(`RGI: Processing list of commands into list of actions:`, actions);
        }

        // only output text command if we aren't moving to a new room
        if (_.findIndex(actions, (action) => { return action.type === 'change-room'; }) < 0) {
            outputText();
        }

        this.executeActions(actions, room, universe, outputCommand ? command : undefined);

        if (this.debug && console) {
            console.log(`--- Finish RGI Exec ---`);
        }
    }

    // run each action in a list of game actions
    executeActions (actions, room, universe, lastCommand) {
        if (!Array.isArray(actions)) {
            throw new Error('actions is not an array', actions);
        }

        actions.forEach((action) => {
            this.executeAction(action, room, universe, lastCommand);
        });
    }

    executeAction (action, room, universe, lastCommand) {
        if (this.debug && console) {
            console.log(`--- Start RGI Execute Action ---`);
            console.log(`Execute Action action: `, action);
            console.log(`Execute Action room: `, room);
            console.log(`Execute Action universe: `, universe);
            console.log(`Execute Action lastCommand: `, lastCommand);
        }

        if (action instanceof Promise) {
            action.then(realAction => {
                if (realAction instanceof GameAction) {
                    realAction.run(this, this.textBuffer, room, universe, lastCommand);
                } else {
                    throw new Error('Not a valid game action', action);
                }
            })
        } else {
            if (action instanceof GameAction) {
                action.run(this, this.textBuffer, room, universe, lastCommand);
            } else {
                console.log(action);
                throw new Error('Not a valid game action');
            }
        }

        if (this.debug && console) {
            console.log(`--- End RGI executeAction ---`);
        }
    }

    outputCommand (command) {
        this.textBuffer.addText('\n\n{{default}}> ' + command);
    }
}
