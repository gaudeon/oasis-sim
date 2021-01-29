import GameAction from '../game-action';

export default class NullAction extends GameAction {
    constructor (data) {
        super(data);

        this._type = 'null';
    }

    run (rgi, buffer, room, universe, lastCommand) {
        // do nothing
    }
}
