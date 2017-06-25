import LookVerb from './verbs/look';
import BriefVerb from './verbs/brief';
import NorthVerb from './verbs/north';
import SouthVerb from './verbs/south';
import ErrorVerb from './verbs/error';

export default class AllVerbs {
    constructor () {
        this._verbMap = {};

        this.verbList.forEach((verb) => {
            verb.aliases.forEach((alias) => {
                this._verbMap[alias] = verb;
            });
        });
    }

    get verbList () {
        return [
            new BriefVerb(),
            new LookVerb(),
            new NorthVerb(),
            new SouthVerb(),
            new ErrorVerb()
        ];
    }

    get verbMap () { return this._verbMap; }

    findVerb (word) {
        let letters = word.toLowerCase().split('');
        let key = '';

        for (let i = 0; i < letters.length; i++) {
            key += letters[i];

            // we found a vern if the word entered matches a word in our verbMap and it's complete
            if (_.has(this.verbMap, key) && i === letters.length - 1) {
                return this.verbMap[key];
            }
        }

        return undefined;
    }
}
