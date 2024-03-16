/*
 * This controller should handle any operations related to device management or device type management
 */

const gsmarena = require('gsmarena-api');
const {renderAdminLayoutPlaceholder, renderAdminLayout} = require("../../util/layout/layoutUtils");
const {getAllUnknownDevices, getAllDeviceType, getAllBrand, getModels, addDeviceType, addBrand, addModel} = require("../../model/mongodb");
const {get} = require("axios");

function getDevicesPage(req, res, next) {
    //TODO: Add functionality for the devices page
    renderAdminLayout(req, res, "devices", {})
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

/**
 * Get Data From Request and Pass it To Add DeviceType to db
 * @author Zhicong Jiang <zjiang34@sheffield.ac.uk>
 */
async function postNewDeviceType(req, res, next) {
    try {
        console.log(req.body)
        const deviceType = await addDeviceType(req.body.name,req.body.description)
        res.status(200).send("successfully")
    } catch (e) {
        console.log(e)
    }
}

/**
 * Get Data From Request and Pass it To Add Brand to db
 * @author Zhicong Jiang <zjiang34@sheffield.ac.uk>
 */
async function postNewBrand(req, res, next) {
    try {
        const brand = await addBrand(req.body.name)
        res.status(200).send("successfully")
    } catch (e) {
        console.log(e)
    }
}

/**
 * Get Data From Request and Pass it To Add Model to db
 * @author Zhicong Jiang <zjiang34@sheffield.ac.uk>
 */
async function postNewModel(req, res, next) {
    try {

        var properties = []
        var category = 3

        const devices = await gsmarena.search.search(req.body.name);
        if (devices[0]) {
            let slug = devices[0].id
            const devicesDetail = await get(`https://phone-specs-clzpu7gyh-azharimm.vercel.app/${slug}`)
            if (devicesDetail.data){
                var released = parseInt(devicesDetail.data.data.release_date.match(/\b\d+\b/)[0])
                properties.push({ name: 'picture', value: devicesDetail.data.data.thumbnail })
                properties.push({name:"specifications", value: JSON.stringify(devicesDetail.data.data.specifications)})
                properties.push({name:"released", value: released})
                //Greater than 10 is 2，5-10 is 1, 0-5 is 0
                const currentDate = new Date();
                const currentYear = currentDate.getFullYear()
                if ((currentYear - released) <=5){
                    category = 0
                }else if ((currentYear - released) >5 && (currentYear - released) <=10){
                    category = 1
                }else{
                    category = 2
                }
            }
        }

        const model = await addModel(req.body,properties,category)
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