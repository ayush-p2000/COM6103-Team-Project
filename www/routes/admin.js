const express = require('express');
const router = express.Router();

const {getAdminDashboard,deactivateUser, activateUser} = require("../controllers/admin/adminController");
const {
    getAccountDetailsPage, getAccountsPage, getEditAccountPage
} = require("../controllers/admin/adminAccountsController");

const {getReportsPage, getReportPage} = require("../controllers/admin/adminReportsController");
const {
    getDevicesPage, getFlaggedDevicesPage, getDeviceTypePage, getDeviceTypeDetailsPage,
    getUserDeviceDetailsPage, updateUserDeviceDetailsPage, getModelsFromTypeAndBrand,postNewDeviceType,
    postNewBrand, postNewModel, updateDeviceType, deleteDeviceType
} = require("../controllers/admin/adminDevicesController");

const {getModerationDashboard} = require("../controllers/admin/adminModerationController");

const {upload} = require('../middlewares/multer')
const {insertStaffDetails} = require("../controllers/admin/adminController");

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

router.get('/types/:subpage?', getDeviceTypePage);

router.get('/types/:subpage/:id', getDeviceTypeDetailsPage);
router.post('/types/:subpage/:id', updateDeviceType);
router.post('/types/:subpage/:id/delete', deleteDeviceType)

router.get('/devices/:id', getUserDeviceDetailsPage);

router.post('/devices/:id',upload.none(), updateUserDeviceDetailsPage)

router.get('/getModelFromBrandAndType', getModelsFromTypeAndBrand)

router.post('/accounts/:id', insertStaffDetails );

router.post('/deactivateUser',upload.none(), deactivateUser);

router.post('/activateUser',upload.none(), activateUser);

module.exports = router;