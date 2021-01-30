import TextBuffer from '../ui/text-buffer';
import TextInput from '../ui/text-input';
import CommandHistory from '../engine/command-history';
import RGI from '../engine/rgi';

export default class RoomScene extends Phaser.Scene {
    constructor (config, key = 'Room') {
        super({ key: key });
    }

    init (room = '', lastCommand) {
        // load player
        if (this.registry.has('player')) {
            this.player = this.registry.get('player');
        } else {
            throw new Error("Player not found in room!");
        }

        // save the player when we change rooms
        this.events.once('shutdown', () => {
            this.registry.set('player', this.player);
        });

        // load universe
        if (this.registry.has('universe')) {
            this.universe = this.registry.get('universe');
        } else {
            throw new Error("Universe not found in room!");
        }

        // save the universe when we change rooms
        this.events.once('shutdown', () => {
            this.registry.set('universe', this.universe);
        });

        // set the starting room if we don't have one defined
        if (typeof this.universe.findRoom(room) !== 'object') { 
            room = this.universe.startingRoomId;
        }

        // retrieve the room
        this.room = this.universe.findRoom(room);

        this.textInput = new TextInput(this, 25, this.sys.game.config.height - 30);
        this.textInput.on('EnterPressed', text => { this.rgi.exec(text, this.room, this.universe, true, 'player'); });

        this.textBuffer = new TextBuffer(this, 25, this.sys.game.config.height - 30);

        // disable text input while buffer is adding text
        this.textBuffer.on('StartPrinting', () => { this.textInput.enabled = false; });
        this.textBuffer.on('DonePrinting', () => { this.textInput.enabled = true; });

        // have the text buffer shift up or down based on key inputs
        this.textInput.on('ShiftBufferUpPressed', () => { this.textBuffer.shiftBufferUp() });
        this.textInput.on('ShiftBufferDownPressed', () => { this.textBuffer.shiftBufferDown() });
        this.textInput.on('ResetBufferPressed', () => { this.textBuffer.resetBuffer() });
        this.textInput.on('GotoBufferTopPressed', () => { this.textBuffer.gotoBufferTop() });

        this.commandHistory = new CommandHistory();

        const DEBUG_RGI = false; // set to true to see command processing
        this.rgi = new RGI(this.textBuffer, this.commandHistory, DEBUG_RGI);

        this.lastCommand = lastCommand;
    }

    create () {
        this.add.existing(this.textBuffer);
        this.add.existing(this.textInput);

        this.enterRoom(this.lastCommand, this.room);
    }

    enterRoom (lastCommand, room) {
        this.room = room;

        this.lastCommand = lastCommand;

        // output the last command that lead us to this line
        if (this.lastCommand) {
            this.rgi.outputCommand(this.lastCommand);
        }

        // output look description of room
        this.rgi.exec('look', room, this.universe, false, 'room');

        this.universe.events.emit("onPlayerEnter", this.rgi, this.room, this.universe);
    }
};
