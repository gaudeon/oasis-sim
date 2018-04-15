import TextBuffer from '../ui/text-buffer';
import TextLine from '../ui/text-line';
import TextInput from '../ui/text-input';
import Player from '../objects/player';

export default class LoginScene extends Phaser.Scene {
    constructor (config, key = 'Login') {
        super({ key: key });
    }

    init () {
        this.player = new Player();

        this.events.on('shutdown', () => {
            // when we move on to the next scene store the current state of the player in the game data registry
            this.registry.set('player', this.player);
        });

        this.state = 'PROMPT_ID';

        this.textBuffer = new TextBuffer(this, 25, this.sys.game.config.height - 30);

        this.textInput = new TextInput(this, 25, this.sys.game.config.height - 30);
    }

    create () {
        this.add.existing(this.textBuffer);
        this.add.existing(this.textInput);

        // reset text input timers
        this.textInput.resetTimers();
        this.textInput.kill();
    }

    update () {
        const SECOND = 1000;

        switch (this.state) {
            case 'PROMPT_ID':
                this.textBuffer.addText('{{loginText}}ENTER YOUR OASIS ID');
                this.textBuffer.once('DonePrinting', () => {
                    this.textInput.revive();
                    this.textInput.once('EnterPressed', (text) => {
                        this.textInput.kill();
                        this.player.id = text;
                        this.textBuffer.clear();
                        this.state = 'PROMPT_PASSWORD';
                    });
                });
                this.state = 'WAITING'; // bunk state so we wait until next change
                break;

            case 'PROMPT_PASSWORD':
                this.textBuffer.addText('{{loginText}}ENTER YOUR PASSWORD');
                this.textBuffer.once('DonePrinting', () => {
                    this.textInput.revive();
                    this.textInput.once('EnterPressed', (text) => {
                        this.textInput.kill();
                        this.player.password = text;
                        this.textBuffer.clear();
                        this.state = 'VERIFY_ID';
                    });
                });
                this.state = 'WAITING'; // bunk state so we wait until next change
                break;

            case 'VERIFY_ID':
                this.textBuffer.addText('{{loginText}}IDENTIFY VERIFICATION SUCCESSFUL');
                this.textBuffer.addText('{{loginText}}WELCOME TO THE OASIS ' + this.player.id.toUpperCase());
                this.textBuffer.addText('{{loginText}}LOGIN COMPLETED');
                this.textBuffer.addText('{{loginText}}07:53:21 OST 02-10-2045');
                this.textBuffer.once('DonePrinting', () => {
                    this.time.addEvent({ delay: SECOND * 3, callback: () => {
                        this.textBuffer.clear();
                        this.state = 'READY_PLAYER_ONE';
                    } });
                });
                this.state = 'WAITING'; // bunk state so we wait until next change
                break;

            case 'READY_PLAYER_ONE':
                this.textBuffer.addText('{{readyPlayerOneLoginText}}READY PLAYER ONE');
                this.textBuffer.once('DonePrinting', () => {
                    this.time.addEvent({ delay: SECOND * 3, callback: () => {
                        this.textBuffer.clear();
                        this.scene.start('Room');
                    } });
                });
                this.state = 'WAITING'; // bunk state so we wait until next change
                break;
        }
    } 
}
