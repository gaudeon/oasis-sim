import TextBuffer from '../ui/text-buffer';
import TextInput from '../ui/text-input';
import RGI from '../objects/rgi';
import AllRooms from '../objects/all-rooms';
import AllItems from '../objects/all-items';

export default class RoomState extends Phaser.State {
    init (room = 'YourTrailerLivingRoom', lastCommand) {
        if (this.game.allItems) {
            this.allItems = this.game.allItems;
        } else {
            this.allItems = this.game.allItems = new AllItems(this.game);
        }

        if (this.game.allRooms) {
            this.allRooms = this.game.allRooms;
        } else {
            this.allRooms = this.game.allRooms = new AllRooms(this.game);
        }

        this.room = new this.allRooms.roomMap[room](this.game); // get the room object for the room we are in

        if (this.game.textBuffer) {
            this.textBuffer = this.game.textBuffer;
        } else {
            this.textBuffer = this.game.textBuffer = new TextBuffer(this.game);

            // disable text input while buffer is adding text
            this.textBuffer.events.onStartAddingLines.add(() => { this.input.enabled = false; });
            this.textBuffer.events.onDoneAddingLines.add(() => { this.input.enabled = true; });
        }

        if (this.game.textInput) {
            this.textInput = this.game.textInput;
        } else {
            this.textInput = this.game.textInput = new TextInput(this.game);
            this.textInput.events.onEnterPressed.add((text) => { this.rgi.exec(text, this.room); });
        }

        if (this.game.rgi) {
            this.rgi = this.game.rgi;
        } else {
            this.rgi = this.game.rgi = new RGI(this.textBuffer);
        }

        this.lastCommand = lastCommand;
    }

    create () {
        // reset text input timers
        this.textInput.resetTimers();

        // output the last command that lead us to this line
        if (this.lastCommand) {
            this.rgi.outputCommand(this.lastCommand);
        }

        // output brief description of room
        this.rgi.exec('brief', this.room, false);
    }
};
