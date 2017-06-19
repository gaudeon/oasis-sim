import CommandParser from '../../../src/objects/command-parser';

describe('CommandParser', () => {
    let commandParser;

    describe('constructor()', () => {
        it('generates an object', () => {
            commandParser = new CommandParser();

            assert.isObject(commandParser);
        });
    });
});
