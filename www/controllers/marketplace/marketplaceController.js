/*
 * This controller should handle any operations related to the marketplace itself
 */

const mockData = require('../../util/mock/mockData')
const {renderUserLayout} = require("../../util/layout/layoutUtils");
const {getPaginatedResults} = require("../../model/utils/utils")
const {Device} = require("../../model/schema/device")
const {
    getUserItems,
    getQuotes,
    getProviders,
    addQuote,
    deleteQuote,
    getAllDevices, getAllDeviceType,
    getUnknownDeviceHistoryByDevice
} = require('../../model/mongodb')
const {join} = require("path");
const deviceState = require("../../model/enum/deviceState")
const deviceCategory = require("../../model/enum/deviceCategory")
const {getDeviceQuotation} = require("../../util/web-scrape/getDeviceQuotation")
const cheerio = require("cheerio");
const {quoteState} = require("../../model/enum/quoteState");

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
    renderUserLayout(req, res, '../marketplace/marketplace', {
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
        let providers = await getProviders()
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

            const state = Object.keys(deviceState).find(key => deviceState[key] === item.state)
            // Get quotes only if the device is listed or the device already has quotes
            if (deviceState[state] === deviceState.LISTED || deviceState[state] === deviceState.HAS_QUOTE) {
                let quotes = await getQuotes(item._id)
                // Check if there are no quotes available for that device
                if (quotes.length === 0) {
                    console.log('No quotes available')
                    quotes = await getDeviceQuotation(item, providers)
                } else if(quotes.length === 1) {
                    // Check for if only one quote is available for the device, if only one quote then scrape the website for other quote
                    let one_provider = []
                    let new_quote
                    providers.forEach(provider => {
                        if (provider.name !== quotes[0].provider.name) {
                            one_provider.push(provider)
                        }
                    })
                    new_quote = await getDeviceQuotation(item, one_provider)
                    quotes.push(new_quote)
                }

                //Check if the quote expiry date has passed, if yes then delete the quote and get a new quote from the web page
                let updatedQuotes = []
                for (const quote of quotes) {
                    const currentDate = new Date()
                    const state = Object.keys(quoteState).find(key => quoteState[key] === quote.state)

                    if (quoteState[state] === quoteState.NEW || quoteState[state] === quoteState.ACCEPTED || quoteState[state] === quoteState.EXPIRED) {
                        if(quote.expiry < currentDate) {
                            let one_provider = []
                            let new_quote
                            one_provider.push(quote.provider)
                            console.log('quote expired')
                            const deleted_quote = await deleteQuote(quote._id)
                            new_quote =  await getDeviceQuotation(item, one_provider)
                            updatedQuotes.push(new_quote)
                        } else {
                            updatedQuotes.push(quote)
                        }
                    }
                }
                quotations.push(updatedQuotes)
            }

        }
        // console.log(quotations)
        renderUserLayout(req, res, '../marketplace/my_items', {
            deviceTypes,
            items,
            quotations,
            deviceState,
            deviceCategory,
            auth: req.isLoggedIn,
            user: req.user,
            role: 'user'}
        )
        // res.render('marketplace/my_items', {
        //     deviceTypes,
        //     items,
        //     quotations,
        //     deviceState,
        //     deviceCategory,
        //     auth: req.isLoggedIn,
        //     user: req.user,
        //     role: 'user'
        // })
    } catch (e) {
        console.log(e)
    }
}



module.exports = {
    getMarketplace,
    getMyItems
}