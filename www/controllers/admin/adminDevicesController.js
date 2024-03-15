/*
 * This controller should handle any operations related to device management or device type management
 */


const {renderAdminLayoutPlaceholder, renderAdminLayout} = require("../../util/layout/layoutUtils");
const {getAllUnknownDevices, getAllDeviceType, getAllBrand, getModels, addDeviceType, addBrand, addModel} = require("../../model/mongodb");

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
        const deviceTypes = await getAllDeviceType()
        const brands = await getAllBrand()

        renderAdminLayout(req, res, "unknown_devices", {devices,deviceTypes,brands});
    } catch (e) {
        console.log(e)
    }
}

async function postNewDeviceType(req, res, next) {
    try {
        console.log(req.body)
        const deviceType = await addDeviceType(req.body.name,req.body.description)
        res.status(200).send("successfully")
    } catch (e) {
        console.log(e)
    }
}

async function postNewBrand(req, res, next) {
    try {
        const brand = await addBrand(req.body.name)
        res.status(200).send("successfully")
    } catch (e) {
        console.log(e)
    }
}

async function postNewModel(req, res, next) {
    try {
        const model = await addModel(req.body.modelData)
        res.status(200).send("successfully")
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
    getDeviceTypeDetailsPage,
    postNewDeviceType,
    postNewBrand,
    postNewModel
}