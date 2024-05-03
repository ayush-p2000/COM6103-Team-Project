/*
 * This controller should handle any operations related to the marketplace itself
 */

const {renderUserLayout} = require("../../util/layout/layoutUtils");
const {getPaginatedResults} = require("../../model/utils/utils")
const {Device} = require("../../model/models")
const {
    getUserItems,
    getQuotes,
    getProviders,
    addQuote,
    deleteQuote,
    getAllDevices,
    getAllDeviceType,
    getUnknownDeviceHistoryByDevice, updateDeviceState
} = require('../../model/mongodb')
const deviceState = require("../../model/enum/deviceState")
const deviceCategory = require("../../model/enum/deviceCategory")
const {getDeviceQuotation} = require("../../util/web-scrape/getDeviceQuotation")
const {quoteState} = require("../../model/enum/quoteState");
const {handleMissingModels} = require("../../util/Devices/devices");

/**
 * Get All Users Devices
 * @author Zhicong Jiang<zjiang34@sheffield.ac.uk>
 */
const getMarketplace = async (req, res, next) => {
    const deviceTypes = await getAllDeviceType()
    try {
        let {
            items,
            pagination
        } = await getPaginatedResults(Device, req.params.page, {visible:true}, {}, 10);

        if (items.length > 0) {
            await handleMissingModels(items)
        }
        renderUserLayout(req, res, '../marketplace/marketplace', {
            deviceTypes,
            devices: items,
            deviceCategory,
            auth: req.isLoggedIn,
            user: req.user,
            pagination
        })
    } catch (e) {
        console.log(e)
        res.status(500);
        next(e);
    }
}


/**
 * Get User's items to display it in the my-items page, so that the user can see what items they have listed in the application
 * Here the function also checks if there is quotation details in the database for the item, if not then it'll fetch the details from getDeviceQuotation method
 * @author Vinroy Miltan Dsouza <vmdsouza1@sheffield.ac.uk> & Zhicong Jiang <zjiang34@sheffield.ac.uk>
 */
async function updateQuotes(items, providers) {
    let quotations = [];
    for (const item of items) {
        if (item.state === deviceState.LISTED || item.state === deviceState.HAS_QUOTE) {
            let quotes = await getQuotes(item._id);
            if (quotes.length === 0) {
                quotes = await getDeviceQuotation(item, providers);
            } else if (quotes.length < providers.length) {
                let one_provider = providers.filter(provider => !quotes.find(quote => quote.provider.name === provider.name));
                let new_quote = await getDeviceQuotation(item, one_provider);
                quotes.push(new_quote);
            }
            if (quotes) {
                await updateDeviceState(item._id, deviceState.HAS_QUOTE)
            }

            let updatedQuotes = [];
            for (const quote of quotes) {
                const currentDate = new Date();
                if (item.state === quoteState.NEW || item.state === quoteState.ACCEPTED || item.state === quoteState.EXPIRED) {
                    if (quote.expiry < currentDate) {
                        let one_provider = [quote.provider];
                        const deleted_quote = await deleteQuote(quote._id);
                        let new_quote = await getDeviceQuotation(item, one_provider);
                        updatedQuotes.push(new_quote);
                    } else {
                        updatedQuotes.push(quote);
                    }
                }
            }
            quotations.push(updatedQuotes);
        } else {
            quotations.push([]);
        }
    }
    return quotations;
}

async function getMyItems(req, res, next) {
    try {
        const deviceTypes = await getAllDeviceType();
        const items = await getUserItems(req.user.id);
        const providers = await getProviders();

        await handleMissingModels(items);
        const quotations = await updateQuotes(items, providers);

        renderUserLayout(req, res, '../marketplace/my_items', {
            deviceTypes,
            items,
            quotations,
            deviceState,
            deviceCategory,
            auth: req.isLoggedIn,
            user: req.user,
            role: 'user'
        });
    } catch (e) {
        console.log(e);
    }
}


module.exports = {
    getMarketplace,
    getMyItems
}