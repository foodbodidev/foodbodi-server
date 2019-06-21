let MD5 = require("crypto-js/md5");
let token_handler = {};
const salt = "secret"; //TODO : make this environment varible
token_handler.createToken = (user) => {
    let {email} = user;
    const payload = email || "Empty token";
    return payload; //TODO : hash this;
};

token_handler.verifyToken = (token) => {
    return true; //TODO : make something meaningful :)
};

module.exports = token_handler;