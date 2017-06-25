import Room from '../../room';

export default class YourTrailerLivingRoom extends Room {
    constructor (game) {
        super(game);

        this._name = 'Your Trailer - Living Room'

        this._description = 'in the living room of your trailer in the stacks';

        this._flavorText = 'There are several large stains in what remains of the carpet on the floor.';

        this.setNorth('a door leading outside', 'YourTrailerPorch');

        this.inventory.addItem(new this.game.allItems.itemMap.SleepingBag(this.game));
    }
}
