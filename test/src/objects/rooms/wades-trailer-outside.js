import WadesTrailerOutside from '../../../../src/objects/rooms/wades-trailer-outside';

describe('WadesTrailerOutside', () => {
    let wadesTrailerOutside;

    describe('constructor()', () => {
        it('generates an object', () => {
            wadesTrailerOutside = new WadesTrailerOutside();

            assert.isObject(wadesTrailerOutside);
        });
    });
});
