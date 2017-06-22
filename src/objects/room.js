export default class Room {
    constructor (data) {
        this._name = 'Generic Room'
        this._description = '';
        this._flavorText = '';
    }

    get key () { return this.constructor.name; }

    get name () { return this._name; }

    get description () { return this._description; }

    get flavorText () { return this._flavorText; }

    look () {
        let description = 'You are in ' + this.description + '.';

        description = description + ' ' + this.flavorText;

        return description;
    };
}
