import Room from '../room';

export default class WadesTrailerLaundryRoom extends Room {
    constructor () {
        super();

        this._name = 'Wade\'s Trailer - Laundry Room'

        this._description = 'in a tiny laundry room';

        this._flavorText = 'This room smells of liquid detergent and fabric softener.';

        this._out = 'WadesTrailerOutside';
    }
}
