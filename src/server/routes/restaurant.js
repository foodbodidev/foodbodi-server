const express = require("express");
var router = express.Router();

const tokenVerifier = require("../middlewares/verify_token");
const validator = require("../middlewares/restaurant_validator");
const checkRoles = require("../middlewares/check_roles");

const restaurantController = require("../controllers/restaurant");

router.get("/:id", tokenVerifier, restaurantController.get);

router.post("/", tokenVerifier, validator, restaurantController.create);

router.put("/:id", tokenVerifier,validator, restaurantController.update);

router.delete("/:id", tokenVerifier, restaurantController.delete);

module.exports = router;
