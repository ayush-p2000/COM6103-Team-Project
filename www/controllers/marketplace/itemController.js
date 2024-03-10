/*
 * This controller should handle any operations related to specific items in the marketplace (e.g. adding, removing, updating, etc.)
 */

const {getMockItem} = require("../../util/mock/mockData");
const {getItemDetail} = require('../../model/mongodb')

function getListItem(req, res, next) {
    res.render('marketplace/list_item', {auth: true, role: 'user'})
}

async function getItemDetails(req, res, next) {
    const item = await getItemDetail(req.params.id)
    res.render('marketplace/item_details', {item, auth: true, role: 'user'})
}

function getItemQrCode(req, res, next) {
    //TODO: Add functionality for generating QR code for item
    res.send('[Item QR Code Here]')
}

module.exports = {
    getListItem,
    getItemDetails,
    getItemQrCode
}