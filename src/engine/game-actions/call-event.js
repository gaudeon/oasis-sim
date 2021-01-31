import GameAction from '../game-action';

export default class CallEventAction extends GameAction {
    constructor (data) {
        super(data);

        this._type = 'call-event';

        if (!this.data.event) {
            throw new Error('event not defined')
        }

        if (!this.data.eventSource) {
            throw new Error('eventSource not defined')
        }

        if (!this.data.eventData) {
            throw new Error('eventData not defined')
        }

        this._outputCommand = false;
    }

    get outputCommand () { return this._outputCommand; }

    set outputCommand (outputCommand) { this._outputCommand = outputCommand; }

    run (rgi, buffer, room, universe, lastCommand) {
        if (this.debug && console) {
            console.log(`--- Start Call Event Action ---`);
            console.log(`event: `, this.data.event);
            console.log(`eventSource: `, this.data.eventSource);
            console.log(`eventData: `, this.data.eventData);
            console.log(`RGI: `, rgi);
            console.log(`RGI: Buffer: `, buffer);
            console.log(`RGI: Room: `, room);
            console.log(`RGI: Universe: `, universe);
            console.log(`RGI: Last Command: `, lastCommand);
        }

        this.data.eventSource.events.emit(this.data.event, this.data.eventData, rgi, room, universe);

        if (this.debug && console) {
            console.log(`--- End Call Event Action ---`);
        }
    }
}
