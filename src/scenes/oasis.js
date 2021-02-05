import TextBuffer from '../ui/text-buffer';
import UniverseModel from '../models/universe';
import Inventory from '../objects/inventory';
import Player from '../objects/player';
import Universe from '../objects/universe';

export default class LoginScene extends Phaser.Scene {
    constructor (config, key = 'Oasis') {
        super({ key: key });
    }

    init (player_id, player_password) {
        this.textBuffer = new TextBuffer(this, 25, this.sys.game.config.height - 30);

        const player = this._setupPlayer(player_id, player_password);

        this._setupUniverse(player);
    }

    create () {
        const SECOND = 1000;

        this.add.existing(this.textBuffer);

        this.textBuffer.addText('{{readyPlayerOneLoginText}}READY PLAYER ONE');
        this.textBuffer.once('DonePrinting', () => {
            this.time.addEvent({ delay: SECOND * 3, callback: () => {
                // enter the first room
                this.textBuffer.clear();
                this.scene.start('Room');
            } });
        });
    }

    _setupPlayer(player_id, player_password) {
        const inventory = new Inventory();

        const player = new Player(player_id, inventory);

        this.events.on('shutdown', () => {
            // when we move on to the next scene store the current state of the player in the game data registry
            this.registry.set('player', player);
        });

        return player;
    }

    _setupUniverse (player) {
        const universeModel = new UniverseModel();

        const universe = new Universe(universeModel, player);

        this.events.on('shutdown', () => {
            // when we move on to the next scene store the current state of the universe in the game data registry
            this.registry.set('universe', universe);
        });

        return universe;
    }
}
