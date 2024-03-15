/*
 * This controller should handle any operations related to specific items in the marketplace (e.g. adding, removing, updating, etc.)
 */

var {getItemDetail, getAllDeviceType, getAllBrand, getModels, listDevice} = require('../../model/mongodb');
const {getMockItem} = require("../../util/mock/mockData");
const deviceState = require("../../model/enum/deviceState")
const deviceCategory = require("../../model/enum/deviceCategory")

/**
 * Handling Request to post item base on the info in request body
 * @author Zhicong Jiang
 */
const postListItem = async (req, res) => {
    try {
        console.log(req.body)
        const files = req.files;
        const filePaths = [];
        for (let i = 0; i < files.length; i++) {
            const filePath = files[i].path;
            filePaths.push(filePath);
        }
        const deviceId = await listDevice(req.body,filePaths,req.user);
        res.status(200).send(deviceId);
    } catch (err) {
        console.log(err);
        res.status(500).send('Internal server error');
    }
};

/**
 * Respond form view for user to post item
 * @author Zhicong Jiang
 */
async function getListItem(req, res) {
    try {
        let deviceTypes = await getAllDeviceType();
        let brands = await getAllBrand();
        res.render('marketplace/list_item', {
            auth: req.isLoggedIn,user:req.user, role: 'user',
            deviceTypes: deviceTypes, brands: brands
        });
    } catch (err) {
        console.log(err)
    }
}

/**
 * get specific Model By querying Brand And DeviceType
 * @author Zhicong Jiang
 */
async function getModelByBrandAndType(req, res) {
    try {
        let models = await getModels(req.query.brand,req.query.deviceType);
        res.send(models);
    } catch (err) {
        res.send(err)
    }
}


/**
 * Get item details to display it in the User's item detail page, where it shows the device specifications
 * @author Vinroy Miltan DSouza
 */
async function getItemDetails(req, res, next) {
    const item = await getItemDetail(req.params.id)
    const specs = JSON.parse(item.model.properties.find(property => property.name === 'specifications')?.value)
    // item.photos.forEach((photo, index) => {
    //     item.photos[index] = photo.slice(7)
    // })
    res.render('marketplace/item_details', {item, specs, deviceCategory, deviceState, auth: req.isLoggedIn, user:req.user, role: 'user'})
}

function getItemQrCode(req, res, next) {
    //TODO: Add functionality for generating QR code for item
    res.send('[Item QR Code Here]')
}

module.exports = {
    postListItem,
    getListItem,
    getModelByBrandAndType,
    getItemDetails,
    getItemQrCode
}