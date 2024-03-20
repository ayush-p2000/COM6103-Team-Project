const cheerio = require("cheerio");
const {addQuote} = require("../../model/mongodb");

/**
 * Get method to fetch the quotation details from third-party providers like ebay etc.
 * Here we are using web scraper to fetch the price details from providers and saving it in the database
 * @author Vinroy Miltan Dsouza <vmdsouza1@sheffield.ac.uk>
 */
async function getDeviceQuotation(item, providers) {
    let url
    let searchItem
    let quote_data
    const quotation = []
    try {
        providers.forEach(provider => {
            if (provider.name === 'ebay') {
                url = 'https://www.ebay.co.uk/sch/i.html?_nkw=';
                searchItem = item.model.name.replace(' ', '+');

                fetch(url + searchItem)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error("No response from eBay");
                        }
                        return response.text();
                    })
                    .then(async html => {
                        const cheerio = require('cheerio'); // Import cheerio library
                        const $ = cheerio.load(html);
                        quote_data = []; // Initialize quote_data array
                        const data = $('.s-item__wrapper');
                        data.each(() => { // Use parameters index and element in each loop
                            const price = $('.s-item__price').text(); // Find price within each element
                            quote_data.push(price);
                        });
                        let quote = quote_data[0].split(' ')[0].replace('$20.00', '').split('£')[1];
                        console.log('ebay',quote)
                        const quoteDetails = setQuoteDetails(provider, item, quote, url+searchItem)
                        // console.log(quoteDetails)
                        await addQuote(quoteDetails);
                        quotation.push(quoteDetails)
                        // return await addQuote(quoteDetails);
                    })
                    .catch(error => {
                        console.error("Error:", error);
                    });
            } else {
                url = 'https://uk.webuy.com/sell/search/?stext='
                searchItem = item.model.name.replace(' ', '+')
                fetch(url+searchItem)
                    .then(response => {
                        if(!response.ok) {
                            throw new Error("No response from cex")
                        }
                        return response.text()
                    })
                    .then( async html => {
                        const $ = cheerio.load(html)
                        // console.log($)
                        const data = $('.wrapper-box')
                        data.each(() => {
                            console.log('item')
                            console.log('cex price',$('.cash-price').text())
                        })
                        // console.log(price)
                        // let quote = quote_data[0]
                        // const quoteDetails = setQuoteDetails(provider, item)
                        // console.log(quoteDetails)
                        // return await addQuote(quoteDetails)
                    })
                    .catch(err => {
                        console.log(err)
                    })
            }
        })
        return quotation
    } catch (err){
        console.log(err)
    }
}


/**
 * Method to set the quote details of a device
 * @author Vinroy Miltan Dsouza <vmdsouza1@sheffield.ac.uk>
 */
function setQuoteDetails(provider, item, quote, url) {
    const providerId = provider._id
    const today = new Date()
    const expiryDate = new Date(today)
    expiryDate.setDate(today.getDate() + 3)
    return {
        device: item._id,
        provider: providerId,
        value: parseFloat(quote),
        url: url,
        state: false,
        expiry: expiryDate
    }
}
module.exports = {getDeviceQuotation}





// if (provider.name === 'cex') {
//     url = 'https://uk.webuy.com/sell/search/?stext='
//     searchItem = item.model.name.replace(' '+ '+')
//     fetch(url+searchItem)
//         .then(response => {
//             if(!response.ok) {
//                 throw new Error("No response from cex")
//             }
//             return response.text()
//         })
//         .then( async html => {
//             const $ = cheerio.load(html)
//             const data = $('.search-product-card')
//             // console.log(data)
//             data.forEach(data => {
//                 console.log('item')
//                 console.log($(data).find('.cash-price').text())
//             })
//             // console.log(price)
//             // let quote = quote_data[0]
//             // const quoteDetails = setQuoteDetails(provider, item)
//             // console.log(quoteDetails)
//             // return await addQuote(quoteDetails)
//         })
//         .catch(err => {
//             console.log(err)
//         })
// }