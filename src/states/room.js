import Map from '../objects/map';
import TextBuffer from '../ui/text-buffer';
import TextInput from '../ui/text-input';
import CommandParser from '../objects/command-parser';

export default class RoomState extends Phaser.State {
    init () {
        this.map = this.game.map = this.game.map || new Map();
        this.buffer = this.game.buffer = this.game.buffer || new TextBuffer(this.game);
        this.parser = new CommandParser(this.buffer);
    }

    create () {
        this.input = new TextInput(this.game);
        this.input.events.onEnterPressed.add((text) => { this.parser.exec(text, this.map.currentRoom, this.buffer) });
        this.game.add.existing(this.input);

        // disable text input while buffer is adding text
        this.buffer.events.onStartAddingLines.add(() => { this.input.enabled = false; });
        this.buffer.events.onDoneAddingLines.add(() => { this.input.enabled = true; });

        // call a look command
        this.parser.exec('look', this.map.currentRoom);
    }
};
