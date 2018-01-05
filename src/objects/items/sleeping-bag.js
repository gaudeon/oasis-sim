import Item from '../item';

export default class SleepingBag extends Item {
    constructor (game, containerOrientation) {
        super(game, containerOrientation);

        this._name = 'Sleeping Bag';

        this._brief = 'sleeping bag';

        this._description = 'a mildly worn out sleeping bag';
    }
}
