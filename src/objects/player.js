import PlayerAvatar from './player/avatar';

export default class Player {
    constructor () {
        this.id = '';
        this.password = '';

        this._avatar = undefined;
    }

    get avatar () { return this._avatar; }

    loadAvatar (universe) {
        this._avatar = new PlayerAvatar(universe);

        return this._avatar;
    }
}
