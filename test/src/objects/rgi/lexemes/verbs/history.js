import HistoryVerb from '../../../../../../src/objects/rgi/lexemes/verbs/history';

describe('HistoryCommand', () => {
    let historyCommand;

    describe('constructor()', () => {
        it('generates an object', () => {
            historyCommand = new HistoryVerb();

            assert.isObject(historyCommand);
        });
    });
});
