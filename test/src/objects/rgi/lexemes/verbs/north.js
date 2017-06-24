import NorthVerb from '../../../../../../src/objects/rgi/lexemes/verbs/north';

describe('NorthCommand', () => {
    let northCommand;

    describe('constructor()', () => {
        it('generates an object', () => {
            northCommand = new NorthVerb();

            assert.isObject(northCommand);
        });
    });
});
