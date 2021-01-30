import GameAction from '../game-action';

export default class TextAction extends GameAction {
    constructor (data) {
        super(data);

        this._type = 'text';
    }

    run (rgi, buffer, room, universe, lastCommand) {
        if (this.debug && console) {
            console.log(`--- Start Text Action ---`);
            console.log(`RGI: `, rgi);
            console.log(`RGI: Buffer: `, buffer);
            console.log(`RGI: Room: `, room);
            console.log(`RGI: Universe: `, universe);
            console.log(`RGI: Last Command: `, lastCommand);
        }

        buffer.addText(this.data);

        if (this.debug && console) {
            console.log(`--- End Text Action ---`);
        }
    }
}
