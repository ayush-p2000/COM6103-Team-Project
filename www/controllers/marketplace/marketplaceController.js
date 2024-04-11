/*
 * This controller should handle any operations related to the marketplace itself
 */

const mockData = require('../../util/mock/mockData')
const {getPaginatedResults} = require("../../model/utils/utils")
const {Device} = require("../../model/schema/device")
const {
    getUserItems,
    getQuotes,
    getProviders,
    addQuote,
    getAllDevices, getAllDeviceType,
    getUnknownDeviceHistoryByDevice
} = require('../../model/mongodb')
const {join} = require("path");
const deviceState = require("../../model/enum/deviceState")
const deviceCategory = require("../../model/enum/deviceCategory")
const {getDeviceQuotation} = require("../../util/web-scrape/getDeviceQuotation")
const cheerio = require("cheerio");

/**
 * Get All Users Devices
 * @author Zhicong Jiang<zjiang34@sheffield.ac.uk>
 */
const getMarketplace = async (req, res, next) => {
    const deviceTypes = await getAllDeviceType()
    const {items, pagination} = await getPaginatedResults(Device, req.params.page, {}, {}, 10);
    try {
        var devices = await getAllDevices()
        for (const item of devices) {
            if (item.model == null) {
                var deviceType = ""
                var brand = ""
                var model = ""
                const customModel = await getUnknownDeviceHistoryByDevice(item._id)
                customModel[0].data.forEach(data => {
                    if (data.name === "device_type") {
                        deviceType = data.value
                    } else if (data.name === "brand") {
                        brand = data.value
                    } else if (data.name === "model") {
                        model = data.value
                    }
                });
                item.device_type = {name: deviceType}
                item.brand = {name: brand}
                item.model = {name: model}
            }
        }
    } catch (e) {
        console.log(e)
    }
    res.render('marketplace/marketplace', {
        deviceTypes,
        devices,
        items,
        deviceCategory,
        auth: req.isLoggedIn,
        user: req.user,
        pagination
    })
}

/**
 * Get User's items to display it in the my-items page, so that the user can see what items they have listed in the application
 * Here the function also checks if there is quotation details in the database for the item, if not then it'll fetch the details from getDeviceQuotation method
 * @author Vinroy Miltan Dsouza <vmdsouza1@sheffield.ac.uk> & Zhicong Jiang <zjiang34@sheffield.ac.uk>
 */
async function getMyItems(req, res, next) {
    try {
        const deviceTypes = await getAllDeviceType()
        const items = await getUserItems(req.user.id)
        const providers = await getProviders()
        let quotations = []
        for (const item of items) {
            if (item.model == null) {
                var deviceType = ""
                var brand = ""
                var model = ""
                const customModel = await getUnknownDeviceHistoryByDevice(item._id)
                customModel[0].data.forEach(data => {
                    if (data.name === "device_type") {
                        deviceType = data.value
                    } else if (data.name === "brand") {
                        brand = data.value
                    } else if (data.name === "model") {
                        model = data.value
                    }
                });
                item.device_type = {name: deviceType}
                item.brand = {name: brand}
                item.model = {name: model}
            }

            let quotes = await getQuotes(item._id)
            if (quotes.length === 0) {
                console.log('No quotes available')
                quotes = await getDeviceQuotation(item, providers)
            }
            quotations.push(quotes)
        }
        // console.log(quotations)
        res.render('marketplace/my_items', {
            deviceTypes,
            items,
            quotations,
            deviceState,
            deviceCategory,
            auth: req.isLoggedIn,
            user: req.user,
            role: 'user'
        })
    } catch (e) {
        console.log(e)
    }
}


module.exports = {
    getMarketplace,
    getMyItems
}