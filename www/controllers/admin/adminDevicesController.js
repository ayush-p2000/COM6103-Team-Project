/*
 * This controller should handle any operations related to device management or device type management
 */

function getDevicesPage(req, res, next) {
    //TODO: Add functionality for the devices page
    res.send('[Devices Page Here]')
}

function getFlaggedDevicesPage(req, res, next) {
    //TODO: Add functionality for the flagged devices page
    res.send('[Flagged Devices Page Here]')

}

function getDeviceTypePage(req, res, next) {
    //TODO: Add functionality for the device type page
    res.send('[Device Type Page Here]')
}

function getDeviceTypeDetailsPage(req, res, next) {
    //TODO: Add functionality for the device type details page
    res.send('[Device Type Details Page Here]')
}

module.exports = {
    getDevicesPage,
    getFlaggedDevicesPage,
    getDeviceTypePage,
    getDeviceTypeDetailsPage
}