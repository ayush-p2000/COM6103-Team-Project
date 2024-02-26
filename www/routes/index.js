var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  //TODO: auth and role variables used to change the navbar links.
  res.render('index', { title: 'Express', auth:true, role:'user'});
});

module.exports = router;
