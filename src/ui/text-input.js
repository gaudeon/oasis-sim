import CommandHistory from '../engine/command-history';

export default class TextInput extends Phaser.GameObjects.Container {
    constructor (scene, x = 0, y = 0) {
        super(scene);

        this.x = x;
        this.y = y;

        // our data
        this._fontSize = 20;
        this._lineSpacingRatio = 1.5;
        this._inputIndicator = '> ';
        this._cursorVisible = true;
        this._enabled = true;

        // text cursor
        this.textCursor = new Phaser.GameObjects.Text(scene);
        this.textCursor.fontSize = this._fontSize;
        this.textCursor.fill = 'white';
        this.textCursor.stroke = 'white';
        this.textCursor.lineSpacing = this._fontSize * this._lineSpacingRatio;
        this.add(this.textCursor);

        // hidden input
        this.hiddenInput = new Phaser.GameObjects.Text(scene);
        this.hiddenInput.fontSize = this._fontSize;
        this.hiddenInput.fill = 'white';
        this.hiddenInput.stroke = 'white';
        this.hiddenInput.lineSpacing = this._fontSize * this._lineSpacingRatio;

        // text input
        this.textInput = new Phaser.GameObjects.Text(scene);
        this.textInput.fontSize = this._fontSize;
        this.textInput.fill = 'white';
        this.textInput.stroke = 'white';
        this.textInput.lineSpacing = this._fontSize * this._lineSpacingRatio;
        this.add(this.textInput);

        // command history
        const HISTORY_LIMIT = 20;
        this._commandHistory = this.commandHistory = new CommandHistory(HISTORY_LIMIT);

        // capture delete, backspace and arrow keys
        this.scene.input.keyboard.addKeyCapture([
            Phaser.Input.Keyboard.KeyCodes.DELETE,
            Phaser.Input.Keyboard.KeyCodes.BACKSPACE,
            Phaser.Input.Keyboard.KeyCodes.UP,
            Phaser.Input.Keyboard.KeyCodes.DOWN,
            Phaser.Input.Keyboard.KeyCodes.LEFT,
            Phaser.Input.Keyboard.KeyCodes.RIGHT
        ]);

        this.specialKeys = this.scene.input.keyboard.addKeys({
            del: Phaser.Input.Keyboard.KeyCodes.DELETE,
            bs: Phaser.Input.Keyboard.KeyCodes.BACKSPACE,
            up: Phaser.Input.Keyboard.KeyCodes.UP,
            down: Phaser.Input.Keyboard.KeyCodes.DOWN,
            left: Phaser.Input.Keyboard.KeyCodes.LEFT,
            right: Phaser.Input.Keyboard.KeyCodes.RIGHT
        });

        // map special keys by keyCode from special key validation tests
        this.specialKeysMap = {};
        Object.keys(this.specialKeys).forEach(key => { this.specialKeys[key].keyCode = key });

        // other character key presses can be handle with a callback
        this.scene.input.keyboard.on('keydown', ev => this.keyPress(ev.key, ev));

        this.resetInput();
    }

    get children () { return this.getAll(); }

    get history () { return this._commandHistory; }

    isTextKey (keyCode) {
        if (this.specialKeysMap[keyCode]) {
            return false;
        }

        if (keyCode < 48) { // ! == 48
            return false;
        }

        if (keyCode >= 112 && keyCode <= 123) { // F keys
            return false;
        }

        return true;
    }

    resetTimers () {
        const SECOND = 1000;

        if (this.toggleCursorTimer && this.toggleCursorTimer.remove) {
            this.toggleCursorTimer.remove(false);
        }
        this.toggleCursorTimer = this.scene.time.addEvent({ delay: SECOND * 0.5, callback: this.toggleCursor, callbackScope: this, loop: true });

        if (this.checkForSpecialKeysTimer && this.checkForSpecialKeysTimer.remove) {
            this.checkForSpecialKeysTimer.remove(false);
        }
        this.checkForSpecialKeysTimer = this.scene.time.addEvent({ delay: SECOND * 0.1, callback: this.checkForSpecialKeys, callbackScope: this, loop: true });
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
            if (ev.keyCode === 13) {
                if (!this._inputValue.match(/^[\s\n\r]*$/)) {
                    this._inputValue = this._inputValue.replace(/[\n\r]/, '');

                    this._commandHistory.add(this._inputValue);

                    this.emit('EnterPressed', this._inputValue, this);
                }

                this.resetInput();
            } else if (this.isTextKey(ev.keyCode)) { // ignore delete / backspace
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

    kill () {
        this.setActive(false);
        this.setVisible(false);
    }

    revive () {
        this.setActive(true);
        this.setVisible(true);
    }

    preUpdate () {
        this.hiddenInput.setText(this.hiddenOutput);
        this.textCursor.setPosition(this.cursorPosition, 0);
        this.textCursor.setText(this.cursorOutput);
        this.textInput.setText(this.textOutput);
    }
}
