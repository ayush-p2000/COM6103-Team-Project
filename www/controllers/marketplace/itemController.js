/*
 * This controller should handle any operations related to specific items in the marketplace (e.g. adding, removing, updating, etc.)
 */

const multer = require('multer');

const {getMockItem, getMockQuote} = require("../../util/mock/mockData");
const fixedToCurrency = require("../../util/currency/fixedToCurrency");
const {ACCEPTED, REJECTED, CONVERTED, EXPIRED, stateToString, stateToColour} = require("../../model/enum/quoteState");
const {updateQuote, getQuoteById} = require("../../model/mongodb");
const mongoose = require("mongoose");
const QRCode = require('qrcode');

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
async function getItemQrCodeView(req, res, next) {
    //Get the quote id from the request
    const {id} = req.params;

    //Get the quote from the database
    const quote = await getQuoteById(id);

    if (quote === undefined) {
        res.status(404).send("Quote not found")
        return;
    }

    const quoteActive = quote.state !== CONVERTED && quote.state !== REJECTED && quote.state !== EXPIRED;

    //If the quote has been converted, rejected, or expired, then it should no longer be accessible on this page if it is not the listing_user
    //This is to prevent any QR codes displaying sensitive information about the transaction
    if (!quoteActive) {
        if (typeof(req.user) === "undefined" || !quote.device.listing_user._id.equals(new mongoose.Types.ObjectId(req.user?.id))) {
            res.render('error/403unauthorised', {auth: req.isLoggedIn, user: req.user, message: "This quote is no longer active or you are not the listing user. Please contact the listing user for more information."});
            return;
        }
    }


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
    const receipt_image_data = Buffer.from(req.file.buffer, 'base64');
    const receipt_image_type = req.file.mimetype;

    try {
        //Update the quote in the database
        //TODO: update to update the quote in the database once quotes are implemented

        //const success = true;
        const success = await updateQuote(id, {
            state: CONVERTED,
            confirmation_details: {
                final_price,
                receipt_id,
                receipt_date,
                receipt_image: {
                    img_type: receipt_image_type,
                    img_data: receipt_image_data
                }
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

    try {
        //Update the quote in the database to set the state to rejected
        const success = updateQuote(id, {state: REJECTED});

        if (!success) {
            res.status(500).send("Failed to update quote");
            return;

        }
        //Return a success message
        res.status(200).send("Quote rejected");
    } catch (error) {
        console.error(error);

        res.status(500).send("Failed to update quote");

    }
}

async function generateQRCode(req, res, next) {
    //Get the quote id from the request
    const {id} = req.params;

    const url = `${process.env.BASE_URL}:${process.env.PORT}/qr/${id}`;

    const qr = await QRCode.toDataURL(url, {
        errorCorrectionLevel: 'H',
        type: 'image/png',
        quality: 1,
        margin: 1
    });
}

module.exports = {
    getListItem,
    getItemDetails,
    getItemQrCodeView,
    confirmQuote,
    rejectQuote,
    generateQRCode
}