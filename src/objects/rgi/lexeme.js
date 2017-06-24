export default class Lexeme {
    constructor () {
        this._rgi = undefined;
        this._buffer = undefined;
        this._room = undefined;
    }

    setContext (rgi, textBuffer, currentRoom) {
        this._rgi = rgi;
        this._buffer = textBuffer;
        this._room = currentRoom;
    }

    get rgi () { return this._rgi; }

    get buffer () { return this._buffer; }

    get room () { return this._room; }

    exec () {
        if (typeof this.rgi === 'undefined') {
            throw new Error('RGI is not defined.');
        }

        if (typeof this.buffer === 'undefined') {
            throw new Error('Text Buffer is not defined.');
        }

        if (typeof this.room === 'undefined') {
            throw new Error('Current room is not defined.')
        }
    }
}
