/*
 * This controller should handle any operations related to specific items in the marketplace (e.g. adding, removing, updating, etc.)
 */
const mongoose = require('mongoose');
var {Brand} = require('../../model/schema/brand');
var {DeviceType} = require('../../model/schema/deviceType');
var {Model} = require('../../model/schema/model');

const {getMockItem} = require("../../util/mock/mockData");

async function getListItem(req, res, next) {
    try {
        let deviceTypes = await DeviceType.find();
        let brands = await Brand.find();
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
        const brandId = new mongoose.Types.ObjectId(req.query.brand);
        const deviceTypeId = new mongoose.Types.ObjectId(req.query.deviceType);
        let model = await Model.find({ brand: brandId, deviceType: deviceTypeId });
        res.send(model);
    } catch (err) {
        res.send(err)
    }
}

async function getModelDetailById(req, res) {
    try {
        const modelId = new mongoose.Types.ObjectId(req.query.id);
        let model = await Model.find({ _id: modelId});
        res.send(model);
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
    getListItem,
    getModelByBrandAndType,
    getItemDetails,
    getItemQrCode
}