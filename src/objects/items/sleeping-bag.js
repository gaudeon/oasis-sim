import Item from '../item';

export default class SleepingBag extends Item {
    constructor (game) {
        super(game);

        this._name = 'Sleeping Bag';

        this._brief = 'sleeping bag';

        this._description = 'a mildly worn out sleeping bag.';
    }
}
