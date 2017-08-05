import AddInventoryAction from '../../../../src/objects/game-actions/add-inventory';

describe('AddInventoryAction', () => {
    let addInventory;

    describe('constructor()', () => {
        it('generates an object', () => {
            addInventory = new AddInventoryAction({
                target: {}, // target must be defined
                items: [ {} ] // items array with at least a length of 1 must be defined
            });

            assert.isObject(addInventory);
        });
    });
});
