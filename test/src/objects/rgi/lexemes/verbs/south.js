import SouthVerb from '../../../../../../src/objects/rgi/lexemes/verbs/south';

describe('SouthCommand', () => {
    let southCommand;

    describe('constructor()', () => {
        it('generates an object', () => {
            southCommand = new SouthVerb();

            assert.isObject(southCommand);
        });
    });
});
