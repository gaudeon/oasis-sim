import TextBuffer from '../ui/text-buffer';
import TextInput from '../ui/text-input';
import RGI from '../objects/rgi';
import AllRooms from '../objects/all-rooms';

export default class RoomState extends Phaser.State {
    init (room = 'WadesTrailerLaundryRoom', lastCommand) {
        this.allRooms = new AllRooms(this.game);
        this.room = this.allRooms.roomMap[room];

        if (this.game.buffer) {
            this.buffer = this.game.buffer;
        } else {
            this.buffer = this.game.buffer = new TextBuffer(this.game);
        }

        this.rgi = new RGI(this.buffer);

        this.lastCommand = lastCommand;
    }

    create () {
        this.input = new TextInput(this.game);
        this.input.events.onEnterPressed.add((text) => { this.rgi.exec(text, this.room); });
        this.game.add.existing(this.input);

        // disable text input while buffer is adding text
        this.buffer.events.onStartAddingLines.add(() => { this.input.enabled = false; });
        this.buffer.events.onDoneAddingLines.add(() => { this.input.enabled = true; });

        // output the last command that lead us to this line
        if (this.lastCommand) {
            this.rgi.outputCommand(this.lastCommand);
        }

        // output brief description of room
        this.rgi.exec('brief', this.room, false);
    }
};
