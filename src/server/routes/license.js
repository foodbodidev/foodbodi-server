const express = require("express");
const router = module.exports = express.Router();
const tokenVerifier = require("../middlewares/verify_token");
const license_validator = require("../middlewares/license_validator");

router.get("/approve", licenseController.approve);

router.get("/deny", licenseController.deny);

router.get("/notify", (req, res, next) => {
    let {restaurant_id} = req.query;
    licenseController.notifyManager(restaurant_id, (result) => {
        ErrorHandler.success(res, {message : "Email sent"})
    }, (error) => {
        ErrorHandler.error(res, ErrorCodes.ERROR, error);
    })
});
