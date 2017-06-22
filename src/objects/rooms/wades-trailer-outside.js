import Room from '../room';

export default class WadesTrailerOutside extends Room {
    constructor () {
        super();

        this._name = 'Wade\'s Trailer - Outside'

        this._description = 'outside on the porch';

        this._flavorText = '';

        this._in = 'WadesTrailerLaundryRoom';
    }
}
