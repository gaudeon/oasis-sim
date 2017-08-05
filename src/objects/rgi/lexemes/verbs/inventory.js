import Verb from '../verb';
import TextAction from '../../../game-actions/text';

export default class InventoryVerb extends Verb {
    constructor () {
        super();

        this._word = 'inventory';
        this.colorBrief = '#87CEEB'; // SkyBlue
        this.colorItems = '#90EE90'; // MediumOrchid
        this.colorExits = '#90EE90'; // LightGreen
        this._aliases = ['inv', 'i'];
    }

    actions (room, player) {
        super.actions(room, player);

        let description = player.commandLook();

        let itemsTextAction = new TextAction(description.items);
        itemsTextAction.style = {fill: this.colorItems, stroke: this.colorItems};

        return [itemsTextAction];
    }

    helpText () {
        return super.helpText() + 'Look at your inventory.';
    }
}
