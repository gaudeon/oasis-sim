import Inventory from '../../../src/objects/inventory';

describe('Inventory', () => {
    let inventory;

    describe('constructor()', () => {
        it('generates an object', () => {
            inventory = new Inventory();

            assert.isObject(inventory);
        });
    });
});
