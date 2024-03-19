/*
 * This controller should handle any operations related to the marketplace itself
 */

const mockData = require('../../util/mock/mockData')
const { getPaginatedResults } = require("../../model/utils/utils")
const { Device} = require("../../model/schema/device")
const {getUserItems, getQuotes, getProviders, addQuotes} = require('../../model/mongodb')
const {join} = require("path");
const deviceState =require("../../model/enum/deviceState")
const deviceCategory = require("../../model/enum/deviceCategory")
const cheerio = require("cheerio");

const getMarketplace = async (req, res, next) => {
    const {items, pagination} = await getPaginatedResults(Device, req.params.page, {},{}, 3);

    res.render('marketplace/marketplace', {items, auth: req.isLoggedIn, user:req.user, pagination})
}

/**
 * Get User's items to display it in the my-items page, so that the user can see what items they have listed in the application
 * @author Vinroy Miltan Dsouza
 */
async function getMyItems(req, res, next) {
    const items = await getUserItems(req.user.id)
    const providers = await getProviders()
    let quotations = []
    for (const item of items) {
        let quotes = await getQuotes(item._id)
        if(quotes.length === 0) {
            console.log('No quotes available')
            quotes = await getDeviceQuotation(item, providers)
        }
        quotations.push(quotes)
    }
    console.log(quotations)
    res.render('marketplace/my_items', {items, quotations, deviceState, deviceCategory, auth: req.isLoggedIn, user:req.user, role:'user'})
}

const getDeviceQuotation = async (item, providers) => {
    const url = 'https://www.ebay.co.uk/sch/i.html?_from=R40&_trksid=p4432023.m570.l1313&_nkw='
    const searchItem = item.model.name.replace(' '+ '+')
    let quote_data = []
    try {
        fetch(url+searchItem)
            .then(response => {
                if(!response.ok) {
                    throw new Error("No response from ebay")
                }
                return response.text()
            })
            .then( async html => {
                const $ = cheerio.load(html)
                const data = $('.s-item__wrapper')
                data.each(() => {
                    const price = $('.s-item__price').text()
                    quote_data.push(price)
                })
                let quote = quote_data[0].split(' ')[0].replace('$20.00', '').split('£')[1]
                var providerId
                providers.forEach(provider => {
                    if (provider.name === 'ebay') {
                        providerId = provider._id
                    }
                })

                const today = new Date()
                const expiryDate = new Date(today)
                expiryDate.setDate(today.getDate() + 3)
                const quoteDetails = {
                    device: item._id,
                    provider: providerId,
                    value: parseFloat(quote),
                    state: false,
                    expiry: expiryDate
                }
                const savedQuote = await addQuotes(quoteDetails)
                return savedQuote
            })

    } catch (err){
        console.log(err)
    }
}


module.exports = {
    getMarketplace,
    getMyItems
}