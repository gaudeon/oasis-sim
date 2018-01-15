import TextBuffer from '../ui/text-buffer';
import TextInput from '../ui/text-input';
import RGI from '../objects/rgi';
import Universe from '../objects/universe';
import Player from '../objects/player';

export default class RoomState extends Phaser.State {
    init (room = '', preRoomDesc = [], postRoomDesc = [], lastCommand) {
        if (this.game.universe) {
            this.universe = this.game.universe;
        } else {
            this.universe = this.game.universe = new Universe(this.game);
        }

        // load player if not defined yet
        if (this.game.player) {
            this.player = this.game.player;
        } else {
            this.player = this.game.player = new Player();
        }

        // load player avatar if not defined yet
        if (! this.player.avatar) {
            this.player.loadAvatar(this.universe);
        }

        if (typeof this.universe.rooms[room] !== 'object') { // set the starting room if we don't have one defined
            room = this.universe.startingRoomId;
        }

        // retrieve the room
        this.room = this.universe.rooms[room];

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

        this.preRoomDesc = preRoomDesc;

        this.postRoomDesc = postRoomDesc;

        this.lastCommand = lastCommand;
    }

    create () {
        // reset text input timers
        this.textInput.resetTimers();

        // output the last command that lead us to this line
        if (this.lastCommand) {
            this.rgi.outputCommand(this.lastCommand);
        }

        // run actions prior to look (preRoomDesc)
        this.rgi.executeActions(this.preRoomDesc, this.room, this.player);

        // output look description of room
        this.rgi.exec('look', this.room, this.player, false, 'player');

        // run actions after look (postRoomDesc)
        this.rgi.executeActions(this.postRoomDesc, this.room, this.player);
    }
};
