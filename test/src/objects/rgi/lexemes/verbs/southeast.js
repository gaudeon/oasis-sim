import SouthEastVerb from '../../../../../../src/objects/rgi/lexemes/verbs/southeast';

describe('SouthEastCommand', () => {
    let southeastCommand;

    describe('constructor()', () => {
        it('generates an object', () => {
            southeastCommand = new SouthEastVerb();

            assert.isObject(southeastCommand);
        });
    });
});
