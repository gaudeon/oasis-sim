import RunCommandStateAction from '../../../../src/objects/game-actions/run-command';

describe('RunCommandStateAction', () => {
    let runCommandState;

    describe('constructor()', () => {
        it('generates an object', () => {
            runCommandState = new RunCommandStateAction();

            assert.isObject(runCommandState);
        });
    });
});
