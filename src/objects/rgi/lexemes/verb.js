export default class Verb {
    constructor () {
        this._buffer = null;
        this._room = null;
        this._word = null; // each child should set their word
        this._aliases = null; // set aliases list for multiple aliases otherwise default to word
    }

    setContext (textBuffer, currentRoom) {
        this.buffer = textBuffer;
        this.room = currentRoom;
    }

    get buffer () { return this._buffer; }

    get room () { return this._room; }

    get word () { return this._word; }

    get aliases () { return Object.assign([], [this._word], this._aliases || []); }

    exec () {
        if (typeof this.buffer === 'undefined') {
            throw new Error('Text Buffer is not defined.');
        }

        if (typeof this.room === 'undefined') {
            throw new Error('Current room is not defined.')
        }

        if (typeof this.word === 'undefined') {
            throw new Error('Current word is not defined.');
        }
    }
}
