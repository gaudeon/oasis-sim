import Door from '../../../src/objects/door';

describe('Door', () => {
    let door;

    describe('constructor()', () => {
        it('generates an object', () => {
            door = new Door({}, { name: 'Door-North-SomeId' });

            assert.isObject(door);
        });
    });
});
