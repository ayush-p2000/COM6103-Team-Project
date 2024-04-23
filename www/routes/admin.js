const express = require('express');
const router = express.Router();

const {getAdminDashboard,deactivateUser, activateUser} = require("../controllers/admin/adminController");

const {
    getAccountDetailsPage, getAccountsPage, getEditAccountPage, createStaff, deleteUser
} = require("../controllers/admin/adminAccountsController");

const {getReportsPage, getReportPage} = require("../controllers/admin/adminReportsController");

const {
    getDevicesPage, getFlaggedDevicesPage, getDeviceTypePage, getDeviceTypeDetailsPage,
    getUserDeviceDetailsPage, updateUserDeviceDetailsPage, getModelsFromTypeAndBrand,postNewDeviceType,
    postNewBrand, postNewModel, getRetrievalDevicesPage, updateDeviceType, deleteDeviceType, postDeviceStateOverride, postDeviceDemotion, postDevicePromotion,
    postDeviceChangeRequest, postDeviceVisibility
} = require("../controllers/admin/adminDevicesController");

const {getModerationDashboard} = require("../controllers/admin/adminModerationController");
const {validateDeviceTypeEdit, validateProfileUpdate,
    validateAdminProfileUpdate} = require("../middlewares/validators")

const {upload} = require('../middlewares/multer')

const {insertStaffDetails} = require("../controllers/admin/adminController");

const {populateDeviceObject} = require("../middlewares/devices");

/* GET home page. */
router.get("/", getAdminDashboard)

router.get('/accounts', getAccountsPage);

router.get('/accounts/:id', getAccountDetailsPage);

router.get('/accounts/:id/edit', getEditAccountPage);

router.get('/devices', getDevicesPage);

router.get('/devices/flagged', getFlaggedDevicesPage);
router.get('/devices/retrievals', getRetrievalDevicesPage);
router.post('/devices/postNewDeviceType', upload.none(), postNewDeviceType);
router.post('/devices/postNewBrand', upload.none(), postNewBrand);
router.post('/devices/postNewModel', upload.none(), postNewModel);

router.get('/devices/:id', getUserDeviceDetailsPage);
router.post('/devices/:id',upload.none(), updateUserDeviceDetailsPage)
router.post('/devices/:id/promote',upload.none(), populateDeviceObject, postDevicePromotion)
router.post('/devices/:id/demote',upload.none(), populateDeviceObject, postDeviceDemotion)
router.post('/devices/:id/state',upload.none(), populateDeviceObject, postDeviceStateOverride)
router.post('/devices/:id/changes',upload.none(), populateDeviceObject, postDeviceChangeRequest)
router.post('/devices/:id/visibility',upload.none(), populateDeviceObject, postDeviceVisibility)

router.get('/moderation', getModerationDashboard);

router.get('/reports', getReportsPage);

router.get('/reports/:report_type', getReportPage);

router.get('/types/:subpage?', getDeviceTypePage);

router.get('/types/:subpage/:id', getDeviceTypeDetailsPage);
router.post('/types/:subpage/:id', validateDeviceTypeEdit, updateDeviceType);
router.post('/types/:subpage/:id/delete', deleteDeviceType)

router.get('/getModelFromBrandAndType', getModelsFromTypeAndBrand)


router.post('/accounts/create', upload.none(), createStaff);
router.post('/accounts/:id', validateAdminProfileUpdate, insertStaffDetails);

router.post('/deactivateUser', upload.none(), deactivateUser);

router.post('/activateUser', upload.none(), activateUser);

router.get('/error', upload.none(),)

router.post('/deleteUser',upload.none(),deleteUser);


module.exports = router;