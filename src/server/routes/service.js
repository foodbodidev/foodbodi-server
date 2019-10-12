var express = require('express');
const path = require('path');
const router = module.exports = express.Router()

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname + "/../views/index.html"));
});
router.get('/contact', function(req, res, next) {
  res.sendFile(path.join(__dirname + "/../views/contact.html"));
});
router.get('/about', function(req, res, next) {
  res.sendFile(path.join(__dirname + "/../views/about.html"));
});
router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname + "/../views/index.html"));
});
router.get("/privacy_policy", (req, res, next) => {
  res.sendFile(path.join(__dirname + "/../views/privacy.html"));
});
router.get("/terms_of_service", (req, res, next) => {
  res.render('terms_of_service', {})
});
router.get("/login", (req, res, next) => {
  res.render('login')
});
router.get("/test-notification", (req, res, next) => {
  res.render("test_notification");
});