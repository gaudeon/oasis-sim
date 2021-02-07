import AllGameActions from "../engine/all-game-actions";
import TextAction from '../engine/game-actions/text';
import EventTriggerModel from '../models/event-trigger';
import EventTrigger from './event-trigger';

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
        let description = '{{defaultDescription}} You see ' + this.model.description;

        return [new TextAction(description)];
    }

    // events
    get eventHandlers() {
       return {
            onPlayerEnter: this.handleOnPlayerEnter,
            onTell: this.handleOnTell,
            onIdle: this.handleOnIdle
       }; 
    }

    setupRoomEvents(theRoom) {
        const handledEvents = Object.keys(this.eventHandlers);

        handledEvents.forEach(event => {

            let eventTriggers = this.model.findEventTriggersByEvent(event);

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
            
            theRoom.events.on(event, eventFunc);
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
            actions.push(new AllGameActions().createAction(eventTrigger.action_type, eventTrigger.action_data));
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

        let defaultResponses = _.filter(eventTriggers, eventTrigger => { return !!eventTrigger.node.defaultResponse });
        let conditionalResponses = _.filter(eventTriggers, eventTrigger => { return !!!eventTrigger.node.defaultResponse });

        let actions = [];
        if (conditionalResponses.length > 0) {
            if (rgi.debug && console) {
                console.log(`conditionalResponses found: `, conditionalResponses);
            }

            let matchedResponses = _.filter(conditionalResponses, response => {
                const keyPhrases = JSON.parse(response.node.keyPhrases);

                if (rgi.debug && console) {
                    console.log(`conditionalResponse keyPhrases: `, keyPhrases);
                }

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

                if (rgi.debug && console) {
                    console.log(`count of matches for key phrases in conditional response: `, matches);
                }

                return matches > 0;
            });

            if (rgi.debug && console) {
                console.log(`matched responses found: `, matchedResponses);
            }

            matchedResponses.forEach(response => {
                actions.push(new AllGameActions().createAction(response.action_type,response.action_data));

                if (rgi.debug && console) {
                    console.log(`conditionalResponse found: `, response);
                    console.log(`conditionalResponse actions: `, actions);
                }
            });
        }

        if (actions.length == 0 && defaultResponses.length > 0) {
            if (rgi.debug && console) {
                console.log(`defaultResponses found: `, defaultResponses);
            }

            defaultResponses.forEach(response => {
                actions.push(new AllGameActions().createAction(response.action_type,response.action_data));

                if (rgi.debug && console) {
                    console.log(`defaultResponse found: `, response);
                    console.log(`defaultResponse actions: `, actions);
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

    handleOnIdle(data, rgi, room, universe) {
        if (rgi.debug && console) {
            console.log(`--- START ${this.name} Idle Responses ---`);
            console.log(`data: `, data);
            console.log(`rgi: `, rgi);
            console.log(`room: `, room);
            console.log(`universe: `, universe);
        }

        let actions = [];
        if (this.idleEventTriggers.length > 0) {
            if (rgi.debug && console) {
                console.log(`Idle Responses found: `, this.idleEventTriggers);
            }

            let maxValue = _.reduce(this.idleEventTriggers, (max, eventTrigger) => { return max > eventTrigger.max ? max : eventTrigger.max; }, 0);

            let randValue = Math.floor(Math.random() * maxValue);

            if (rgi.debug && console) {
                console.log(`maxValue and randValue of idle response: `, maxValue, randValue);
            } 

            let idleEvent = _.find(this.idleEventTriggers, idleEventTrigger => {
                if (rgi.debug && console) {
                    console.log(`testing idleEvent: `, idleEventTrigger, randValue >= idleEventTrigger.min && randValue <= idleEventTrigger.max);
                } 

                return randValue >= idleEventTrigger.min && randValue <= idleEventTrigger.max;
            });

             if (rgi.debug && console) {
                console.log(`idleEvent found: `, idleEvent);
            } 

            actions.push(new AllGameActions().createAction(idleEvent.eventTrigger.model.action_type, idleEvent.eventTrigger.model.action_data));
        }

        rgi.executeActions(actions, room, universe);

        if (rgi.debug && console) {
            console.log(`--- END ${this.name} Idle Responses ---`);
        }
    }

    get idleChance () {
        return {
            rare: 5,
            uncommon: 15,
            common: 50,
            frequent: 150,
            none: 780
        };
    }

    get idleEventTriggers () {

        if (Array.isArray(this._idleEventTriggers)) {
            return this._idleEventTriggers;
        }

        this._idleEventTriggers = [];

        let currentLimit = 0;

        let eventTriggers = this.model.findEventTriggersByEvent('onIdle');
        
        eventTriggers.forEach(eventTriggerModel => {
            let eventTrigger = this.universe.findEventTrigger(eventTriggerModel.id);
            let frequency = eventTrigger.model.node.frequency && eventTrigger.model.node.frequency.match(/^(frequent|common|uncommon|rare)$/) ? eventTrigger.model.node.frequency : 'uncommon'; 

            this._idleEventTriggers.push({
                min: currentLimit,
                max: currentLimit + this.idleChance[frequency] - 1,
                eventTrigger: eventTrigger
            });

            currentLimit = currentLimit + this.idleChance[frequency];
        });

        this._idleEventTriggers.push({
            min: currentLimit,
            max: currentLimit + this.idleChance['none'] - 1,
            eventTrigger: this.nullEventTrigger
        });

        return this._idleEventTriggers;
    }

    get nullEventTrigger () {
        return new EventTrigger(new EventTriggerModel({
            event: 'onIdle',
            type: 'NullAction',
            tags: ['event'],
            frequency: 'none'
        }, this.model.universe), this.universe);
    }
}