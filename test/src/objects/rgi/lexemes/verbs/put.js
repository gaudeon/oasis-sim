import PutVerb from '../../../../../../src/objects/rgi/lexemes/verbs/put';

describe('PutCommand', () => {
    let putCommand;

    describe('constructor()', () => {
        it('generates an object', () => {
            putCommand = new PutVerb();

            assert.isObject(putCommand);
        });
    });
});
