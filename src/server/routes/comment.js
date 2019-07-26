const express = require("express");
const router = module.exports = express.Router();
const tokenVerifier = require("../middlewares/verify_token");

router.post("/", tokenVerifier,  __commentController.create);

router.get("/", tokenVerifier,  __commentController.reads);
