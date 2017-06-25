import GameAction from '../game-action';

export default class TextAction extends GameAction {
    constructor (data) {
        super(data);

        this._type = 'text';

        this._style = { fill: 'white', stroke: 'white' };

        this._font = 'rubik';
    }

    get style () { return this._style; }

    set style (style) { this._style = style; }

    get font () { return this._font; }

    set font (font) { this._font = font; }

    run (rgi, buffer, room) {
        buffer.addText(this.data, this.style, this.font);
    }
}
