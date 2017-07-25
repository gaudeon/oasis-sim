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

        import('../all-verbs').then(Module => {
            let AllVerbs = Module.default;
            let verbs = new AllVerbs();
            this.stringData = '';

            verbs.verbList.forEach(Verb => {
                let verb = new Verb();
                this.stringData = this.stringData + verb.word + '\n';
            });
        });

        // TODO: needs to handle returning of promises from actions calls (because import() is a promise and so we have to wait for it to complete - so we need to return a promise for this one.. so all actions should return promises)

        let action = new TextAction(this.stringData);
        action.style = {fill: this.colorHelp, stroke: this.colorHelp};

        return action;
    }
}
