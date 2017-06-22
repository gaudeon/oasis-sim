import LookVerb from './verbs/look';

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
            new LookVerb()
        ];
    }

    get verbMap () { return this._verbMap; }

    findVerb (word) {
        let letters = word.toLowerCase().split('');
        let key = '';

        for (let i = 0; i < letters.length; i++) {
            key += letters[i];

            if (_.has(this.verbMap, key)) {
                return this.verbMap[key];
            }
        }

        return undefined;
    }
}
