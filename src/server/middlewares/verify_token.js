var {verifyToken} = require("../utils/token");
module.exports = (req, res, next) => {
    const token = req.header("token") || "";
    const tokenData = verifyToken(token);
    if (tokenData !== null) {
        req.token_data = tokenData;
        next();
    } else {
        res.send({status : "Unauthorized"})
    }
};