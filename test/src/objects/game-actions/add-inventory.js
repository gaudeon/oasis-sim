import AddInventoryAction from '../../../../src/objects/game-actions/add-inventory';

describe('AddInventoryAction', () => {
    let addInventory;

    describe('constructor()', () => {
        it('generates an object', () => {
            addInventory = new AddInventoryAction();

            assert.isObject(addInventory);
        });
    });
});
