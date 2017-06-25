export default class TextInput extends Phaser.Text {
    constructor (game, x = 0, y = 0, text = '', style = {}) {
        super(game, x, y, '', style);

        this.fontSize = 20;
        this.fill = 'white';
        this.stroke = 'white';
        this._lineSpacingRatio = 1.5;
        this.lineSpacing = this.fontSize * this._lineSpacingRatio;
        this._inputIndicator = '> ';
        this._inputValue = '';
        this._cursorVisible = true;
        this._enabled = true;

        this.events.onEnterPressed = new Phaser.Signal();

        this.reset(20, this.bottomY);

        // capture delete and backspace
        this.game.input.keyboard.addKeyCapture([Phaser.KeyCode.DELETE, Phaser.KeyCode.BACKSPACE]);
        this.specialKeys = this.game.input.keyboard.addKeys({ del: Phaser.KeyCode.DELETE, bs: Phaser.KeyCode.BACKSPACE });

        // other character key presses can be handle with a callback
        this.game.input.keyboard.addCallbacks(this, null, null, this.keyPress);
    }

    resetTimers () {
        this.game.time.events.loop(Phaser.Timer.SECOND * 0.5, this.toggleCursor, this);

        this.game.time.events.loop(Phaser.Timer.SECOND * 0.1, this.checkForBackspace, this);
    }

    get lineSpacingRatio () { return this._lineSpacingRatio; }

    set lineSpacingRatio (ratio) { this._lineSpacingRatio = ratio; }

    get lineHeight () { return this.fontSize * this._lineSpacingRatio; }

    get bottomY () { return this.game.height - this.lineHeight; }

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

    checkForBackspace () {
        // delete characters
        if (this._enabled && (this.specialKeys.del.isDown || this.specialKeys.bs.isDown)) {
            this._inputValue = this._inputValue.substr(0, this._inputValue.length - 1);
        }
    }

    update () {
        this.setText(this.textOutput);
    }
}
