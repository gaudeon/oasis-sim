import Map from '../objects/map';
import TextBuffer from '../ui/text-buffer';

export default class RoomState extends Phaser.State {
    init () {
        this.map = this.game.map = this.game.map || new Map();
        this.buffer = this.game.buffer = this.game.buffer || new TextBuffer(this.game);
    }

    create () {
        this.buffer.addText(this.map.currentRoom.description);
    }
};
