/*
 * This controller should handle any operations related to device management or device type management
 */

const {renderAdminLayoutPlaceholder} = require("../../util/layout/layoutUtils");

function getDevicesPage(req, res, next) {
    //TODO: Add functionality for the devices page
    renderAdminLayoutPlaceholder(req, res, "devices", {}, "Devices Page Here")
}

function getFlaggedDevicesPage(req, res, next) {
    //TODO: Add functionality for the flagged devices page
    renderAdminLayoutPlaceholder(req, res, "flagged_devices", {}, "Flagged Devices Page Here")

}

function getDeviceTypePage(req, res, next) {
    //TODO: Add functionality for the device type page
    renderAdminLayoutPlaceholder(req,res, "device_types", {}, "Device Type Page Here")
}

function getDeviceTypeDetailsPage(req, res, next) {
    //TODO: Add functionality for the device type details page
    renderAdminLayoutPlaceholder(req,res, "device_type_details", {}, "Device Type Details Page Here")
}

module.exports = {
    getDevicesPage,
    getFlaggedDevicesPage,
    getDeviceTypePage,
    getDeviceTypeDetailsPage
}