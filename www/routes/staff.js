var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/reports', function(req, res, next) {
    res.render('reports/reports', { title: 'Reports' });
});

module.exports = router;