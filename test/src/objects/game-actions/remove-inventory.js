import RemoveInventoryAction from '../../../../src/objects/game-actions/remove-inventory';

describe('RemoveInventoryAction', () => {
    let removeInventory;

    describe('constructor()', () => {
        it('generates an object', () => {
            removeInventory = new RemoveInventoryAction();

            assert.isObject(removeInventory);
        });
    });
});
