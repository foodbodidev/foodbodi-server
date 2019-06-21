let Crypto = require("crypto-js");
let password_handler = {};

password_handler.hash = (password) => {
    return Crypto.MD5(password).toString();
};

module.exports = password_handler;