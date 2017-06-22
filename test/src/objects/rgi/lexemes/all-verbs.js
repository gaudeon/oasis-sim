import AllVerbs from '../../../../../src/objects/rgi/lexemes/all-verbs';

describe('AllVerbs', () => {
    let allVerbs;

    describe('constructor()', () => {
        it('generates an object', () => {
            allVerbs = new AllVerbs();

            assert.isObject(allVerbs);
        });
    });
});
