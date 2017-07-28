import Verb from '../verb';
import TextAction from '../../../game-actions/text';

export default class HelpVerb extends Verb {
    constructor () {
        super();

        this._word = 'help';

        this._aliases = ['h', '?'];

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
                            output = verb.helpText();
                        }
                    }
                }

                if (!output) {
                    output = 'Usage: help <command>\nAvailable Commands:\n';

                    const numColumns = 4;
                    let currColumn = 0;
                    verbs.verbList.sort((a, b) => {
                        return (a.name < b.name) ? -1 : (a.name > b.name) ? 1 : 0;
                    }).forEach(Verb => {
                        let verb = new Verb();

                        // don't display this verb as an option if the player can't execute it
                        if (!verb.playerCanExecute) {
                            return;
                        }

                        output = output + verb.word + '\t\t\t';
                        currColumn++;
                        if (currColumn >= numColumns) {
                            output = output + '\n';
                            currColumn = 0;
                        }
                    });
                }

                let action = new TextAction(output);
                action.style = {fill: this.colorHelp, stroke: this.colorHelp};

                resolve(action);
            });
        });

        return actionPromise;
    }

    helpText () {
        return 'You really ran help to get help about help?';
    }
}
