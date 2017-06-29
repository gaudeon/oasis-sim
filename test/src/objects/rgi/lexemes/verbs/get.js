import GetVerb from '../../../../../../src/objects/rgi/lexemes/verbs/get';

describe('GetCommand', () => {
    let getCommand;

    describe('constructor()', () => {
        it('generates an object', () => {
            getCommand = new GetVerb();

            assert.isObject(getCommand);
        });
    });
});
