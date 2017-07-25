import HelpVerb from '../../../../../../src/objects/rgi/lexemes/verbs/help';

describe('HelpCommand', () => {
    let helpCommand;

    describe('constructor()', () => {
        it('generates an object', () => {
            helpCommand = new HelpVerb();

            assert.isObject(helpCommand);
        });
    });
});
