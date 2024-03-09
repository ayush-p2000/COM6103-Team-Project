/*
 * This controller should handle any operations related to specific items in the marketplace (e.g. adding, removing, updating, etc.)
 */

const {getMockItem} = require("../../util/mock/mockData");

function getListItem(req, res, next) {
    try {
        let deviceTypes = getDeviceTypes(req, res).data
        res.render('marketplace/list_item', {auth: true, role: 'user', deviceType: deviceTypes})
    } catch (error) {
        next(error); // 将错误传递给 Express 错误处理中间件
    }
}

function getDeviceTypes(req, res, next) {
    // TODO: Query db to get deviceTypes
    return { status: 200, data: [{id:1,name:"Phone"},{id:2,name:"Tablet"},{id:3,name:"Watch"}]};
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
    getItemDetails,
    getItemQrCode
}