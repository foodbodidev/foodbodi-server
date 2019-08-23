const express = require("express");
const router = module.exports = express.Router();
const tokenVerifier = require("../middlewares/verify_token");

router.get("/:id", ingredientController.get);

router.post("/", ingredientController.create);

router.put("/:id", ingredientController.update);

router.delete("/:id", ingredientController.delete);

