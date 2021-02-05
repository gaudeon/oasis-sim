export default class EventTrigger {
    constructor (model, universe) {
        this._universe = universe;

        this._model = model;
    }

    get universe () { return this._universe; }

    get model () { return this._model; }
}