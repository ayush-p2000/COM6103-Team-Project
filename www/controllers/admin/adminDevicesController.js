/*
 * This controller should handle any operations related to device management or device type management
 */

const {renderAdminLayout,renderAdminLayoutPlaceholder} = require("../../util/layout/layoutUtils");

const {getItemDetail, getAllDeviceTypes, getAllBrands, updateDeviceDetails, getModels} = require("../../model/mongodb")

const dataService = require("../../model/enum/dataService")
const deviceCategory = require("../../model/enum/deviceCategory")
const deviceState = require("../../model/enum/deviceState")

const {Device} = require("../../model/schema/device")
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

/**
 * Get method to retrieve the details of the device from the staff side, which is then used to update the details of the device
 * @author Vinroy Miltan Dsouza <vmdsouza1@sheffield.ac.uk>
 */
async function getUserDeviceDetailsPage(req, res, next) {
    const item = await getItemDetail(req.params.id)
    const deviceType = await getAllDeviceTypes()
    const brands = await getAllBrands()
    const models = await getModels(item.brand._id, item.device_type._id)
    const specs = JSON.parse(item.model.properties.find(property => property.name === 'specifications')?.value)
    renderAdminLayout(req, res, "edit_details", {item, deviceType, brands, models, specs, dataService, deviceCategory, deviceState}, "User Device Details page")
}

async function getModelsFromTypeAndBrand(req, res) {
    const {deviceType, deviceBrand} = req.body
    console.log(deviceType)
    console.log(deviceBrand)
    try {
        const models = await getModels(deviceType, deviceBrand)
        res.json({models})
    } catch (err) {
        console.log(err)
        res.status(500).json({error: "internal server error"})
    }
}

/**
 * Update method to update the details of the device from the staff side, which is used when staff wants to change the device visibility, state etc.
 * @author Vinroy Miltan Dsouza <vmdsouza1@sheffield.ac.uk>
 */

const updateUserDeviceDetailsPage = async (req, res) => {
    try{
        const item_id = req.params.id;
        console.log(req.body)
        const updatedItem = await updateDeviceDetails(item_id, req.body)
        res.status(200).send(updatedItem._id)
    } catch (err) {
        console.log(err)
    }
}

module.exports = {
    getDevicesPage,
    getFlaggedDevicesPage,
    getDeviceTypePage,
    getDeviceTypeDetailsPage,
    getUserDeviceDetailsPage,
    updateUserDeviceDetailsPage,
    getModelsFromTypeAndBrand
}