let validator = require("validator");
let Category = require("../models/restaurant_category");
let Type = require("../models/restaurant_type");
let ErrorHandler = require("../utils/response_handler");
let ErrorCodes = require("../utils/error_codes");
module.exports = (req, res, next) => {
    if (req.body) {
        let {name, address, category, type, lat, lng} = req.body;
        let valid = name !== null && validator.isAlphanumeric(name);
        valid &= address !== null && validator.isAlphanumeric(address);
        valid &= category !== null && Category.hasOwnProperty(category);
        valid &= type !== null && Type.hasOwnProperty(type);
        valid &= lat !== null && validator.isNumeric(lat);
        valid &= lng !== null && validator.isNumeric(lng);
        if (valid) next();
        else {
            ErrorHandler.error(res, ErrorCodes.WRONG_FORMAT, "")
        }
    } else {
        next();
    }
};