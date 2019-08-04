const express = require("express");
const router = module.exports = express.Router();
const tokenVerifier = require("../middlewares/verify_token");
const Reservation = require("../controllers/reservation");
const reservationValidator = require("../middlewares/reservation_validator");

router.post("/", tokenVerifier, reservationValidator(true),  Reservation.create);
router.put("/:reservation_id", tokenVerifier, reservationValidator(true),  Reservation.update);
router.delete("/:reservation_id", tokenVerifier, reservationValidator(false),  Reservation.delete);
router.get("/mine", tokenVerifier, Reservation.mine);
router.get("/:reservation_id", tokenVerifier, reservationValidator(false),  Reservation.get);