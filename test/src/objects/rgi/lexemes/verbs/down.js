import DownVerb from '../../../../../../src/objects/rgi/lexemes/verbs/down';

describe('DownCommand', () => {
    let downCommand;

    describe('constructor()', () => {
        it('generates an object', () => {
            downCommand = new DownVerb();

            assert.isObject(downCommand);
        });
    });
});
