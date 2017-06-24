import WadesTrailerOutside from '../../../../src/objects/rooms/wades-trailer-outside';

describe('WadesTrailerOutside', () => {
    let wadesTrailerOutside;

    describe('constructor(game)', () => {
        it('generates an object', () => {
            wadesTrailerOutside = new WadesTrailerOutside(game);

            assert.isObject(wadesTrailerOutside);
        });
    });
});
