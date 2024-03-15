/*
 * This controller should handle any operations related to device management or device type management
 */

const {renderAdminLayoutPlaceholder, renderAdminLayout} = require("../../util/layout/layoutUtils");
const {getAllUnknownDevices} = require("../../model/mongodb");

function getDevicesPage(req, res, next) {
    //TODO: Add functionality for the devices page
    renderAdminLayoutPlaceholder(req, res, "devices", {}, "Devices Page Here")
}

/**
 * Get Flagged Devices and Display for the Staff
 * @author Zhicong Jiang <zjiang34@sheffield.ac.uk>
 */
async function getFlaggedDevicesPage(req, res, next) {
    try {
        const devices = await getAllUnknownDevices()
        console.log(devices)
        renderAdminLayout(req, res, "unknown_devices", {devices});
    } catch (e) {
        console.log(e)
    }
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