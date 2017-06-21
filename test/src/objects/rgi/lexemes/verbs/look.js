import LookVerb from '../../../../../../src/objects/rgi/lexemes/verbs/look';

describe('LookCommand', () => {
    let lookCommand;

    describe('constructor()', () => {
        it('generates an object', () => {
            lookCommand = new LookVerb();

            assert.isObject(lookCommand);
        });
    });
});
