var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/reports', function(req, res, next) {
    res.render('reports/reports', { title: 'Reports' });
});

router.get('/reports/sales', function(req, res, next) {
    res.render('reports/report', { title: 'Sales', report: 'sales', data: {labels: [], datasets: []} });
});

router.get('/reports/referrals', function(req, res, next) {
    res.render('reports/report', { title: 'Referrals', report: 'referrals', data: {labels: [], datasets: []} });
});

router.get('/reports/classes', function(req, res, next) {
    res.render('reports/report', { title: 'Device Classes', report: 'device_classes', data: {labels: [], datasets: []} });
});

router.get('/reports/accounts', function(req, res, next) {
    res.render('reports/report', { title: 'Accounts', report: 'accounts', data: {labels: [], datasets: []} });
});

router.get('/reports/account_types', function(req, res, next) {
    res.render('reports/report', { title: 'Account Types', report: 'account_types', data: {labels: [], datasets: []} });
});

router.get('/reports/cases', function(req, res, next) {
    res.render('reports/report', { title: 'Cases', report: 'cases', data: {labels: [], datasets: []} });
});

router.get('/reports/devices', function(req, res, next) {
    res.render('reports/report', { title: 'Devices', report: 'devices', data: {labels: [], datasets: []} });
});

module.exports = router;