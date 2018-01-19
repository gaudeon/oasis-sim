import GameAction from '../game-action';

export default class RunCommandAction extends GameAction {
    constructor (data) {
        super(data);

        this._type = 'run-command';

        this._outputCommand = false;
    }

    get outputCommand () { return this._outputCommand; }

    set outputCommand (outputCommand) { this._outputCommand = outputCommand; }

    run (rgi, buffer, room, player, lastCommand) {
        rgi.exec(this.data, room, player, this.outputCommand);
    }
}
