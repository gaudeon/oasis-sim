import Verb from '../../../../../src/objects/rgi/lexemes/verb';

describe('Verb', () => {
    let verb;

    describe('constructor()', () => {
        it('generates an object', () => {
            verb = new Verb();

            assert.isObject(verb);
        });
    });
});
