import Verb from '../verb';

export default class BriefVerb extends Verb {
    constructor () {
        super();

        this._word = 'brief';
        this.color = '#87CEEB'; // SkyBlue
        this._aliases = [];
    }

    exec () {
        super.exec();

        let description = this.room.commandBrief();

        this.buffer.addText(description, {fill: this.color, stroke: this.color});
    }
}
