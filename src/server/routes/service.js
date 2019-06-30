var express = require('express');
const router = module.exports = express.Router()

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get("/privacy_policy", (req, res, next) => {
  res.render('privacy_policy', {})
});
router.get("/terms_of_service", (req, res, next) => {
  res.render('terms_of_service', {})
});
router.get("/login", (req, res, next) => {
  res.render('login')
});