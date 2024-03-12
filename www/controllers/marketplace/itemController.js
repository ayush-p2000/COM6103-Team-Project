/*
 * This controller should handle any operations related to specific items in the marketplace (e.g. adding, removing, updating, etc.)
 */

const {getMockItem} = require("../../util/mock/mockData");

function getListItem(req, res, next) {
    res.render('marketplace/list_item', { auth: req.isLoggedIn, user:req.user})
}

function getItemDetails(req, res, next) {
    const item = getMockItem()

    res.render('marketplace/item_details', {item, auth: req.isLoggedIn, user:req.user})
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