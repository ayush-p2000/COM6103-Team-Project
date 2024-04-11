/*
 * This controller should handle any operations related to device management or device type management
 */

const gsmarena = require('gsmarena-api');
const {get} = require("axios");
const {renderAdminLayout,renderAdminLayoutPlaceholder} = require("../../util/layout/layoutUtils");
const {getItemDetail, getAllDeviceType, getAllBrand, updateDeviceDetails, getModels,getAllUnknownDevices, addDeviceType, addBrand, addModel,
    getUnknownDeviceHistoryByDevice,
    getAllModels,
    getBrandById,
    getDeviceTypeById,
    getModelById,
    updateDeviceTypeDetails,
    updateBrandDetails,
    updateModelDetails,
    getAllModelsOfType,
    deleteType,
    deleteModel,
    deleteBrand
    getAllDevices,
    getAllRetrievalDevices
} = require("../../model/mongodb")

const dataService = require("../../model/enum/dataService")
const deviceCategory = require("../../model/enum/deviceCategory")
const deviceState = require("../../model/enum/deviceState")

const {Device} = require("../../model/schema/device")
const {getBrand} = require("gsmarena-api/src/services/catalog");
const {DeviceType} = require("../../model/schema/deviceType");

/**
 * Get All Device with Specific Field Showing and Support Unknown Devices
 * @author Zhicong Jiang <zjiang34@sheffield.ac.uk>
 */
async function getDevicesPage(req, res, next) {
    const devices = await getAllDevices();
    for (const device of devices) {
        if (device.model == null) {
            var deviceType = ""
            var brand = ""
            var model = ""
            const customModel = await getUnknownDeviceHistoryByDevice(device._id)
            customModel[0].data.forEach(data => {
                if (data.name === "device_type") {
                    deviceType = data.value
                } else if (data.name === "brand") {
                    brand = data.value
                } else if (data.name === "model") {
                    model = data.value
                }
            });
            device.device_type = {name: deviceType}
            device.brand = {name: brand}
            device.model = {name: model}
        }
    }

    renderAdminLayout(req, res, "devices", {devices: devices,deviceState,deviceCategory})
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
        res.status(500);
        next(e);
    }
}

async function getRetrievalDevicesPage(req, res, next) {
    try {
        const devices = await getAllRetrievalDevices()
        const deviceTypes = await getAllDeviceType()
        const brands = await getAllBrand()

        renderAdminLayout(req, res, "retrieval_devices", {devices,deviceTypes,brands, deviceCategory, deviceState});
    } catch (e) {
        console.log(e)
        res.status(500);
        next(e);
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

async function getDeviceTypePage(req, res, next) {
    const subpage = req.params.subpage ? req.params.subpage : "brands";
    const deviceTypes = await getAllDeviceType()
    const brands = await getAllBrand()
    const models = subpage === "models" ? await getAllModels() : [];

    renderAdminLayoutPlaceholder(req,res, "device_types", {brands,deviceTypes,subpage,models}, null)
}

/**
 * Device Type Details View Controller
 * @author Adrian Urbanczyk <aurbanczyk1@sheffield.ac.uk>
 */
async function getDeviceTypeDetailsPage(req, res, next) {
    const subpage = req.params.subpage
    const id = req.params.id

    let item = {}
    let brands = [];
    let deviceTypes = []
    let typeModels = []
    try {
        switch (subpage){
            case "brands":
                item = await getBrandById(id);
                break;
            case "models":
                item = await getModelById(id)
                deviceTypes = await getAllDeviceType()
                brands = await getAllBrand()
                break;
            case "device-types":
                item = await getDeviceTypeById(id)
                typeModels = await getAllModelsOfType(item.id)
                break;
            default:
                res.redirect("/admin/types")
        }
    }catch (err){
        res.status(500)
        console.log(err)
        next(err)
    }

    // Make subpage singular form
    const itemType = subpage.slice(0,-1)

    renderAdminLayoutPlaceholder(req,res, "device_type_details", {item, itemType, brands, deviceTypes, typeModels}, null)
}
/**
 * Update Device Type
 * @author Adrian Urbanczyk <aurbanczyk1@sheffield.ac.uk>
 */
const updateDeviceType = async (req,res,next) => {
    const id = req.params.id
    const subpage = req.params.subpage
    if (req.session.messages.length > 0) {
        return res.redirect(`/admin/types/${subpage}/${id}`)
    }

    try {
        switch (subpage){
            case "brands":
                await updateBrandDetails(id, req.body.name)
                break;
            case "models":
                await updateModelDetails(id, req.body.name, req.body.modelBrand, req.body.modelType)
                break;
            case "device-types":
                await updateDeviceTypeDetails(id, req.body.name, req.body.description)
                break;
            default:
                res.redirect("/admin/types")
        }
    }catch(err){
        console.log("here")

        res.status(500)
        console.log(err)
        return next(err)
    }

    res.redirect(`/admin/types/${subpage}/${id}`)
}

const deleteDeviceType = async (req,res,next) => {
    const id = req.params.id
    const subpage = req.params.subpage
    try {
        switch (subpage){
            case "brands":
                await deleteBrand(id)
                break;
            case "models":
                await deleteModel(id)
                break;
            case "device-types":
                await deleteType(id)
                break;
            default:
                res.redirect("/admin/types")
        }
    }catch (err){
        res.status(500)
        console.log(err)
        next(err)
    }

    res.redirect(`/admin/types/${subpage}`)

}

/**
 * Get method to retrieve the details of the device from the staff side, which is then used to update the details of the device
 * @author Vinroy Miltan Dsouza <vmdsouza1@sheffield.ac.uk>
 */
async function getUserDeviceDetailsPage(req, res, next) {
    try {
        const item = await getItemDetail(req.params.id)
        const deviceType = await getAllDeviceType()
        const brands = await getAllBrand()
        var models = []
        var specs = []

        if (item.model != null) {
            models = await getModels(item.brand._id, item.device_type._id)
            const specProp = item.model.properties.find(property => property.name === 'specifications')?.value;
            if (specProp != null) {
                specs = JSON.parse(specProp)
            } else {
                specs = []
            }
        }
        else{
            var type = ""
            var brand = ""
            var model = ""
            const customModel = await getUnknownDeviceHistoryByDevice(item._id)
            customModel[0].data.forEach(data => {
                if (data.name === "device_type"){
                    type = data.value
                }else if(data.name === "brand"){
                    brand = data.value
                }else if(data.name === "model"){
                    model = data.value
                }
            });
            models = []
            item.device_type = {name: deviceType}
            item.brand = {name: brand}
            item.model = {name: model}
        }

        renderAdminLayout(req, res, "edit_details", {item, deviceType, brands, models, specs, dataService, deviceCategory, deviceState}, "User Device Details page")

    } catch (err) {
        console.log(err)
        res.status(500)
        next(err)
    }

}

/**
 * Get method to retrieve the details of the device from the staff side, which is then used to update the details of the device
 * @author Vinroy Miltan Dsouza <vmdsouza1@sheffield.ac.uk>
 */
async function getModelsFromTypeAndBrand(req, res) {
    const {deviceType, deviceBrand} = req.body
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
    getRetrievalDevicesPage,
    getDeviceTypePage,
    getDeviceTypeDetailsPage,
    postNewDeviceType,
    postNewBrand,
    postNewModel,
    getUserDeviceDetailsPage,
    updateUserDeviceDetailsPage,
    getModelsFromTypeAndBrand,
    updateDeviceType,
    deleteDeviceType
}