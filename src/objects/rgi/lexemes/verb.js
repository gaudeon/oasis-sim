import Lexeme from '../lexeme';

export default class Verb extends Lexeme {
    constructor () {
        super();
        this._word = undefined; // each child should set their word
        this._stringData = '';
        this._source = undefined;
        this._aliases = []; // set aliases list for multiple aliases otherwise default to word
        this._playerCanExecute = true; // determines if a player can use this verb
    }

    get word () { return this._word; }

    get aliases () { return Object.assign([], [this._word], this._aliases || []); }

    get playerCanExecute () { return this._playerCanExecute; }

    set stringData (str) { this._stringData = str; }

    get stringData () { return this._stringData; }

    // some verbs act upon a source of some kind
    set source (src) { this._source = src; }

    get source () { return this._source; }

    actions (room, player) {
        super.actions(room, player);

        if (typeof this.word === 'undefined') {
            throw new Error('Current word is not defined.');
        }
    }
}
