const express = require('express');
const router = express.Router();

const {getAdminDashboard} = require("../controllers/admin/adminController");
const {
    getAccountDetailsPage, getAccountsPage, getEditAccountPage
} = require("../controllers/admin/adminAccountsController");

const {getReportsPage, getReportPage} = require("../controllers/admin/adminReportsController");
const {
    getDevicesPage, getFlaggedDevicesPage, getDeviceTypePage, getDeviceTypeDetailsPage,
    getUserDeviceDetailsPage, updateUserDeviceDetailsPage
} = require("../controllers/admin/adminDevicesController");

const {getModerationDashboard} = require("../controllers/admin/adminModerationController");

/* GET home page. */
router.get("/", getAdminDashboard)

router.get('/accounts', getAccountsPage);

router.get('/accounts/:id', getAccountDetailsPage);

router.get('/accounts/:id/edit', getEditAccountPage);

router.get('/devices', getDevicesPage);

router.get('/devices/flagged', getFlaggedDevicesPage);

router.get('/moderation', getModerationDashboard);

router.get('/reports', getReportsPage);

router.get('/reports/:report_type', getReportPage);

router.get('/types', getDeviceTypePage);

router.get('/types/:id', getDeviceTypeDetailsPage);

router.get('/devices/:id', getUserDeviceDetailsPage);

router.post('/devices/update_device/:id', updateUserDeviceDetailsPage)

module.exports = router;