import TextInput from '../../../src/ui/text-input';

describe('TextInput', () => {
    let textInput;

    describe('constructor(game)', () => {
        it('generates an object', () => {
            textInput = new TextInput(game);

            assert.isObject(textInput);
        });
    });
});
