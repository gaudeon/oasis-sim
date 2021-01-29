import Verb from '../verb';
import TextAction from '../../../game-actions/text';

export default class HistoryVerb extends Verb {
    constructor () {
        super();

        this._word = 'history';

        this._aliases = [''];

        this.colorTitle = '#DDA0DD'; // Plum
        this.colorCommands = '#DA70D6'; // Orchid
    }

    actions (rgi, room, universe, lexemePhrase) {
        super.actions(rgi. room, universe, lexemePhrase);

        let output = '';

        rgi.playerCommandHistory.forEach(c => {
            output += '\t' + c + '\n';
        });

        if (output !== '') {
            let titleAction = new TextAction('{{historyTitle}}History:');

            let commandsAction = new TextAction('{{historyText}}' + output);

            return [titleAction, commandsAction];
        }

        return []; // return no actions
    }

    helpText () {
        return super.helpText() + 'Display recently entered commands.';
    }
}
