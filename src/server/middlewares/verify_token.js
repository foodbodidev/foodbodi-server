var MD5 = require("crypto-js/md5");
var base64 = require("crypto-js/base64");
module.exports = (req, res, next) => {
    const token = req.header("token");
    //TODO : implement token verifier
    req.token_data = {};
    next();
};