const express = require("express");
const router = module.exports = express.Router();
let {search} = require("../controllers/search");

router.get("", search);