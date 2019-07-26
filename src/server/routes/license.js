const express = require("express");
const router = module.exports = express.Router();
const tokenVerifier = require("../middlewares/verify_token");
const license_validator = require("../middlewares/license_validator");

router.post("/", tokenVerifier, license_validator(true), licenseController.create);

router.get("/", tokenVerifier, licenseController.get);

router.get("/approve", licenseController.approve);

router.get("/deny", licenseController.deny);

router.get("/notify", licenseController.notifyManager);
