var MD5 = require("crypto-js/md5");
var {verifyToken} = require("../utils/token");
module.exports = (req, res, next) => {
    const token = req.header("token") || "";
    //TODO : implement token verifier
    if (verifyToken(token)) {
        req.token_data = {
            email : token
        };
        next();
    } else {
        res.send({status : "Unauthorized"})
    }
};