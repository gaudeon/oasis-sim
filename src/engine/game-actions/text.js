import GameAction from '../game-action';
import interpolateStyles from "../../utils/interpolate-styles";

export default class TextAction extends GameAction {
    constructor (data) {
        super(data);

        this._type = 'text';

        if (this.data === undefined || typeof(this.data) !== "string") {
            throw new Error("data is not a string");
        }
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

        let text = interpolateStyles(this.data, universe);

        buffer.addText("\n\r{{defaultDescription}}" + text);

        if (this.debug && console) {
            console.log(`--- End Text Action ---`);
        }
    }
}
