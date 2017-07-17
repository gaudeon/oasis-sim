import NorthWestVerb from '../../../../../../src/objects/rgi/lexemes/verbs/northwest';

describe('NorthWestCommand', () => {
    let northwestCommand;

    describe('constructor()', () => {
        it('generates an object', () => {
            northwestCommand = new NorthWestVerb();

            assert.isObject(northwestCommand);
        });
    });
});
