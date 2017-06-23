import BriefVerb from '../../../../../../src/objects/rgi/lexemes/verbs/brief';

describe('BriefCommand', () => {
    let briefCommand;

    describe('constructor()', () => {
        it('generates an object', () => {
            briefCommand = new BriefVerb();

            assert.isObject(briefCommand);
        });
    });
});
