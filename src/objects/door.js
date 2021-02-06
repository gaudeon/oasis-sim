import TextAction from '../engine/game-actions/text';

export default class Door {
    constructor (model, universe) {
        this._universe = universe;

        this._model = model;
    }

    get universe () { return this._universe; }

    get model () { return this._model; }

    // command handling
    commandLook () {
        let description = '{{defaultDescription}} You see ' + this.model.description;

        return [new TextAction(description)];
    }
}
