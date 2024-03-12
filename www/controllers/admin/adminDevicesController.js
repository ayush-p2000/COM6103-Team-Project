/*
 * This controller should handle any operations related to device management or device type management
 */

const {renderAdminLayout,renderAdminLayoutPlaceholder} = require("../../util/layout/layoutUtils");

const {getItemDetail, getAllDeviceTypes, getAllBrands, getAllModels, updateDeviceDetails,
getModel, getDeviceType, getBrand} = require("../../model/mongodb")

// const {dataService} = require("../../model/enum/dataService")

const {Device} = require("../../model/schema/device")
function getDevicesPage(req, res, next) {
    //TODO: Add functionality for the devices page
    renderAdminLayoutPlaceholder(res, "devices", {}, "Devices Page Here")
}

function getFlaggedDevicesPage(req, res, next) {
    //TODO: Add functionality for the flagged devices page
    renderAdminLayoutPlaceholder(res, "flagged_devices", {}, "Flagged Devices Page Here")

}

function getDeviceTypePage(req, res, next) {
    //TODO: Add functionality for the device type page
    renderAdminLayoutPlaceholder(res, "device_types", {}, "Device Type Page Here")
}

function getDeviceTypeDetailsPage(req, res, next) {
    //TODO: Add functionality for the device type details page
    renderAdminLayoutPlaceholder(res, "device_type_details", {}, "Device Type Details Page Here")
}

async function getUserDeviceDetailsPage(req, res, next) {
    const item = await getItemDetail(req.params.id)
    const deviceType = await getAllDeviceTypes()
    const brands = await getAllBrands()
    const models = await getAllModels()
    console.log(item)
    renderAdminLayout(res, "edit_details", {item, deviceType, brands, models}, "User Device Details page")
}

async function updateUserDeviceDetailsPage(req, res, next) {
    const item = req.body;
    const item_id = req.params.id
    const dataService = ['NO_DATA_SERVICE',
        'DATA_WIPING',
        'DATA_RECOVERY']
    const deviceCategory = [
        'CURRENT',
        'RARE',
        'RECYCLE',
        'UNKNOWN'
    ]
    const device_type = await getDeviceType(item.deviceType)
    const brand = await getBrand(item.deviceBrand)
    const model = await getModel(item.deviceModel)
    const device = {
        device_type: device_type._id,
        brand: brand._id,
        model: model._id,
        category: deviceCategory.indexOf(item.deviceCategory),
        capacity: item.deviceCapacity,
        good_condition: item.conditionRadio === 'Yes'? true: false,
        data_service: dataService.indexOf(item.dataRadio)
    }
    console.log(device)
    const updatedItem = await updateDeviceDetails(item_id, device)
    if (updatedItem === 'OK') {
        res.redirect("/admin/devices")
    } else {
        console.log(updatedItem)
    }

}

module.exports = {
    getDevicesPage,
    getFlaggedDevicesPage,
    getDeviceTypePage,
    getDeviceTypeDetailsPage,
    getUserDeviceDetailsPage,
    updateUserDeviceDetailsPage
}