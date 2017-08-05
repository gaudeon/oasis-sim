import InventoryVerb from '../../../../../../src/objects/rgi/lexemes/verbs/inventory';

describe('InventoryCommand', () => {
    let inventoryCommand;

    describe('constructor()', () => {
        it('generates an object', () => {
            inventoryCommand = new InventoryVerb();

            assert.isObject(inventoryCommand);
        });
    });
});
