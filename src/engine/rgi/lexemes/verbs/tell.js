import Verb from '../verb';
import RunCommandAction from '../../../game-actions/run-command';
import CallEventAction from '../../../game-actions/call-event';

export default class TellVerb extends Verb {
    constructor () {
        super();

        this._word = 'tell';

        this._aliases = ['t', 'announce', 'assert', 'claim', 'declare', 'disclose', 'express', 'reply', 'report', 'respond', 'say', 'speak', 'state', 'suggest' ];
    }

    actions (rgi, room, universe, lexemePhrase) {
        super.actions(rgi, room, universe, lexemePhrase);

        if (typeof this.source !== 'undefined') {
            let actions = [];

            actions.push(new CallEventAction({
                event: 'onTell',
                eventSource: room,
                eventData: {
                    source: this.source,
                    stringData: this.stringData
                }
            }));

            return actions;
        } else {
            return new RunCommandAction('error Hmm, I wonder who I should talk to?');
        }
    }

    helpText () {
        return super.helpText() + 'tell [target] [message] - Say something to someone else.';
    }
}
