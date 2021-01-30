import CommandHistory from '../engine/command-history';
import AllTextStyles from './all-text-styles';
import colors from '../config/colors.json';

export default class TextInput extends Phaser.GameObjects.Container {
    constructor (scene, x = 0, y = 0) {
        super(scene);

        this.x = x;
        this.y = y;

        // font styling
        this._allTextStyles = new AllTextStyles();
        this._defaultStyle = this._allTextStyles.defaultStyle.toPhaserTextStyle();
        this._lineSpacingRatio = 1.5;
        this._defaultStyle.lineSpacing = this._defaultStyle.fontSize * this._lineSpacingRatio;

        // our private data
        this._inputIndicator = '> ';
        this._cursorIndicator = '_';
        this._cursorVisible = true;
        this._cursorBlinkWait = 1000;
        this._cursorBlinkTime = 0;

        // our public attributes
        this._passwordMode = false;
        this._enabled = true;

        // hidden input
        this.hiddenInput = new Phaser.GameObjects.Text(scene);

        // background
        this.inputBackground = new Phaser.GameObjects.Graphics(scene);
        this.inputBackground.fillStyle(colors.Black.int, 1);
        this.inputBackground.fillRect(0, 0, this.scene.sys.game.config.width, this.scene.sys.game.config.height);
        this.add(this.inputBackground);

        // text input
        this.textInput = new Phaser.GameObjects.Text(scene);
        this.add(this.textInput);

        // text cursor
        this.textCursor = new Phaser.GameObjects.Text(scene);
        this.add(this.textCursor);

        this.updateTextStyle();

        // command history
        const HISTORY_LIMIT = 20;
        this._commandHistory = this.commandHistory = new CommandHistory(HISTORY_LIMIT);

        // other character key presses can be handle with a callback
        this.scene.input.keyboard.on('keydown', ev => this.keyPress(ev.key, ev));

        this.resetInput();
    }

    updateTextStyle() {
        [this.textCursor, this.hiddenInput, this.textInput].forEach(txt => txt.setStyle(this._defaultStyle));
    }

    get enabled () { return this._enabled; }

    set enabled (bool) { this._enabled = !!bool; }

    get children () { return this.getAll(); }

    get history () { return this._commandHistory; }

    isDeleteKey (keyCode) {
        return keyCode === Phaser.Input.Keyboard.KeyCodes.DELETE || keyCode === Phaser.Input.Keyboard.KeyCodes.BACKSPACE;
    }

    isLeftKey (keyCode) {
        return keyCode === Phaser.Input.Keyboard.KeyCodes.LEFT;
    }

    isRightKey (keyCode) {
        return keyCode === Phaser.Input.Keyboard.KeyCodes.RIGHT;
    }

    isPageUpKey (keyCode) {
        return keyCode === Phaser.Input.Keyboard.KeyCodes.PAGE_UP;
    }

    isPageDownKey (keyCode) {
        return keyCode === Phaser.Input.Keyboard.KeyCodes.PAGE_DOWN;
    }

    isHomeKey (keyCode) {
        return keyCode === Phaser.Input.Keyboard.KeyCodes.HOME;
    }

    isEndKey (keyCode) {
        return keyCode === Phaser.Input.Keyboard.KeyCodes.END;
    }

    isUpKey (keyCode) {
        return keyCode === Phaser.Input.Keyboard.KeyCodes.UP;
    }

    isDownKey (keyCode) {
        return keyCode === Phaser.Input.Keyboard.KeyCodes.DOWN;
    }

    isEnterKey (keyCode) {
        return keyCode === Phaser.Input.Keyboard.KeyCodes.ENTER;
    }

    isTextKey (keyCode) {
        return keyCode === Phaser.Input.Keyboard.KeyCodes.SPACE || (keyCode >= Phaser.Input.Keyboard.KeyCodes.ZERO && keyCode < Phaser.Input.Keyboard.KeyCodes.Z);
    }

    get lineHeight () { return this._fontSize * this._lineSpacingRatio; }

