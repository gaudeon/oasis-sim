export default class TextInput extends Phaser.Group {
    constructor (game) {
        super(game);

        // our data
        this._fontSize = 20;
        this._lineSpacingRatio = 1.5;
        this._inputIndicator = '> ';
        this._inputValue = '';
        this._cursorVisible = true;
        this._enabled = true;

        // text input
        this.textInput = new Phaser.Text(game);
        this.textInput.fontSize = this._fontSize;
        this.textInput.fill = 'white';
        this.textInput.stroke = 'white';
        this.textInput.lineSpacing = this._fontSize * this._lineSpacingRatio;
        this.add(this.textInput);

        // reset position to bottom
        this.x = 25;
        this.y = this.game.height - 30;

        // events
        this.events = this.events || {};
        this.events.onEnterPressed = new Phaser.Signal();

        // capture delete, backspace and arrow keys
        this.game.input.keyboard.addKeyCapture([
            Phaser.KeyCode.DELETE,
            Phaser.KeyCode.BACKSPACE,
            Phaser.KeyCode.UP,
            Phaser.KeyCode.DOWN,
            Phaser.KeyCode.LEFT,
            Phaser.KeyCode.RIGHT
        ]);

        this.specialKeys = this.game.input.keyboard.addKeys({
            del: Phaser.KeyCode.DELETE,
            bs: Phaser.KeyCode.BACKSPACE,
            up: Phaser.KeyCode.UP,
            down: Phaser.KeyCode.DOWN,
            left: Phaser.KeyCode.LEFT,
            right: Phaser.KeyCode.RIGHT
        });

        // other character key presses can be handle with a callback
        this.game.input.keyboard.addCallbacks(this, null, null, this.keyPress);
    }

    resetTimers () {
        this.game.time.events.loop(Phaser.Timer.SECOND * 0.5, this.toggleCursor, this);

        this.game.time.events.loop(Phaser.Timer.SECOND * 0.1, this.checkForSpecialKeys, this);
    }

    get lineSpacingRatio () { return this._lineSpacingRatio; }

    set lineSpacingRatio (ratio) { this._lineSpacingRatio = ratio; }

    get lineHeight () { return this._fontSize * this._lineSpacingRatio; }

    get textOutput () { return this._inputIndicator + this._inputValue + (this._cursorVisible && this._enabled ? '_' : ''); }

    get enabled () { return this._enabled; }

    set enabled (enable) { this._enabled = enable; }

    toggleCursor () { this._cursorVisible = !this._cursorVisible; }

    keyPress (chr, ev) {
        if (this._enabled) {
            if (chr.match(/^[\w ]$/)) {
                this._inputValue = this._inputValue + chr;
            } else if (ev.charCode === 13) {
                this.events.onEnterPressed.dispatch(this._inputValue);

                this._inputValue = '';
            }
        }
    }

    checkForSpecialKeys () {
        // delete characters
        if (this._enabled) {
            if (this.specialKeys.del.isDown || this.specialKeys.bs.isDown) {
                 this._inputValue = this._inputValue.substr(0, this._inputValue.length - 1);
            }
        }
    }

    update () {
        this.textInput.setText(this.textOutput);
    }
}
