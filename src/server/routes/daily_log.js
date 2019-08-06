const express = require("express");
const router = module.exports = express.Router();
const tokenVerifier = require("../middlewares/verify_token");
const dailyLogValidator = require("../middlewares/dailyLog_validator");

router.post("/:year/:month/:day", tokenVerifier, dailyLogValidator,  dailyLogController.update);

router.get("/:year/:month/:day", tokenVerifier, dailyLogValidator,  dailyLogController.get);