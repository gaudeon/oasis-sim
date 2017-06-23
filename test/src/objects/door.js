import Door from '../../../src/objects/door';

describe('Door', () => {
    let door;

    describe('constructor()', () => {
        it('generates an object', () => {
            door = new Door('north', '', '');

            assert.isObject(door);
        });
    });
});
