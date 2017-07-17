import WestVerb from '../../../../../../src/objects/rgi/lexemes/verbs/west';

describe('WestCommand', () => {
    let westCommand;

    describe('constructor()', () => {
        it('generates an object', () => {
            westCommand = new WestVerb();

            assert.isObject(westCommand);
        });
    });
});
