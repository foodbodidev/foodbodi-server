let Reservation = require("../models/reservation");
let ErrorHandler = require("../utils/response_handler");
let ErrorCodes = require("../utils/error_codes");
module.exports = (hasData) => {
    return (req, res, next) => {
    if (req.params.id) {
        const error = Reservation.prototype.validateId(req.params.id);
        if (error !== null) return ErrorHandler.error(res, ErrorCodes.WRONG_FORMAT, error);
    }

    if (hasData) {
        if (req.body) {
            const error = Reservation.prototype.validateInput(req.body);
            if (error !== null) return ErrorHandler.error(res, ErrorCodes.WRONG_FORMAT, error);
        }
    }
    next();
}
};