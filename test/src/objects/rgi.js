import RGI from '../../../src/objects/rgi';

describe('RGI', () => {
    let rgi;

    describe('constructor()', () => {
        it('generates an object', () => {
            rgi = new RGI();

            assert.isObject(rgi);
        });
    });
});
