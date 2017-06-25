import Item from '../../../src/objects/item';

describe('Item', () => {
    let item;

    describe('constructor()', () => {
        it('generates an object', () => {
            item = new Item();

            assert.isObject(item);
        });
    });
});
