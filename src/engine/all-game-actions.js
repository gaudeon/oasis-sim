import AddInventoryAction from './game-actions/add-inventory';
import ChangeRoomAction from './game-actions/change-room';
import NullAction from './game-actions/null';
import RemoveInventoryAction from './game-actions/remove-inventory';
import RunCommandAction from './game-actions/run-command';
import TextAction from './game-actions/text';
import CallEventAction from './game-actions/call-event';

export default class AllGameActions {
    constructor () {
    }

    get gameActionMap () {
        return {
            'AddInventoryAction': AddInventoryAction,
            'ChangeRoomAction': ChangeRoomAction,
            'NullAction': NullAction,
            'RemoveInventoryAction': RemoveInventoryAction,
            'RunCommandAction': RunCommandAction,
            'TextAction': TextAction,
            'CallEvent': CallEventAction
        };
    }

    get gameActionList () {
        return this.verbMap().values();
    }

    createActionsFromList (actionConfigList) {
        if (!Array.isArray(actionConfigList)) {
            throw new Error("actionConfigList is not a list");
        }

        let actions = [];

        actionConfigList.forEach(config => {
            if (this.gameActionMap[config.type] !== undefined) {
                let GameAction = this.gameActionMap[config.type];
                let gameAction = new GameAction(config.data);
                actions.push(gameAction);
            }
        });

        return actions;
    }
}
