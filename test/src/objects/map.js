import Map from '../../../src/objects/map';

describe('Map', () => {
    let map;

    describe('constructor()', () => {
        it('generates an object', () => {
            map = new Map();

            assert.isObject(map);
        });
    });
});
