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

    createAction (type, data) {
        let gameAction;

        if (this.gameActionMap[type] !== undefined) {
            let GameAction = this.gameActionMap[type];
            gameAction = new GameAction(data);
        }

        return gameAction;
    }

    createActionsFromList (actionConfigList) {
        if (!Array.isArray(actionConfigList)) {
            throw new Error("actionConfigList is not a list");
        }

        let actions = [];

        actionConfigList.forEach(config => {
            let gameAction = this.createAction(config.type, config.data);
            actions.push(gameAction);
        });

        return actions;
    }
}
