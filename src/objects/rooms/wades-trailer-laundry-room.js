import Room from '../room';

export default class WadesTrailerLaundryRoom extends Room {
    constructor () {
        super();

        this._name = 'Wade\'s Trailer - Laundry Room'

        this._description = 'a tiny laundry room';

        this._flavorText = 'This room smells of liquid detergent and fabric softener.';
    }
}
