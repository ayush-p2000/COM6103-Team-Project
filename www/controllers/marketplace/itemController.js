/*
 * This controller should handle any operations related to specific items in the marketplace (e.g. adding, removing, updating, etc.)
 */

var {getItemDetail, getAllDeviceType, getAllBrand, getModels, listDevice, getDevice, updateDevice, getHistoryByDevice, getQuote, updateQuoteState, updateDeviceState} = require('../../model/mongodb');
const {getMockItem} = require("../../util/mock/mockData");
const deviceState = require("../../model/enum/deviceState")
const deviceCategory = require("../../model/enum/deviceCategory")
const quoteState = require("../../model/enum/quoteState")
const cheerio = require('cheerio')
const axios = require('axios')


/**
 * Handling Request to post item base on the info in request body
 * @author Zhicong Jiang
 */
const postListItem = async (req, res) => {
    var id = req.params.id;
    try {
        console.log(req.body)
        const files = req.files;
        const filePaths = [];
        for (let i = 0; i < files.length; i++) {
            const filePath = files[i].path;
            filePaths.push(filePath);
        }

        if (typeof id === 'undefined'){
            console.log("Adding")
            const deviceId = await listDevice(req.body, filePaths, req.user);
            res.status(200).send(deviceId);
        }else{
            console.log("Updating")
            const deviceId = await updateDevice(id, req.body, filePaths);
            res.status(200).send(deviceId);
        }
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
    var id = req.params.id;
    if (typeof id === 'undefined') {
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
    }else{
        try{
            let device = await getDevice(id);
            res.render('marketplace/edit_item', {
                auth: req.isLoggedIn,user:req.user, role: 'user', device: device[0]
            });
            // res.send(device)
        }catch (err){
            console.log(err)
        }
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
 * Here also the device price quotes are retrieved from the database to display in the item page
 * @author Vinroy Miltan DSouza & Zhicong Jiang
 */
async function getItemDetails(req, res, next) {
    try{
        const item = await getItemDetail(req.params.id)
        var specs = []
        var quotes
        if (item.model != null) {
            specs = JSON.parse(item.model.properties.find(property => property.name === 'specifications')?.value)
            quotes = await getQuote(req.params.id)
        }else{
            var deviceType = ""
            var brand = ""
            var model = ""
            const customModel = await getHistoryByDevice(item._id)
            customModel[0].data.forEach(data => {
                if (data.name === "device_type"){
                    deviceType = data.value
                }else if(data.name === "brand"){
                    brand = data.value
                }else if(data.name === "model"){
                    model = data.value
                }
            });
            item.device_type = {name: deviceType}
            item.brand = {name: brand}
            item.model = {name: model}
        }
        res.render('marketplace/item_details', {item, specs, quotes, deviceCategory, deviceState, auth: req.isLoggedIn, user:req.user, role: 'user'})
    }catch (e){
        console.log(e)
    }
}

async function updateQuote(req, res){
    try {
        const state = req.body.state
        console.log(state)
        console.log(quoteState[state])
        const value = quoteState[state]
        const device_state = deviceState['HAS_QUOTE']
        const updated_quote = await updateQuoteState(req.params.id, value)
        if (updated_quote) {
            await updateDeviceState(req.params.id, device_state)
        }
    } catch (err ) {
        console.log(err)
    }
}

// function updateDeviceState(req, res) {
//
// }

function getItemQrCode(req, res, next) {
    //TODO: Add functionality for generating QR code for item
    res.send('[Item QR Code Here]')
}

module.exports = {
    postListItem,
    getListItem,
    getModelByBrandAndType,
    getItemDetails,
    getItemQrCode,
    updateQuote
}