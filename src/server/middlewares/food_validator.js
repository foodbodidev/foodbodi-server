let Food = require("../models/food");
let ErrorHandler = require("../utils/response_handler");
let ErrorCodes = require("../utils/error_codes");
module.exports = (isUpdate) => {
    return (req, res, next) => {
        if (req.body) {
            let error = Food.prototype.validateInput(req.body, isUpdate || false);
            if (error === null) {
                next();
            } else {
                ErrorHandler.error(res, ErrorCodes.WRONG_FORMAT, error);
            }
        }
    }
};