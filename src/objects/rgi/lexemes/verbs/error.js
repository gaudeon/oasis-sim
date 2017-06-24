import Verb from '../verb';

export default class ErrorVerb extends Verb {
    constructor () {
        super();

        this._word = 'error';

        this.colorError = '#FFB6C1'; // LightPink
    }

    exec () {
        super.exec();

        this.buffer.addText(this.stringData, {fill: this.colorError, stroke: this.colorError});
    }
}
