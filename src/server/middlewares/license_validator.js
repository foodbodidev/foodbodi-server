let License = require("../models/license");
let ErrorHandler = require("../utils/response_handler");
let ErrorCodes = require("../utils/error_codes");
module.exports = (isCreate) => {
    return (req, res, next) => {
        if (req.body) {
            let error = License.prototype.validateInput(req.body, isCreate || false);
            if (error === null) {
                next();
            } else {
                ErrorHandler.error(res, ErrorCodes.WRONG_FORMAT, error);
            }
        }
    }
};