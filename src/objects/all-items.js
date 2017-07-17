import SleepingBag from './items/sleeping-bag';

export default class AllItems {
    constructor (game) {
        this.game = game;

        this._itemMap = {};

        this.itemList.forEach((item) => {
            this._itemMap[item.name] = item;
        });
    }

    get itemList () {
        return [
            SleepingBag
        ];
    }

    get itemMap () { return this._itemMap; }
}
