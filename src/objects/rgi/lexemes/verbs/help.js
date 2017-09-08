import Verb from '../verb';
import TextAction from '../../../game-actions/text';

export default class HelpVerb extends Verb {
    constructor () {
        super();

        this._word = 'help';

        this._aliases = ['commands', 'h', '?'];

        this.colorHelp = '#DDA0DD'; // Plum
    }

    actions (room, player) {
        super.actions(room, player);

        let actionPromise = new Promise((resolve, reject) => {
            import('../all-verbs').then(Module => {
                let AllVerbs = Module.default;
                let verbs = new AllVerbs();
                let output = '';

                if (this.stringData) {
                    let VerbClass = verbs.verbMap[this.stringData.toLowerCase().replace(/[^\w]/, '')];

                    if (VerbClass) {
                        let verb = new VerbClass();

                        // only get help text if the player can execute it
                        if (verb.playerCanExecute) {
                            output = '{{helpDescription}}' + verb.helpText();
                        }
                    }
                }

                if (!output) {
                    output = '{{helpDescription}}Usage: help <command>\nAvailable Commands:\n';

                    const numColumns = 5;
                    let currColumn = 0;
                    verbs.verbList.sort((a, b) => {
                        return (a.name < b.name) ? -1 : (a.name > b.name) ? 1 : 0;
                    }).forEach(Verb => {
                        let verb = new Verb();

                        // don't display this verb as an option if the player can't execute it
                        if (!verb.playerCanExecute) {
                            return;
                        }

                        output = output + verb.word + '\t\t\t\t';
                        currColumn++;
                        if (currColumn >= numColumns) {
                            output = output + '\n';
                            currColumn = 0;
                        }
                    });
                }

                let action = new TextAction(output);

                resolve(action);
            });
        });

        return actionPromise;
    }

    helpText () {
        return super.helpText() + 'You really ran help to get help about help?';
    }
}
