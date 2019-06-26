var {verifyToken} = require("../utils/token");
let ErrorHandler = require("../utils/response_handler");
let ErrorCodes = require("../utils/error_codes");
module.exports = (req, res, next) => {
    const token = req.header("token") || "";
    const tokenData = verifyToken(token);
    if (tokenData !== null) {
        req.token_data = tokenData;
        next();
    } else {
        ErrorHandler.error(res, ErrorCodes.UNAUTHORIZED, "Token is invalid");
    }
};