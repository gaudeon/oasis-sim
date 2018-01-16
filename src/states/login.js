import TextBuffer from '../ui/text-buffer';
import TextInput from '../ui/text-input'

export default class LoginState extends Phaser.State {
    init () {
        this.state = 'INIT';

        this.textBuffer = new TextBuffer(this.game);
        this.textInput = new TextInput(this.game);
    }

    preload () {
    }

    create () {
        // reset text input timers
        this.textInput.resetTimers();
        this.textInput.kill();
        this.textBuffer.add('Initiating Login Sequences…');
    }

    update () {
        switch (this.state) {
            case 'INIT':
                //this.textBuffer.add('Initiating Login Sequences…');
                this.state = 'INIT_WAITING';
                break;
        }
    }
};
