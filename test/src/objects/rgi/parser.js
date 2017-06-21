import Parser from '../../../../src/objects/rgi/parser';

describe('Parser', () => {
    let parser;

    describe('constructor()', () => {
        it('generates an object', () => {
            parser = new Parser();

            assert.isObject(parser);
        });
    });
});
