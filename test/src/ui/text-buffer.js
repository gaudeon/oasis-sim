import TextBuffer from '../../../src/ui/text-buffer';

describe('TextBuffer', () => {
    let textBuffer;

    describe('constructor()', () => {
        it('generates an object', () => {
            textBuffer = new TextBuffer(game);

            assert.isObject(textBuffer);
        });
    });

    describe('lineStyle()', () => {
        it('allows properties to be overwritten', () => {
            let style = textBuffer.lineStyle('rubik', {font: 'overwritten'});

            assert.equal(style.font, 'overwritten');
        });
    });

    describe('splitTextIntoLines()', () => {
        it('splits text into multiple lines', () => {
            let ara = textBuffer.splitTextIntoLines('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam hendrerit risus venenatis porttitor molestie. Vivamus diam arcu, volutpat eu suscipit id, scelerisque eget turpis. Donec feugiat id mi nec cursus. Praesent eget sapien aliquet justo placerat consequat et sit amet metus. Praesent luctus commodo placerat.');

            assert.isAbove(ara.length, 1);
        });
    });
});
