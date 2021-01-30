import GameAction from '../game-action';

export default class RunCommandAction extends GameAction {
    constructor (data) {
        super(data);

        this._type = 'run-command';

        this._outputCommand = false;
    }

    get outputCommand () { return this._outputCommand; }

    set outputCommand (outputCommand) { this._outputCommand = outputCommand; }

    run (rgi, buffer, room, universe, lastCommand) {
        if (this.debug && console) {
            console.log(`--- Start Run Command Action ---`);
            console.log(`RGI: `, rgi);
            console.log(`RGI: Buffer: `, buffer);
            console.log(`RGI: Room: `, room);
            console.log(`RGI: Universe: `, universe);
            console.log(`RGI: Last Command: `, lastCommand);
        }

        rgi.exec(this.data, room, universe, this.outputCommand);

        if (this.debug && console) {
            console.log(`--- End Run Command Action ---`);
        }
    }
}
