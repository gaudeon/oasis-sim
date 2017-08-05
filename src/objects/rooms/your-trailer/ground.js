import Room from '../../room';

export default class YourTrailerGround extends Room {
    constructor (game) {
        super(game);

        this._name = 'Your Stack - Ground Level'

        this._description = 'on the ground by your stack';

        this._flavorText = 'There are pillars of stacks surrounding you making it difficult to see anything but trailers.';

        this.setUp('a piecemeal metal ladder leading', 'YourTrailerPorch');

        this.onUp = () => {
            return this.briefTextAction('You climb up past the many trailers in the stack situated below your destination.\n');
        };
    }
}
