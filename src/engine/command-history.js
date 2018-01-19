export default class CommandHistory {
    constructor (limit = undefined) {
        this._history = [];

        this._limit = undefined;
        if (limit && limit * 1 > 0) {
            this._limit = limit;
        }
    }

    get history () { return this._history; }

    get limit () { return this._limit; }

    get length () { return this._history.length; }

    add (command) {
        _.remove(this._history, c => {
            return c === command;
        });

        this._history.push(command);

        if (this._limit && this._history.length > this._limit) {
            this._history.shift();
        }

        return command;
    }

    forEach (...args) {
        return this._history.forEach.apply(this._history, args);
    }

    clear () {
        _.history = [];
    }
}
