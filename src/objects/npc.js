import AllGameActions from "../engine/all-game-actions";
import TextAction from '../engine/game-actions/text';

export default class Npc {
    constructor (model, inventory, universe) {
        this._universe = universe;

        this._model = model;

        this._inventory = inventory;

        // run through items this npc has to start and add them to the inventory
        this._model.items.forEach(item => {
            this._inventory.addItem(universe.findItem(item.id));
        });

        this._trackedRoomEvents = [];
    }

    get universe () { return this._universe; }

    get model () { return this._model; }

    get inventory () { return this._inventory; }

    // room related
    get room () { return this._room; }

    set room (r) { 
        if (this._room !== undefined) {
            this.removeRoomEvents(this._room);
        }

        this._room = r;
    
        this.setupRoomEvents(this._room);
    }

    // command handling
    commandLook () {
        let description = '{{defaultDescription}}' + this.fullDescription;

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

            eventTriggers = this.model.findEventTriggersByEvent(event);

            if (eventTriggers.length === 0) {
                return;
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
        let eventTriggers = this.model.findEventTriggersByEvent('onPlayerEnter');

        let actions = [];
        eventTriggers.forEach(eventTrigger => {
            actions.push(new AllGameActions().createAction(eventTrigger.model.type, eventTrigger.model.data));
        });

        rgi.executeActions(actions, room, universe);
    }

    handleOnTell(data, rgi, room, universe) {
        if (rgi.debug && console) {
            console.log(`--- START ${this.name} Tell Responses ---`);
            console.log(`data: `, data);
            console.log(`rgi: `, rgi);
            console.log(`room: `, room);
            console.log(`universe: `, universe);
        }

        let eventTriggers = this.model.findEventTriggersByEvent('onTell');

        let defaultResponses = _.filter(eventTriggers, eventTrigger => { return !!eventTrigger.model.node.defaultResponse });
        let conditionalResponses = _.filter(eventTriggers, eventTrigger => { return !!!eventTrigger.model.node.defaultResponse });

        let actions = [];
        if (conditionalResponses.length > 0) {
            if (rgi.debug && console) {
                console.log(`conditionalResponses found: `, defaultResponses);
            }

            let matchedResponses = (_.filter(conditionalResponses, response => {
                const keyPhrases =response.model.node.keyPhrases;
                if (keyPhrases === undefined || !Array.isArray(keyPhrases)) {
                    return false;
                }

                let matches = _.reduce(keyPhrases, (sum, phrase) => {
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

            matchedResponses.forEach(response => {
                actions.push(new AllGameActions().createAction(response.model.type,response.model.data));

                if (rgi.debug && console) {
                    console.log(`conditionalResponse found: `, matchedResponse);
                    console.log(`conditionalResponse actions: `, actions);
                }
            });
        }

        if (actions.length == 0 && defaultResponses.length > 0) {
            if (rgi.debug && console) {
                console.log(`defaultResponses found: `, defaultResponses);
            }

            defaultResponses.forEach(response => {
                actions.push(new AllGameActions().createAction(response.model.type,response.model.data));

                if (rgi.debug && console) {
                    console.log(`defaultResponse found: `, response);
                    console.log(`conditionalResponse actions: `, actions);
                }
            });
        } 
        
        if (actions.length == 0) {
            if (rgi.debug && console) {
                console.log(`no conditionalResponse or defaultResponseActions found!`);
            }

            actions = [new TextAction(`{{npcHighlight}}${this.name} {{defaultDisplay}} doesn't seem to respond to you.`), room, universe];
        }

        rgi.executeActions(actions, room, universe);

        if (rgi.debug && console) {
            console.log(`--- END ${this.name} Tell Responses ---`);
        }
    }
}