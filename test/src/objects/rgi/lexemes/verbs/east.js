import EastVerb from '../../../../../../src/objects/rgi/lexemes/verbs/east';

describe('EastCommand', () => {
    let eastCommand;

    describe('constructor()', () => {
        it('generates an object', () => {
            eastCommand = new EastVerb();

            assert.isObject(eastCommand);
        });
    });
});
