/*
 * This controller should handle any operations related to specific items in the marketplace (e.g. adding, removing, updating, etc.)
 */

const multer = require('multer');

const {getMockItem, getMockQuote} = require("../../util/mock/mockData");
const fixedToCurrency = require("../../util/currency/fixedToCurrency");
const {ACCEPTED, REJECTED, CONVERTED, EXPIRED, stateToString, stateToColour} = require("../../model/enum/quoteState");
const {updateQuote} = require("../../model/mongodb");

function getListItem(req, res, next) {
    res.render('marketplace/list_item', {auth: req.isLoggedIn, user: req.user})
}

function getItemDetails(req, res, next) {
    const item = getMockItem()

    res.render('marketplace/item_details', {item, auth: req.isLoggedIn, user: req.user})
}

/*
 * ###################################################################
 * ## This function is called by the QR router, not the marketplace ##
 * ###################################################################
 */
function getItemQrCode(req, res, next) {
    //Get the quote id from the request
    const {id} = req.params;

    //Get the quote from the database
    //TODO: update to get the item from the database once quotes are implemented
    const quote = getMockQuote();

    if (quote === undefined) {
        res.status(404).send("Quote not found")
        return;
    }

    const quoteActive = quote.state !== CONVERTED && quote.state !== REJECTED && quote.state !== EXPIRED;

    //Return the QR code page
    res.render('marketplace/qr_view', {
        quote,
        auth: req.isLoggedIn,
        user: req.user,
        toCurrencyFunc: fixedToCurrency,
        stateStringFunc: stateToString,
        stateColourFunc: stateToColour,
        quoteActive
    })
}

async function confirmQuote(req, res, next) {
    //Get the quote id from the request
    const {id} = req.params;

    const quote = getMockQuote();

    if (quote.state === CONVERTED || quote.state === REJECTED || quote.state === EXPIRED) {
        res.status(400).send("Quote is not active");
        return;
    }

    //Get the confirmation details from the request
    const {final_price, receipt_id, receipt_date} = req.body;

    //Get the receipt image from the request
    const receipt_image = req.file.buffer.toString('base64');

    try {
        //Update the quote in the database
        const success = await updateQuote(id, {
            state: CONVERTED,
            confirmation_details: {
                final_price,
                receipt_id,
                receipt_date,
                receipt_image
            }
        });

        if (!success) {
            res.status(500).send("Failed to update quote");
            return;
        }

        //Return a success message
        res.status(200).send("Quote confirmed");
    } catch (error) {
        console.error(error);

        res.status(500).send("Failed to update quote");
    }
}

function rejectQuote(req, res, next) {
    //Get the quote id from the request
    const {id} = req.params;


}

module.exports = {
    getListItem,
    getItemDetails,
    getItemQrCode,
    confirmQuote,
    rejectQuote
}