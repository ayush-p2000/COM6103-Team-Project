var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get("/payment", (req,res,next) => {
  res.render('payment', {})
})

router.get("/signup", (req,res,next) => {
  res.render('user/signup', {})
})

router.get("/login", (req,res,next) => {
  res.render('user/login', {})
})

module.exports = router;
