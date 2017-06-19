import LookCommand from './commands/look';

export default class CommandParser {
    constructor (buffer) {
        this.textBuffer = buffer;
    }

    exec (command, room) {
        let words = this.parseWords(command);

        if (!words.length) { // no command found
            return;
        }

        let possibleCommands = this.findCommands(words[0]);

        if (!possibleCommands.length) { // no command found
            return;
        }

        if (possibleCommands.length === 1) {
            this.commands[possibleCommands[0]].exec(command, this.textBuffer, room);
        }
    }

    parseWords (text) {
        return text.split(/ /);
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
            look: new LookCommand()
        };
    }
}
