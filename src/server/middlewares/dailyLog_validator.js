let ErrorHandler = require("../utils/response_handler");
let ErrorCodes = require("../utils/error_codes");
let DailyLog = require("../models/daliy_log");
let validator = require("validator");
module.exports = (req, res, next) => {
    if (req.body) {
        let error = DailyLog.prototype.validateInput(req.body);
        if (error !== null) return ErrorHandler.error(res, ErrorCodes.WRONG_FORMAT, error);
    }

    let {year, month, day} = req.params;
    if (!validator.isNumeric(year)) return ErrorHandler.error(res, ErrorCodes.WRONG_FORMAT, "Year must be a number");
    if (!validator.isNumeric(month)) return ErrorHandler.error(res, ErrorCodes.WRONG_FORMAT, "Month must be a number");
    if (!validator.isNumeric(day)) return ErrorHandler.error(res, ErrorCodes.WRONG_FORMAT, "Day must be a number");

    next();
};