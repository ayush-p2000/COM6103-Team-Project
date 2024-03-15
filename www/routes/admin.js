const express = require('express');
const router = express.Router();

const {getAdminDashboard} = require("../controllers/admin/adminController");
const {
    getAccountDetailsPage, getAccountsPage, getEditAccountPage
} = require("../controllers/admin/adminAccountsController");

const {getReportsPage, getReportPage} = require("../controllers/admin/adminReportsController");
const {
    getDevicesPage, getFlaggedDevicesPage, getDeviceTypePage, getDeviceTypeDetailsPage,postNewDeviceType,
    postNewBrand, postNewModel
} = require("../controllers/admin/adminDevicesController");

const {getModerationDashboard} = require("../controllers/admin/adminModerationController");

const {upload} = require("../middlewares/multer")

/* GET home page. */
router.get("/", getAdminDashboard)

router.get('/accounts', getAccountsPage);

router.get('/accounts/:id', getAccountDetailsPage);

router.get('/accounts/:id/edit', getEditAccountPage);

router.get('/devices', getDevicesPage);

router.get('/devices/flagged', getFlaggedDevicesPage);
router.post('/devices/postNewDeviceType',upload.none(), postNewDeviceType);
router.post('/devices/postNewBrand',upload.none(), postNewBrand);
router.post('/devices/postNewModel',upload.none(), postNewModel);

router.get('/moderation', getModerationDashboard);

router.get('/reports', getReportsPage);

router.get('/reports/:report_type', getReportPage);

router.get('/types', getDeviceTypePage);

router.get('/types/:id', getDeviceTypeDetailsPage);

module.exports = router;