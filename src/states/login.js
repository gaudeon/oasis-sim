import TextBuffer from '../ui/text-buffer';
import TextLine from '../ui/text-line';
import TextInput from '../ui/text-input';
import Player from '../objects/player';

export default class LoginState extends Phaser.State {
    init () {
        // load player if not defined yet
        if (this.game.player) {
            this.player = this.game.player;
        } else {
            this.player = this.game.player = new Player();
        }

        this.state = 'PROMPT_ID';

        this.textBuffer = new TextBuffer(this.game);
        this.textInput = new TextInput(this.game);
    }

    create () {
        // reset text input timers
        this.textInput.resetTimers();
        this.textInput.kill();
    }

    update () {
        switch (this.state) {
            case 'PROMPT_ID':
                this.textBuffer.addText('{{loginText}}ENTER YOUR OASIS ID');
                this.textBuffer.events.onDonePrinting.addOnce(() => {
                    this.textInput.revive();
                    this.textInput.events.onEnterPressed.addOnce((text) => {
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
                this.textBuffer.events.onDonePrinting.addOnce(() => {
                    this.textInput.revive();
                    this.textInput.events.onEnterPressed.addOnce((text) => {
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
                this.textBuffer.events.onDonePrinting.addOnce(() => {
                    this.game.time.events.add(Phaser.Timer.SECOND * 3, () => {
                        this.textBuffer.clear();
                        this.state = 'READY_PLAYER_ONE';
                    });
                });
                this.state = 'WAITING'; // bunk state so we wait until next change
                break;

            case 'READY_PLAYER_ONE':
                this.textBuffer.addText('{{readyPlayerOneLoginText}}READY PLAYER ONE');
                this.textBuffer.events.onDonePrinting.addOnce(() => {
                    this.game.time.events.add(Phaser.Timer.SECOND * 3, () => {
                        this.textBuffer.clear();
                        this.game.state.start('Room');
                    });
                });
                this.state = 'WAITING'; // bunk state so we wait until next change
                break;
        }
    }
};
