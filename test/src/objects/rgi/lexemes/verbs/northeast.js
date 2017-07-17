import NorthEastVerb from '../../../../../../src/objects/rgi/lexemes/verbs/northeast';

describe('NorthEastCommand', () => {
    let northeastCommand;

    describe('constructor()', () => {
        it('generates an object', () => {
            northeastCommand = new NorthEastVerb();

            assert.isObject(northeastCommand);
        });
    });
});
