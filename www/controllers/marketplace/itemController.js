/*
 * This controller should handle any operations related to specific items in the marketplace (e.g. adding, removing, updating, etc.)
 */

function getListItem(req, res, next) {
    res.render('marketplace/list_item', {})
}

function getItemDetails(req, res, next) {
    const item = getMockItem()

    res.render('marketplace/item_details', {item})
}

function getItemQrCode(req, res, next) {
    //TODO: Add functionality for generating QR code for item
    res.send('[Item QR Code Here]')
}

function getMockItem() {
    return {
        name: 'Iphone 12',
        classification: 'Current',
        purchaseYear: 2022,
        capacity: 128,
        colour: 'Red',
        os: 'IOS',
        deviceType: 'Mobile',
        condition: 'Good'
    };
}

module.exports = {
    getListItem,
    getItemDetails,
    getItemQrCode
}