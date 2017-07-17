import UpVerb from '../../../../../../src/objects/rgi/lexemes/verbs/up';

describe('UpCommand', () => {
    let upCommand;

    describe('constructor()', () => {
        it('generates an object', () => {
            upCommand = new UpVerb();

            assert.isObject(upCommand);
        });
    });
});
