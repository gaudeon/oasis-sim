export default class Verb {
    constructor () {
        this._buffer = undefined;
        this._room = undefined;
        this._word = undefined; // each child should set their word
        this._aliases = []; // set aliases list for multiple aliases otherwise default to word
    }

    setContext (textBuffer, currentRoom) {
        this._buffer = textBuffer;
        this._room = currentRoom;
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
