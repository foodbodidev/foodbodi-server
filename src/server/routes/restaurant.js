const express = require("express");
const router = module.exports = express.Router();

const tokenVerifier = require("../middlewares/verify_token");
const validator = require("../middlewares/restaurant_validator");
const checkRoles = require("../middlewares/check_roles");


router.get("/:id/foods", __restaurantController.listFood);

router.get("/list", __restaurantController.list);

router.get("/mine", tokenVerifier, __restaurantController.myRestaurant);

router.get("/:id", tokenVerifier, __restaurantController.get);

router.post("/", tokenVerifier, validator(true), __restaurantController.create);

router.put("/:id", tokenVerifier,validator(false), __restaurantController.update);

router.delete("/:id", tokenVerifier, __restaurantController.delete);

