export default class Room {
    constructor (data) {
        this._name = 'Generic Room'
        this._description = '';
        this._flavorText = '';

        // exits
        this._down = undefined;
        this._up = undefined;
        this._north = undefined;
        this._south = undefined;
        this._east = undefined;
        this._west = undefined;
        this._in = undefined;
        this._out = undefined;
    }

    get key () { return this.constructor.name; }

    get name () { return this._name; }

    get description () { return this._description; }

    get flavorText () { return this._flavorText; }

    get down () { return this._down; }

    get up () { return this._up; }

    get north () { return this._north; }

    get south () { return this._south; }

    get east () { return this._east; }

    get west () { return this._west; }

    get in () { return this._in; }

    get out () { return this._out; }

    look () {
        let description = 'You are ' + this.description + '.';

        description = description + ' ' + this.flavorText;

        return description;
    };
}
