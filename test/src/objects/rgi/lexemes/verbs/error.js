import ErrorVerb from '../../../../../../src/objects/rgi/lexemes/verbs/error';

describe('ErrorCommand', () => {
    let errorCommand;

    describe('constructor()', () => {
        it('generates an object', () => {
            errorCommand = new ErrorVerb();

            assert.isObject(errorCommand);
        });
    });
});
