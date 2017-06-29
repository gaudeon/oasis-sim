import LookVerb from './verbs/look';
import BriefVerb from './verbs/brief';
import NorthVerb from './verbs/north';
import SouthVerb from './verbs/south';
import ErrorVerb from './verbs/error';
import GetVerb from './verbs/get';

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
            BriefVerb,
            LookVerb,
            NorthVerb,
            SouthVerb,
            ErrorVerb,
            GetVerb
        ];
    }

    get verbMap () { return this._verbMap; }

    findVerb (word, wordACL, words, room, player) {
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
