import GameAction from '../game-action';

export default class NullAction extends GameAction {
    constructor (data) {
        super(data);

        this._type = 'null';
    }

    run (rgi, buffer, room, universe, lastCommand) {
        // do nothing
        if (this.debug && console) {
            console.log(`--- Start Null Action ---`);
            console.log(`RGI: `, rgi);
            console.log(`RGI: Buffer: `, buffer);
            console.log(`RGI: Room: `, room);
            console.log(`RGI: Universe: `, universe);
            console.log(`RGI: Last Command: `, lastCommand);
            console.log(`--- End Null Action ---`);
        }
    }
}
