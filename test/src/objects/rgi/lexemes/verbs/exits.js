import ExitsVerb from '../../../../../../src/objects/rgi/lexemes/verbs/exits';

describe('ExitsCommand', () => {
    let exitsCommand;

    describe('constructor()', () => {
        it('generates an object', () => {
            exitsCommand = new ExitsVerb();

            assert.isObject(exitsCommand);
        });
    });
});
