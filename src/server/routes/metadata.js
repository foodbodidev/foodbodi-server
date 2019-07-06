const express = require("express");
const router = module.exports = express.Router();
let Category = require("../models/restaurant_category");
let Type = require("../models/restaurant_type");
let ErrorHandler = require("../utils/response_handler");

router.get("/restaurant_category", (req, res, next) => {
    ErrorHandler.success(res, Category);
});

router.get("/restaurant_type", (req, res, next) => {
    ErrorHandler.success(res, Type);
});