    get textOutput () { 
        let inputValue = this._inputValue;

        if (this.passwordMode) {
            inputValue = _.repeat('*', this._inputValue.length);
        }

        return this._inputIndicator + inputValue;
    }

    get hiddenOutput () {
        let text = this.textOutput;

        if (this._cursorPosition === -1) {
            return text;
        }

        return text.substring(0, this._cursorPosition);
    }

    get cursorOutput () {
        return this._enabled && this._cursorVisible ? this._cursorIndicator : '';
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
            let keyCode = ev.keyCode;

            if (this.isEnterKey(keyCode)) {
                if (!this._inputValue.match(/^[\s\n\r]*$/)) {
                    this._inputValue = this._inputValue.replace(/[\n\r]/, '');

                    this._commandHistory.add(this._inputValue);

                    this.emit('EnterPressed', this._inputValue, this);
                }

                this.resetInput();
            } else if (this.isTextKey(keyCode)) { 
                if (this._cursorPosition <= -1) { // insert at end of text
                    this._inputValue = this._inputValue + chr;
                } else if (this._cursorPosition - this._inputIndicator.length === 0) { // insert at beginning of text
                    this._inputValue = chr + this._inputValue;
                } else { // insert in middle of text
                    let pos = this._cursorPosition - this._inputIndicator.length;
                    let text = this._inputValue;

                    this._inputValue = text.substring(0, pos) + chr + text.substring(pos, text.length);
                }
            } else if (this.isDeleteKey(keyCode)) {
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
            } else if (this.isLeftKey(keyCode)) {
                if (this._cursorPosition <= -1) {
                    this._cursorPosition = this.textOutput.length - 1;
                } else {
                    this._cursorPosition = this._cursorPosition - 1;

                    if (this._cursorPosition < this._inputIndicator.length) {
                        this._cursorPosition = this._inputIndicator.length;
                    }
                }
            } else if (this.isRightKey(keyCode) && this._cursorPosition >= 0) {
                if (this._cursorPosition + 1 >= this.textOutput.length) {
                    this._cursorPosition = -1;
                } else {
                    this._cursorPosition++;
                }
            } else if (this.isPageUpKey(keyCode)) {
                 this.emit('ShiftBufferUpPressed', this._inputValue, this);
            } else if (this.isPageDownKey(keyCode)) {
                 this.emit('ShiftBufferDownPressed', this._inputValue, this);
            } else if (this.isHomeKey(keyCode)) {
                 this.emit('ResetBufferPressed', this._inputValue, this);
            } else if (this.isEndKey(keyCode)) {
                 this.emit('GotoBufferTopPressed', this._inputValue, this);
            } else if (this._commandHistory.length && this.isUpKey(keyCode) && this._commandHistoryIndex > 0) {
                    this._commandHistoryIndex--;
                    this.resetInput(this._commandHistory.history[this._commandHistoryIndex], this._commandHistoryIndex);
            } else if (this._commandHistory.length && this.isDownKey(keyCode) && this._commandHistoryIndex < this._commandHistory.length) {
                this._commandHistoryIndex++;
                if (this._commandHistoryIndex === this._commandHistory.length) {
                    this.resetInput();
                } else {
                    this.resetInput(this._commandHistory.history[this._commandHistoryIndex], this._commandHistoryIndex);
                }
            }
        }
    }

    kill () {
        this.enabled = false;
        this.setActive(false);
        this.setVisible(false);
    }

    revive () {
        this.enabled = true;
        this.setActive(true);
        this.setVisible(true);
    }

    preUpdate (time, delta) {
        // make the cursor blink
        this._cursorBlinkTime += delta;
        if (this._cursorBlinkTime > this._cursorBlinkWait) {
            this.toggleCursor();
            this._cursorBlinkTime = 0;
        }

        this.hiddenInput.setText(this.hiddenOutput);

        this.textCursor.setPosition(this.cursorPosition, 0);
        this.textCursor.setText(this.cursorOutput);

        this.textInput.setText(this.textOutput);
    }
}
