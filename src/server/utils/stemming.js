let natural = require("natural");
var tokenizer = new natural.WordTokenizer();
let Stemmer = {};

Stemmer.defaultStem = (phrase) => {
    let tokens = tokenizer.tokenize(phrase);
    let stemmedTokens = tokens.map(token => {
        return natural.PorterStemmer.stem(token)
    });
    return stemmedTokens;
};

module.exports = Stemmer;