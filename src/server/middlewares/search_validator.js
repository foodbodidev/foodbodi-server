let SearchInfo = require("../utils/search_info");
let ErrorHandler = require("../utils/response_handler");
let ErrorCodes = require("../utils/error_codes");
module.exports = (req, res, next) => {
    if (req.body) {
        let error = SearchInfo.prototype.validate(req.body);
        if (error === null) {
            next();
        } else {
            ErrorHandler.error(res, ErrorCodes.WRONG_FORMAT, "Search query has wrong format");
        }
    }
};