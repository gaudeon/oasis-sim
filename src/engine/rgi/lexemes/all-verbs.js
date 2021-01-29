import LookVerb from './verbs/look';
import NorthVerb from './verbs/north';
import SouthVerb from './verbs/south';
import EastVerb from './verbs/east';
import WestVerb from './verbs/west';
import NorthEastVerb from './verbs/northeast';
import NorthWestVerb from './verbs/northwest';
import SouthEastVerb from './verbs/southeast';
import SouthWestVerb from './verbs/southwest';
import UpVerb from './verbs/up';
import DownVerb from './verbs/down';
import ErrorVerb from './verbs/error';
import GetVerb from './verbs/get';
import PutVerb from './verbs/put';
import HelpVerb from './verbs/help';
import HistoryVerb from './verbs/history';
import InventoryVerb from './verbs/inventory';
import ExitsVerb from './verbs/exits';

export default class AllVerbs {
    constructor () {
        this._verbMap = {};

        this.verbList.forEach((VerbClass) => {
            let tempVerb = new VerbClass();

            this._verbMap[tempVerb.word] = VerbClass;

            tempVerb.aliases.forEach((alias) => {
                this._verbMap[alias] = VerbClass;
            });
        });
    }

    get verbList () {
        return [
            LookVerb,
            NorthVerb,
            SouthVerb,
            EastVerb,
            WestVerb,
            NorthEastVerb,
            NorthWestVerb,
            SouthEastVerb,
            SouthWestVerb,
            UpVerb,
            DownVerb,
            ErrorVerb,
            GetVerb,
            PutVerb,
            HelpVerb,
            HistoryVerb,
            InventoryVerb,
            ExitsVerb
        ];
    }

    get verbMap () { return this._verbMap; }

    findVerb (word, wordACL, words, room, universe) {
        let letters = word.toLowerCase().split('');
        let key = '';

        for (let i = 0; i < letters.length; i++) {
            key += letters[i];

            // we found a verb if the word entered matches a word in our verbMap and it's complete
            if (_.has(this.verbMap, key) && i === letters.length - 1) {
                let VerbClass = this.verbMap[key];
                let verb = new VerbClass();

                if (typeof wordACL === 'undefined' || (typeof wordACL === 'object' && wordACL[verb.word])) {
                    return verb;
                }
            }
        }

        return undefined;
    }
}
