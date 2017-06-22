export default class LexemePhrase {
    constructor () {
        this._phraseTemplate = [];

        this._tokenSentence = [];
    }

    get phraseTemplate () { return this._phraseTemplate; }

    get phraseTemplateKey () { return this._phraseTemplate.join('-'); }

    get tokenSentence () { return this._tokenSentence; }

    set tokenSentence (sentence) { this._tokenSentence = Array.isArray(sentence) ? sentence : [sentence]; }
}
