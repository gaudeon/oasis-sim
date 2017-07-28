import TextBuffer from '../ui/text-buffer';
import TextInput from '../ui/text-input';
import RGI from '../objects/rgi';
import AllRooms from '../objects/all-rooms';
import AllItems from '../objects/all-items';
import Player from '../objects/player';

export default class RoomState extends Phaser.State {
    init (room = 'YourTrailerLivingRoom', lastCommand) {
        if (this.game.player) {
            this.player = this.game.player;
        } else {
            this.player = this.game.player = new Player(this.game);
        }

        if (this.game.allItems) {
            this.allItems = this.game.allItems;
        } else {
            this.allItems = this.game.allItems = new AllItems(this.game);
        }

        // retrieve or setup a data structure to track the change in state of the rooms as the game progresses
        if (this.game.visitedRooms) {
            this.visitedRooms = this.game.visitedRooms;
        } else {
            this.visitedRooms = this.game.visitedRooms = {};
        }

        if (this.game.allRooms) {
            this.allRooms = this.game.allRooms;
        } else {
            this.allRooms = this.game.allRooms = new AllRooms(this.game);
        }

        if (this.visitedRooms[room]) {
            this.room = this.visitedRooms[room];
        } else {
            this.room = new this.allRooms.roomMap[room](this.game);
            this.visitedRooms[room] = this.room;
        }

        if (this.game.textBuffer) {
            this.textBuffer = this.game.textBuffer;
        } else {
            this.textBuffer = this.game.textBuffer = new TextBuffer(this.game);

            // disable text input while buffer is adding text
            this.textBuffer.events.onStartAddingLines.add(() => { this.input.enabled = false; });
            this.textBuffer.events.onDoneAddingLines.add(() => { this.input.enabled = true; });
        }

        if (this.game.rgi) {
            this.rgi = this.game.rgi;
        } else {
            const DEBUG_RGI = false; // set to true to see command processing
            this.rgi = this.game.rgi = new RGI(this.textBuffer, DEBUG_RGI);
        }

        if (this.game.textInput) {
            this.textInput = this.game.textInput;
        } else {
            this.textInput = this.game.textInput = new TextInput(this.game);
            this.textInput.events.onEnterPressed.add((text) => { this.rgi.exec(text, this.room, this.player, true, 'player'); });
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
        this.rgi.exec('brief', this.room, this.player, false, 'player');
    }
};
