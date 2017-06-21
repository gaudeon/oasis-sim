import Lexer from '../../../../src/objects/rgi/lexer';

describe('Lexer', () => {
    let lexer;

    describe('constructor()', () => {
        it('generates an object', () => {
            lexer = new Lexer();

            assert.isObject(lexer);
        });
    });
});
