const express = require("express");
const router = module.exports = express.Router();
const tokenVerifier = require("../middlewares/verify_token");
const food_validator = require("../middlewares/food_validator");

router.get("/search", tokenVerifier,  __foodController.search);

router.get("/:id", tokenVerifier, __foodController.get);

router.post("/", tokenVerifier, food_validator(false), __foodController.create);

router.post("/import", tokenVerifier, __foodController.import);

router.put("/:id", tokenVerifier, food_validator(true), __foodController.update);

router.delete("/:id", tokenVerifier, __foodController.delete);
