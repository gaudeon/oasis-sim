import Map from '../objects/map';

export default class RoomState extends Phaser.State {
    init () {
        this.game.map = this.game.map || new Map();
    }
};
