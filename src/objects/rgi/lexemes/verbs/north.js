import Verb from '../verb';

export default class NorthVerb extends Verb {
    constructor () {
        super();

        this._word = 'north';

        this._aliases = ['n'];
    }

    exec () {
        super.exec();

        let errorMsg = this.room.commandNorth();

        if (errorMsg) {
            this.rgi.exec('error ' + errorMsg, this.room, false); // todo - build error command (don't let undefined values get into lexer)
        }
    }
}
