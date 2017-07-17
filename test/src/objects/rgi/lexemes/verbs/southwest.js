import SouthWestVerb from '../../../../../../src/objects/rgi/lexemes/verbs/southwest';

describe('SouthWestCommand', () => {
    let southwestCommand;

    describe('constructor()', () => {
        it('generates an object', () => {
            southwestCommand = new SouthWestVerb();

            assert.isObject(southwestCommand);
        });
    });
});
