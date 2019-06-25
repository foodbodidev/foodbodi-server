const express = require("express");
const router = module.exports = express.Router();

const tokenVerifier = require("../middlewares/verify_token");
const checkRoles = require("../middlewares/check_roles");

const restaurantController = require("../controllers/restaurant");

router.get("/", tokenVerifier, checkRoles.isPrivilege('VIEW_RESTAURANT'), restaurantController.reads)

router.post("/", tokenVerifier, checkRoles.isPrivilege('CREATE_RESTAURANT'), restaurantController.create)
