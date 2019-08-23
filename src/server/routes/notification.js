const express = require("express");
const router = module.exports = express.Router();
const tokenVerifier = require("../middlewares/verify_token");
const license_validator = require("../middlewares/license_validator");

router.get("/markRead", tokenVerifier, notificationController.markRead);

router.get("/markUnread", tokenVerifier, notificationController.markUnread);