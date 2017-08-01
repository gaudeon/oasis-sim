import CommandHistory from '../../../src/objects/command-history';

describe('CommandHistory', () => {
    let commandHistory;

    describe('constructor()', () => {
        it('generates an object', () => {
            commandHistory = new CommandHistory();

            assert.isObject(commandHistory);
        });
    });
});
