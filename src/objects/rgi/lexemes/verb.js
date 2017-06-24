import Lexeme from '../lexeme';

export default class Verb extends Lexeme {
    constructor () {
        super();
        this._word = undefined; // each child should set their word
        this._stringData = '';
        this._aliases = []; // set aliases list for multiple aliases otherwise default to word
    }

    get word () { return this._word; }

    get aliases () { return Object.assign([], [this._word], this._aliases || []); }

    set stringData (str) { this._stringData = str; }

    get stringData () { return this._stringData; }

    exec () {
        super.exec();

        if (typeof this.word === 'undefined') {
            throw new Error('Current word is not defined.');
        }
    }
}
