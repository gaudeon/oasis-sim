import interpolateDescription from "../utils/interpolate-description";
import AllGameActions from "../engine/all-game-actions";
import TextAction from '../engine/game-actions/text';

export default class Npc {
    constructor (universe, inventory, node) {
        this._universe = universe;
        this._inventory = inventory;
        this._node = node;

        this._name = node.name || 'undefined';

        this._displayName = node.displayName || 'undefined';

        this._description = interpolateDescription(node.description);

        this._key = node.key;

        this._room = undefined;

        if (node.childrenNames) {
            node.childrenNames.forEach(child => {
                let matches = child.match(/^\[\[((door|item|npc)(?:-([^\-]+))+)\]\]$/i);
                const id = matches[1];
                const type = matches[2];

                switch (type.toLowerCase()) {
                    case 'door': // FORMAT: Door-<direction>-<id>
                        this._doors.push(universe.findDoor(id));
                        break;
                    case 'item': // FORMAT: Item-<id>
                        this._inventory.addItem(universe.findItem(id));
                        break;
                    case 'npc': // FORMATE: Npc-<id>
                        this._npcs.push(universe.findNpc(id));
                        break;
                }
            });
        }

        this._trackedRoomEvents = [];
    }

    get node () { return this._node; }

    get displayName () { return this._displayName; }

    get name () { return this._name; }

    get description () { return this._description; }
    
    get universe () { return this._universe; }

    get inventory () { return this._inventory; }

    get items () { return this._inventory.items; }

    get key () { return this._key; }

    // room related
    get room () { return this._room; }

    set room (r) { 
        if (this._room !== undefined) {
            this.removeRoomEvents(this._room);
        }

        this._room = r;
    
        this.setupRoomEvents(this._room);
    }

    // the npc description
    getGeneralDescription () {
        return '{{npcHighlight}}'+ this.displayName + '\n\n{{defaultDescription}}' + this.description.trim().replace(/^\w/, (c) => c.toUpperCase());
    }

    // items
    findItemByName (name) { return this._inventory.findItem(name) }

    // the room inventory
    getInventoryDescription () {
        let itemDescriptions = [];

        this.items.forEach(item => {
            let itemLocation = this.node[item.name + '-Location'];

            itemDescriptions.push('{{defaultDescription}} There is ' + item.description + (itemLocation ? ' ' + itemLocation : '') + '.');
        });

        return itemDescriptions;
    }

    // command handling
    commandLook () {
        let description = '{{defaultDescription}}' + this.getGeneralDescription();

        return description;
    }

    // events
    get eventHandlers() {
       return {
            onPlayerEnter: this.handleOnPlayerEnter,
            onTell: this.handleOnTell
       }; 
    }

    setupRoomEvents(room) {
        const handledEvents = Object.keys(this.eventHandlers);

        handledEvents.forEach(event => {
            if (this._node[event] === undefined) {
                return;
            }

            if (typeof this._node[event] !== "Object") {
                this._node[event] = JSON.parse(this._node[event]);
            } 

            let eventFunc = (data, rgi, room, universe) => { 
                this.findEventHandler(event).call(this, data, rgi, room, universe)
            };

            this._trackedRoomEvents.push({
                event: event,
                func: eventFunc
            });
            
            room.events.on(event, eventFunc);
        });
    }

    removeRoomEvents(room) {
        this._trackedRoomEvents.forEach(ev => {
            room.events.removeListener(ev.event, ev.func);
        });

        this._trackedRoomEvents = [];
    }

    findEventHandler(event) {
        let func = this.eventHandlers[event];

        if (func === undefined) {
            func = () => {};
        }

        return func;
    }

    handleOnPlayerEnter(data, rgi, room, universe) {
        let actionConfigList = this._node.onPlayerEnter;

        let actions = new AllGameActions().createActionsFromList(actionConfigList);

        rgi.executeActions(actions, room, universe);
    }

    handleOnTell(data, rgi, room, universe) {
        if (rgi.debug && console) {
            console.log(`--- START ${this.displayName} Tell Responses ---`);
            console.log(`data: `, data);
            console.log(`rgi: `, rgi);
            console.log(`room: `, room);
            console.log(`universe: `, universe);
        }

        let actions = [];

        if (this._node.onTell.conditionalResponses !== undefined && Array.isArray(this._node.onTell.conditionalResponses)) {

            let matchedResponse = (_.filter(this._node.onTell.conditionalResponses, (response) => {
                if (response.keyPhrases === undefined || !Array.isArray(response.keyPhrases)) {
                    return false;
                }

                let matches = _.reduce(response.keyPhrases, (sum, phrase) => {
                    let phraseRegEx = new RegExp(phrase,'i');

                    if (rgi.debug && console) {
                        console.log(`checking key phrase on conditional reponse`);
                        console.log(`key phrase: `, phraseRegEx);
                        console.log(`test outcome: `, phraseRegEx.test(data.stringData)); 
                    }
                
                    if (phraseRegEx.test(data.stringData)) {
                        sum++;
                    }

                    return sum;
                }, 0);

                return matches > 0;
            }))[0];

            if (matchedResponse !== undefined) {
                actions = new AllGameActions().createActionsFromList(matchedResponse.actions);

                if (rgi.debug && console) {
                    console.log(`conditionalResponse found: `, matchedResponse);
                    console.log(`conditionalResponse actions: `, actions);
                }
            }
        }

        if (actions.length == 0 && this._node.onTell.defaultResponseActions !== undefined && Array.isArray(this._node.onTell.defaultResponseActions)) {
            if (rgi.debug && console) {
                console.log(`defaultResponseActions found: `, this._node.onTell.defaultResponseActions);
            }

            actions = new AllGameActions().createActionsFromList(this._node.onTell.defaultResponseActions);
        } 
        
        if (actions.length == 0) {
            if (rgi.debug && console) {
                console.log(`no conditionalResponse or defaultResponseActions found!`);
            }

            actions = [new TextAction(`{{npcHighlight}}${this.displayName} {{defaultDisplay}} doesn't seem to respond to you.`), room, universe];
        }

        rgi.executeActions(actions, room, universe);

        if (rgi.debug && console) {
            console.log(`--- END ${this.displayName} Tell Responses ---`);
        }
    }
}