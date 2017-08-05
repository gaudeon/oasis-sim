import RemoveInventoryAction from '../../../../src/objects/game-actions/remove-inventory';

describe('RemoveInventoryAction', () => {
    let removeInventory;

    describe('constructor()', () => {
        it('generates an object', () => {
            removeInventory = new RemoveInventoryAction({
                target: {}, // target must be defined
                items: [ {} ] // items array with at least a length of 1 must be defined
            });

            assert.isObject(removeInventory);
        });
    });
});
