import LookCommand from '../../../../src/objects/commands/look';

describe('LookCommand', () => {
    let lookCommand;

    describe('constructor()', () => {
        it('generates an object', () => {
            lookCommand = new LookCommand();

            assert.isObject(lookCommand);
        });
    });
});
