import AllItems from '../../../src/objects/all-items';

describe('AllItems', () => {
    let allItems;

    describe('constructor(game)', () => {
        it('generates an object', () => {
            allItems = new AllItems(game);

            assert.isObject(allItems);
        });
    });
});
