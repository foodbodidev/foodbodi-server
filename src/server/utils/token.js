let CryptoJS = require("crypto-js");
let {hash} = require("./password");
let token_handler = {};
token_handler.createToken = (user) => {
    const salt = "secret"; //TODO : make this environment varible
    let {email} = user;
    const hashMessage = email + salt;
    const hashValue = hash(hashMessage);
    const tokenRaw = email + "-" + hashValue;
    const wordArray = CryptoJS.enc.Utf8.parse(tokenRaw);
    const base64 = CryptoJS.enc.Base64.stringify(wordArray);
    return base64;
};

token_handler.verifyToken = (token) => {
    let result = {};
    const salt = "secret"; //TODO : make this environment varible
    const parsedWordArray = CryptoJS.enc.Base64.parse(token);
    const parsedStr = parsedWordArray.toString(CryptoJS.enc.Utf8);
    let parts = parsedStr.split("-");
    if (parts.length === 2) {
        const email = parts[0];
        const hashValue = parts[1];
        let hashMessage = email + salt;
        let hashValue2 = hash(hashMessage);
        if (hashValue === hashValue2) {
            result.email = email;
            return result;
        } else {
            return null;
        }
    } else {
        return null;
    }
};

module.exports = token_handler;