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

    actions (room, player) {
        super.actions(room, player);

        let output = '';

        if (player.game.commandHistory.length > 0) {
            player.game.commandHistory.forEach(c => {
                output += '\t' + c + '\n';
            });
        }

        if (output !== '') {
            let titleAction = new TextAction('History:');
            titleAction.style = {fill: this.colorTitle, stroke: this.colorTitle};

            let commandsAction = new TextAction(output);
            commandsAction.style = {fill: this.colorCommands, stroke: this.colorCommands};

            return [titleAction, commandsAction];
        }

        return []; // return no actions
    }

    helpText () {
        return super.helpText() + 'Display recently entered commands.';
    }
}
