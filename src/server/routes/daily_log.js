const express = require("express");
const router = module.exports = express.Router();
const tokenVerifier = require("../middlewares/verify_token");

router.post("/:year/:month/:day", tokenVerifier,  dailyLogController.update);

router.get("/:year/:month/:day", tokenVerifier,  dailyLogController.get);