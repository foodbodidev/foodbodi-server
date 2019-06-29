let validator = require("validator");
let Restaurant = require("../models/restaurant");
let ErrorHandler = require("../utils/response_handler");
let ErrorCodes = require("../utils/error_codes");
module.exports = (req, res, next) => {
    if (req.body) {
        let valid = Restaurant.prototype.validateInput(req.body);
        if (valid) next();
        else {
            ErrorHandler.error(res, ErrorCodes.WRONG_FORMAT, "")
        }
    } else {
        next();
    }
};