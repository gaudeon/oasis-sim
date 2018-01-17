import CommandHistory from '../objects/command-history';

export default class TextInput extends Phaser.Group {
    constructor (game) {
        super(game);

        // our data
        this._fontSize = 20;
        this._lineSpacingRatio = 1.5;
        this._inputIndicator = '> ';
        this._cursorVisible = true;
        this._enabled = true;

        // text cursor
        this.textCursor = new Phaser.Text(game);
        this.textCursor.fontSize = this._fontSize;
        this.textCursor.fill = 'white';
        this.textCursor.stroke = 'white';
        this.textCursor.lineSpacing = this._fontSize * this._lineSpacingRatio;
        this.add(this.textCursor);

        // hidden input
        this.hiddenInput = new Phaser.Text(game);
        this.hiddenInput.fontSize = this._fontSize;
        this.hiddenInput.fill = 'white';
        this.hiddenInput.stroke = 'white';
        this.hiddenInput.lineSpacing = this._fontSize * this._lineSpacingRatio;

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
        this.events = this.events || new Phaser.Events();
        this.events.onEnterPressed = new Phaser.Signal();

        // command history
        const HISTORY_LIMIT = 20;
        this._commandHistory = this.game.commandHistory = new CommandHistory(HISTORY_LIMIT);

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

        this.resetInput();
    }

    get history () { return this._commandHistory; }

    resetTimers () {
        this.game.time.events.loop(Phaser.Timer.SECOND * 0.5, this.toggleCursor, this);

        this.game.time.events.loop(Phaser.Timer.SECOND * 0.1, this.checkForSpecialKeys, this);
    }

    get lineSpacingRatio () { return this._lineSpacingRatio; }

    set lineSpacingRatio (ratio) { this._lineSpacingRatio = ratio; }

    get lineHeight () { return this._fontSize * this._lineSpacingRatio; }

    get textOutput () { return this._inputIndicator + this._inputValue; }

    get hiddenOutput () {
        let text = this.textOutput;

        if (this._cursorPosition === -1) {
            return text;
        }

        return text.substring(0, this._cursorPosition);
    }

    get cursorOutput () {
        return this._enabled && this._cursorVisible ? '_' : '';
    }

    get cursorPosition () {
        return this.hiddenInput.width;
    }

    get enabled () { return this._enabled; }

    set enabled (enable) { this._enabled = enable; }

    toggleCursor () { this._cursorVisible = !this._cursorVisible; }

    resetInput (text = '', commandHistoryIndex = this._commandHistory.length) {
        this._inputValue = text;

        this._cursorPosition = -1;

        this._commandHistoryIndex = commandHistoryIndex;
    }

    keyPress (chr, ev) {
        if (this._enabled) {
            if (ev.charCode === 13) {
                if (!this._inputValue.match(/^[\s\n\r]*$/)) {
                    this._inputValue = this._inputValue.replace(/[\n\r]/, '');

                    this._commandHistory.add(this._inputValue);

                    this.events.onEnterPressed.dispatch(this._inputValue);
                }

                this.resetInput();
            } else {
                if (this._cursorPosition <= -1) { // insert at end of text
                    this._inputValue = this._inputValue + chr;
                } else if (this._cursorPosition - this._inputIndicator.length === 0) { // insert at beginning of text
                    this._inputValue = chr + this._inputValue;
                } else { // insert in middle of text
                    let pos = this._cursorPosition - this._inputIndicator.length;
                    let text = this._inputValue;

                    this._inputValue = text.substring(0, pos) + chr + text.substring(pos, text.length);
                }
            }
        }
    }

    checkForSpecialKeys () {
        // delete characters
        if (this._enabled) {
            if (this.specialKeys.del.isDown || this.specialKeys.bs.isDown) {
                if (this._cursorPosition <= -1) {
                    this._inputValue = this._inputValue.substr(0, this._inputValue.length - 1);
                } else if (this._cursorPosition - this._inputIndicator.length === 0) {
                    this._inputValue = this._inputValue.substring(1, this._inputValue.length);
                } else {
                    let pos = this._cursorPosition - this._inputIndicator.length;
                    let text = this._inputValue;

                    this._inputValue = text.substring(0, pos) + text.substring(pos + 1, text.length);
                    this._cursorPosition--;
                }

                 if (this._cursorPosition - this._inputIndicator.length >= this._inputValue.length) {
                     this._cursorPosition = -1;
                 }
            }

            if (this.specialKeys.left.isDown) {
                if (this._cursorPosition <= -1) {
                    this._cursorPosition = this.textOutput.length - 1;
                } else {
                    this._cursorPosition = this._cursorPosition - 1;

                    if (this._cursorPosition < this._inputIndicator.length) {
                        this._cursorPosition = this._inputIndicator.length;
                    }
                }
            }

            if (this.specialKeys.right.isDown && this._cursorPosition >= 0) {
                if (this._cursorPosition + 1 >= this.textOutput.length) {
                    this._cursorPosition = -1;
                } else {
                    this._cursorPosition++;
                }
            }

            if (this._commandHistory.length) {
                if (this.specialKeys.up.isDown && this._commandHistoryIndex > 0) {
                    this._commandHistoryIndex--;
                    this.resetInput(this._commandHistory.history[this._commandHistoryIndex], this._commandHistoryIndex);
                } else if (this.specialKeys.down.isDown && this._commandHistoryIndex < this._commandHistory.length) {
                    this._commandHistoryIndex++;
                    if (this._commandHistoryIndex === this._commandHistory.length) {
                        this.resetInput();
                    } else {
                        this.resetInput(this._commandHistory.history[this._commandHistoryIndex], this._commandHistoryIndex);
                    }
                }
            }
        }
    }

    update () {
        this.hiddenInput.setText(this.hiddenOutput);
        this.textCursor.reset(this.cursorPosition, 0);
        this.textCursor.setText(this.cursorOutput);
        this.textInput.setText(this.textOutput);
    }
}
