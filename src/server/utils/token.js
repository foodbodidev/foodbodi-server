let CryptoJS = require("crypto-js");
let {hash} = require("./password");
let token_handler = {};
token_handler.createToken = (user) => {
    const salt = process.env.SALT || "secret";
    let {email} = user;
    let isAdmin = user.hasOwnProperty("is_admin") ? user.is_admin : false;
    let payload = {
        email : email,
        is_admin : isAdmin
    }.toString();
    const hashMessage = payload + salt;
    const hashValue = hash(hashMessage);
    const tokenRaw = payload + "-" + hashValue;
    const wordArray = CryptoJS.enc.Utf8.parse(tokenRaw);
    const base64 = CryptoJS.enc.Base64.stringify(wordArray);
    return base64;
};

token_handler.verifyToken = (token) => {
    let result = {};
    const salt = process.env.SALT || "secret";
    const parsedWordArray = CryptoJS.enc.Base64.parse(token);
    const parsedStr = parsedWordArray.toString(CryptoJS.enc.Utf8);
    let parts = parsedStr.split("-");
    if (parts.length === 2) {
        const raw = parts[0];
        const hashValue = parts[1];
        let hashMessage = raw + salt;
        let hashValue2 = hash(hashMessage);
        if (hashValue === hashValue2) {
            result = JSON.parse(raw);
            return result;
        } else {
            return null;
        }
    } else {
        return null;
    }
};

token_handler.getEmail = (req) => {
    return req.token_data.email;
};

token_handler.isAdmin = (req) => {
    return req.token_data.is_admin || false;
};

module.exports = token_handler;