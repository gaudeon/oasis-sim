export default class LexemePhrase {
    constructor () {
        this._phraseTemplate = [];

        this._tokenSentence = [];

        this._phraseTemplateACL = []; // if an entry is undefined everything is whitelistes else should be a hash map with word name as key and boolean as value
    }

    get phraseTemplate () { return this._phraseTemplate; }

    get phraseTemplateKey () { return this._phraseTemplate.join('-'); }

    get phraseTemplateACL () { return this._phraseTemplateACL; }

    get tokenSentence () { return this._tokenSentence; }

    set tokenSentence (sentence) { this._tokenSentence = Array.isArray(sentence) ? sentence : [sentence]; }
}
