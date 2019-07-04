const express = require("express");
const router = module.exports = express.Router();
const tokenVerifier = require("../middlewares/verify_token");

router.get("/byId/:id", tokenVerifier, __foodController.get);

router.get("/search", tokenVerifier, __foodController.gets);

router.post("/", tokenVerifier, __foodController.create);

router.put("/:id", tokenVerifier, __foodController.update);

router.delete("/:id", tokenVerifier, __foodController.delete);
