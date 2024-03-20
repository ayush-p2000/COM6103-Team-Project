/*
 * This controller should handle any operations related to the marketplace itself
 */

const mockData = require('../../util/mock/mockData')
const { getPaginatedResults } = require("../../model/utils/utils")
const { Device} = require("../../model/schema/device")
const {getUserItems, getQuote, getProviders, addQuote} = require('../../model/mongodb')
const {join} = require("path");
const deviceState =require("../../model/enum/deviceState")
const deviceCategory = require("../../model/enum/deviceCategory")
const {getDeviceQuotation} = require("../../util/web-scrape/getDeviceQuotation")
const cheerio = require("cheerio");

const getMarketplace = async (req, res, next) => {
    const {items, pagination} = await getPaginatedResults(Device, req.params.page, {},{}, 3);

    res.render('marketplace/marketplace', {items, auth: req.isLoggedIn, user:req.user, pagination})
}

/**
 * Get User's items to display it in the my-items page, so that the user can see what items they have listed in the application
 * Here the function also checks if there is quotation details in the database for the item, if not then it'll fetch the details from getDeviceQuotation method
 * @author Vinroy Miltan Dsouza <vmdsouza1@sheffield.ac.uk>
 */
async function getMyItems(req, res, next) {
    const devices = await getUserItems(req.user.id)
    const providers = await getProviders()
    let quotations = []
    let items = []
    for (let device of devices) {
        let quotes = await getQuote(device._id)
        if(quotes.length === 0) {
            if (Object.keys(deviceCategory).find(key => deviceCategory[key] === device.category) !== 'UNKNOWN') {
                console.log('No quotations available')
                quotes = await getDeviceQuotation(device, providers)
            }
        }
        if(Object.keys(deviceCategory).find(key => deviceCategory[key] === device.category) !== 'UNKNOWN') {
            items.push(device)
        }
        quotations.push(quotes)
    }
    // console.log(quotations)
    res.render('marketplace/my_items', {items, quotations, deviceState,  deviceCategory, auth: req.isLoggedIn, user:req.user, role:'user'})
}


// async function getDeviceQuotation(item, provider) {
//     let url
//     let searchItem
//     let quote_data = []
//     try {
//         const url = 'https://www.ebay.co.uk/sch/i.html?_nkw=';
//         const searchItem = item.model.name.replace(' ', '+');
//
//         fetch(url + searchItem)
//             .then(response => {
//                 if (!response.ok) {
//                     throw new Error("No response from eBay");
//                 }
//                 return response.text();
//             })
//             .then(async html => {
//                 const cheerio = require('cheerio'); // Import cheerio library
//                 const $ = cheerio.load(html);
//                 const quote_data = []; // Initialize quote_data array
//                 const data = $('.s-item__wrapper');
//                 data.each(() => { // Use parameters index and element in each loop
//                     const price = $('.s-item__price').text(); // Find price within each element
//                     quote_data.push(price);
//                 });
//                 let quote = quote_data[0].split(' ')[0].replace('$20.00', '').split('£')[1];
//                 console.log(quote)
//                 const providerId = provider[1]._id;
//                 const today = new Date();
//                 const expiryDate = new Date(today);
//                 expiryDate.setDate(today.getDate() + 3);
//                 const quoteDetails = {
//                     device: item._id,
//                     provider: providerId,
//                     value: parseFloat(quote),
//                     state: false,
//                     expiry: expiryDate
//                 };
//                 // return await addQuote(quoteDetails);
//             })
//             .then(result => {
//                 console.log("Quote added successfully:", result);
//             })
//             .catch(error => {
//                 console.error("Error:", error);
//             });
//
//     } catch (err){
//         console.log(err)
//     }
// }




module.exports = {
    getMarketplace,
    getMyItems
}