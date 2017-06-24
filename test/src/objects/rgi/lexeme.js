import Lexeme from '../../../../src/objects/rgi/lexeme';

describe('Lexeme', () => {
    let lexeme;

    describe('constructor()', () => {
        it('generates an object', () => {
            lexeme = new Lexeme();

            assert.isObject(lexeme);
        });
    });
});
