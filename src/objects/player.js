import PlayerAvatar from './player/avatar';

export default class Player {
    constructor (commandHistory) {
        this.id = '';
        this.password = '';

        if(commandHistory === undefined) {
            throw new Error("CommandHistory is not defined");
        }
        this.commandHistory = commandHistory; 

        this._avatar = undefined;
    }

    get avatar () { return this._avatar; }

    loadAvatar (universe) {
        this._avatar = new PlayerAvatar(universe);

        return this._avatar;
    }
}
