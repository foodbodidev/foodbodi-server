let validator = require("validator");
let Restaurant = require("../models/restaurant");
let ErrorHandler = require("../utils/response_handler");
let ErrorCodes = require("../utils/error_codes");
module.exports = (req, res, next) => {
    if (req.body) {
        let error = Restaurant.prototype.validateInput(req.body);
        if (error === null) next();
        else {
            ErrorHandler.error(res, ErrorCodes.WRONG_FORMAT, error);
        }
    } else {
        next();
    }
};