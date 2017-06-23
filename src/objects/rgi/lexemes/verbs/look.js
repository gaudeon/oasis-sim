import Verb from '../verb';

export default class LookVerb extends Verb {
    constructor () {
        super();

        this._word = 'look';
        this.colorBrief = '#87CEEB'; // SkyBlue
        this.colorExits = '#90EE90'; // LightGreen
        this._aliases = ['l'];
    }

    exec () {
        super.exec();

        let description = this.room.look();

        this.buffer.addText(description.brief, {fill: this.colorBrief, stroke: this.colorBrief});
        this.buffer.addText(description.exits, {fill: this.colorExits, stroke: this.colorExits});
    }
}
