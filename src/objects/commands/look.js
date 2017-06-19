export default class LookCommand {
    constructor () {
        this.color = '#87CEEB'; // SkyBlue
    }

    exec (command, buffer, room) {
        let description = 'You are in ' + room.description + '.';

        room.inventory.forEach((item) => {
            description = description + ' There is ';

            if (typeof item.description === 'object') { // support object specific descriptions
                if (item.description[room.key]) {
                    description += item.description[room.key];
                } else {
                    description += item.description['default'];
                }
            } else {
                 description += item.description;
            }

            description = description + '.';
        });

        description = description + ' ' + room.flavorText;

        buffer.addText(description, {fill: this.color, stroke: this.color});
    }
}
