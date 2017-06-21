import Verb from '../verb';

export default class LookVerb extends Verb {
    constructor () {
        super();

        this._word = 'look';
        this.color = '#87CEEB'; // SkyBlue
        this._aliases = ['l']; // l for look
    }

    exec () {
        super.exec();

        let description = 'You are in ' + this.room.description + '.';

        this.room.inventory.forEach((item) => {
            description = description + ' There is ';

            if (typeof item.description === 'object') { // support object specific descriptions
                if (item.description[this.room.key]) {
                    description += item.description[this.room.key];
                } else {
                    description += item.description['default'];
                }
            } else {
                 description += item.description;
            }

            description = description + '.';
        });

        description = description + ' ' + this.room.flavorText;

        this.buffer.addText(description, {fill: this.color, stroke: this.color});
    }
}
