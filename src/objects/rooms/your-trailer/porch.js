import Room from '../../room';

export default class YourTrailerPorch extends Room {
    constructor (game) {
        super(game);

        this._name = 'Your Trailer - Porch'

        this._description = 'outside on the porch of your trailer';

        this._flavorText = 'You are ten stories up from the ground. Out from where you stand you see several other stacks across the flat dirt plain.';

        this.setSouth('a door leading inside your trailer', 'YourTrailerLivingRoom');

        this.onSouth = () => {
            return this.briefTextAction('test\n');
        };

        this.setDown('a piecemeal metal ladder leading', 'YourTrailerGround');

        this.onDown = () => {
            return this.briefTextAction('You climb down past the many trailers in the stack below your trailer.\n');
        };
    }
}
