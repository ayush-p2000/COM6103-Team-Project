/*
 * This controller should handle any operations related to specific items in the marketplace (e.g. adding, removing, updating, etc.)
 */

var {getAllDeviceType, getAllBrand, getModels, listDevice} = require('../../model/mongodb');
const {getMockItem} = require("../../util/mock/mockData");


const postListItem = async (req, res) => {
    try {
        // req.body.append("photos",req.files)
        const files = req.files; // 获取上传的文件数组
        const filePaths = [];
        for (let i = 0; i < files.length; i++) {
            const filePath = files[i].path;
            filePaths.push(filePath);
        }

        const deviceId = await listDevice(req.body,filePaths);
        res.status(200).send(deviceId);
    } catch (err) {
        console.log(err);
        res.status(500).send('Internal server error');
    }
};

async function getListItem(req, res) {
    try {
        let deviceTypes = await getAllDeviceType();
        let brands = await getAllBrand();
        res.render('marketplace/list_item', {auth: true, role: 'user',
            deviceTypes: deviceTypes, brands: brands});
    } catch (err) {
        console.log(err)
    }
}

/**
 * get specific Model By querying Brand And DeviceType
 * @param req
 * @param res
 * @returns list of Model
 * @example http://localhost:3000/getModelByBrandAndType?brand=65eac79df2954ef5775b17f8&deviceType=65eac7dcd328192d95701b5a
 */
async function getModelByBrandAndType(req, res) {
    try {
        let models = await getModels(req.query.brand,req.query.deviceType);
        res.send(models);
    } catch (err) {
        res.send(err)
    }
}


function getItemDetails(req, res, next) {
    const item = getMockItem()
    res.render('marketplace/item_details', {item, auth: true, role: 'user'})
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