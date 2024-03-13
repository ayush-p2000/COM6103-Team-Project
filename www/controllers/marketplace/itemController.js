/*
 * This controller should handle any operations related to specific items in the marketplace (e.g. adding, removing, updating, etc.)
 */

const {getMockItem} = require("../../util/mock/mockData");
const {getItemDetail} = require('../../model/mongodb')

function getListItem(req, res, next) {
    res.render('marketplace/list_item', {auth: true, role: 'user'})
}

/**
 * Get item details to display it in the User's item detail page, where it shows the device specifications
 * @author Vinroy Miltan DSouza
 */
async function getItemDetails(req, res, next) {
    const item = await getItemDetail(req.params.id)
    const specs = JSON.parse(item.model.properties.find(property => property.name === 'specifications')?.value)
    res.render('marketplace/item_details', {item, specs, auth: true, role: 'user'})
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