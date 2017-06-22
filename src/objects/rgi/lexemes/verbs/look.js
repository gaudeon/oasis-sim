import Verb from '../verb';

export default class LookVerb extends Verb {
    constructor () {
        super();

        this._word = 'look';
        this.color = '#87CEEB'; // SkyBlue
        this._aliases = ['l', 'look'];
    }

    exec () {
        super.exec();

        let description = this.room.look();

        this.buffer.addText(description, {fill: this.color, stroke: this.color});
    }
}
