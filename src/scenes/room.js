import TextBuffer from '../ui/text-buffer';
import TextInput from '../ui/text-input';
import RGI from '../engine/rgi';
import Universe from '../objects/universe';

export default class RoomScene extends Phaser.Scene {
    constructor (config, key = 'Room') {
        super({ key: key });
    }

    init (room = '', preRoomDesc = [], postRoomDesc = [], lastCommand) {
        if (this.registry.has('universe')) {
            this.universe = this.registry.get('universe');
        } else {
            this.universe = new Universe(this);
            this.registry.set('universe', this.universe);
        }

        // save the universe when we change rooms
        this.events.once('shutdown', () => {
            this.registry.set('universe', this.universe);
        });

        // load player if not defined yet
        if (this.registry.has('player')) {
            this.player = this.registry.get('player');
        } else {
            throw new Error("Player not found in room!");
        }

        // save the player when we change rooms
        this.events.once('shutdown', () => {
            this.registry.set('player', this.player);
        });

        // load player avatar if not defined yet
        if (! this.player.avatar) {
            this.player.loadAvatar(this.universe);
        }

        if (typeof this.universe.rooms[room] !== 'object') { // set the starting room if we don't have one defined
            room = this.universe.startingRoomId;
        }

        // retrieve the room
        this.room = this.universe.rooms[room];

        this.textInput = new TextInput(this, 25, this.sys.game.config.height - 30);
        this.textInput.on('EnterPressed', text => { this.rgi.exec(text, this.room, this.player, true, 'player'); });

        this.textBuffer = new TextBuffer(this, 25, this.sys.game.config.height - 30);

        // disable text input while buffer is adding text
        this.textBuffer.on('StartPrinting', () => { this.input.enabled = false; });
        this.textBuffer.on('DonePrinting', () => { this.input.enabled = true; });

        const DEBUG_RGI = false; // set to true to see command processing
        this.rgi = new RGI(this.textBuffer, DEBUG_RGI);

        this.preRoomDesc = preRoomDesc;

        this.postRoomDesc = postRoomDesc;

        this.lastCommand = lastCommand;
    }

    create () {
        this.add.existing(this.textBuffer);
        this.add.existing(this.textInput);

        // reset text input timers
        this.textInput.resetTimers();

        // output the last command that lead us to this line
        if (this.lastCommand) {
            this.rgi.outputCommand(this.lastCommand);
        }

        // run actions prior to look (preRoomDesc)
        this.rgi.executeActions(this.preRoomDesc, this.room, this.player);

        // output look description of room
        this.rgi.exec('look', this.room, this.player, false, 'room');

        // run actions after look (postRoomDesc)
        this.rgi.executeActions(this.postRoomDesc, this.room, this.player);
    }
};
