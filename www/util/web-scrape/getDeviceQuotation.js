const cheerio = require("cheerio");
const {addQuote} = require("../../model/mongodb");
const puppeteer = require('puppeteer')

/**
 * Get method to fetch the quotation details from third-party providers like ebay etc.
 * Here we are using web scraper to fetch the price details from providers and saving it in the database
 * @author Vinroy Miltan Dsouza <vmdsouza1@sheffield.ac.uk>
 */
async function getDeviceQuotation(item, providers) {

    let quotation = []
    try {
        providers.forEach(provider => {
            switch (provider.name) {
                case 'ebay': quotation = getEbayQuote(item, provider, quotation )
                    break
                case 'cex': quotation = getCexQuote(item, provider, quotation)
                    break
            }
        })
        return quotation
    } catch (err) {
        console.log(err)
    }
}


/**
 * Get method to fetch the quotation details from ebay
 * uses cheerios and axios to fetch the price details from the ebay website
 * @author Vinroy Miltan Dsouza <vmdsouza1@sheffield.ac.uk>
 */
function getEbayQuote(item, provider, quotation) {
    let url = 'https://www.ebay.co.uk/sch/i.html?_nkw=';
    let searchItem = item.model.name.replace(' ', '+');
    const link = url+searchItem
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
            let quote_data = []; // Initialize quote_data array
            const data = $('.s-item__wrapper');
            data.each((i, element) => { // Use parameters index and element in each loop
                //Get the title from the current element
                const title = $(element).find('.s-item__title').text(); // Find title within each element

                //Check that the title is for the correct item and not an accessory
                if (title.toLowerCase().includes(item.model.name.toLowerCase()) && !title.toLowerCase().includes('for')) {
                    let price = $(element).find('.s-item__price').text(); // Find price within each element

                    //If the price contains ' to ' then it is a range, so we take the first value
                    if (price.includes('to')) {
                        price = price.split('to')[0];
                    }

                    quote_data.push(price);
                }
            });

            //Order the quotes from lowest to highest
            quote_data.sort((a, b) => {
                return parseFloat(a) - parseFloat(b);
            });

            if (quote_data.length > 0) {

                let quote = quote_data[0].split(' ')[0].replace('$20.00', '').split('£')[1];
                console.log('ebay', quote)
                const quoteDetails = setQuoteDetails(provider, item, quote, link)
                console.log(quoteDetails)
                await addQuote(quoteDetails);
                quotation.push(quoteDetails)

            }

        })
        .catch(error => {
            console.error("Error:", error);
        });
    return quotation
}

/**
 * Get method to fetch the quotation details from cex
 * uses puppeteer which is a web scraper for dynamic webpages and the price details are scraped through this module
 * @author Vinroy Miltan Dsouza <vmdsouza1@sheffield.ac.uk>
 */
function getCexQuote(item, provider, quotation){
    // Puppeteer module is used to web scrape the cex site which loads data dynamically
    (async () => {
        const browser = await puppeteer.launch()
        const page = await browser.newPage()
        const url = 'https://uk.webuy.com/sell/search/?stext='
        let searchItem = item.model.name.replaceAll(' ', '+')
        let priceData = []
        await page.goto(url + searchItem)

        //Wait till the main body of the webpage is loaded
        await page.waitForSelector('#main')
        const deviceDetails = await page.$$('.wrapper-box');

        //Iterate through all the device details and get the price based on the title
        for (const device of deviceDetails) {

            //Get the title of the product
            let title = await device.evaluate(el => el.querySelector('.card-title').textContent)
            title = title.toLowerCase().replace('(', '').replace(')', '')
            if (title.includes(item.model.name.toLowerCase()) && !title.toLowerCase().includes('for')) {
                const price = await device.evaluate(el => el.querySelector('.cash-price.price-tag.mb-xxs').textContent)
                priceData.push(price.replace('Cash £', ''))
            }
        }

        console.log(priceData[0])
        const quoteDetails = setQuoteDetails(provider, item, priceData[0] ?? 0, url + searchItem)
        console.log(quoteDetails)
        await addQuote(quoteDetails)
        quotation.push(quoteDetails)

    })();
    return quotation
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

