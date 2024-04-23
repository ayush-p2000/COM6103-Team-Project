/*
 * This controller should handle any operations related to specific items in the marketplace (e.g. adding, removing, updating, etc.)
 */

const fixedToCurrency = require("../../util/currency/fixedToCurrency");
const {ACCEPTED, REJECTED, CONVERTED, EXPIRED, stateToString, stateToColour} = require("../../model/enum/quoteState");
const {
    updateQuote,
    getQuoteById,
    getUnknownDeviceHistoryByDevice,
    getRetrievalObjectByDeviceId
} = require("../../model/mongodb");
const mongoose = require("mongoose");
const {
    getItemDetail,
    getAllDeviceType,
    getAllBrand,
    getModels,
    listDevice,
    getDevice,
    updateDevice,
    getHistoryByDevice,
    getQuotes,
    updateQuoteState,
    updateDeviceState
} = require('../../model/mongodb');
const deviceState = require("../../model/enum/deviceState")
const deviceCategory = require("../../model/enum/deviceCategory")
const quoteState = require("../../model/enum/quoteState")
const deviceColors = require("../../model/enum/deviceColors")
const deviceCapacity = require("../../model/enum/deviceCapacity")
const {generateQR} = require("../../util/qr/qrcodeGenerator");
const {renderUserLayout} = require("../../util/layout/layoutUtils");
const retrievalState = require("../../model/enum/retrievalState");
const historyType = require("../../model/enum/historyType");
const roleTypes = require("../../model/enum/roleTypes");
const {handleMissingModels} = require("../../util/Devices/devices");

/**
 * Handling Request to post item base on the info in request body
 * @author Zhicong Jiang
 */
const postListItem = async (req, res) => {
    var id = req.params.id;
    try {
        const files = req.files;

        const filesBase64 = [];
        for (let i = 0; i < files.length; i++) {

            const image_data = Buffer.from(files[i].buffer, 'base64');
            const image_type = files[i].mimetype;
            const base64Data = {img_data: image_data, img_type: image_type}

            filesBase64.push(base64Data);
        }

        if (typeof id === 'undefined') {
            const deviceId = await listDevice(req.body, filesBase64, req.user);
            res.status(200).send(deviceId);
        } else {
            const deviceId = await updateDevice(id, req.body, filesBase64);
            res.status(200).send(deviceId);
        }
    } catch (err) {
        console.log(err);
        res.status(500).send('Internal server error');
    }
};

/**
 * Respond form view for user to post item
 * @author Zhicong Jiang
 */
async function getListItem(req, res) {
    var id = req.params.id;
    if (typeof id === 'undefined') {
        try {
            let deviceTypes = await getAllDeviceType();
            let brands = await getAllBrand();
            renderUserLayout(req, res, '../marketplace/list_item', {
                auth: req.isLoggedIn, user: req.user, deviceTypes: deviceTypes, brands: brands, colors: deviceColors, capacities: deviceCapacity
            })

        } catch (err) {
            console.log(err);
        }
    } else {
        try {
            let device = await getDevice(id);
            if (device.model == null) {
                await handleMissingModels([device]);
            }
            renderUserLayout(req, res, '../marketplace/edit_item', {
                auth: req.isLoggedIn, user: req.user, device: device, colors: deviceColors, capacities: deviceCapacity
            })
        } catch (err) {
            console.log(err);
        }
    }
}

/**
 * get specific Model By querying Brand And DeviceType
 * @author Zhicong Jiang
 */
async function getModelByBrandAndType(req, res) {
    try {
        let models = await getModels(req.query.brand, req.query.deviceType);
        res.send(models);
    } catch (err) {
        res.send(err)
    }
}


/**
 * Get item details to display it in the User's item detail page, where it shows the device specifications
 * Here also the device price quotes are retrieved from the database to display in the item page
 * @author Vinroy Miltan Dsouza <vmdsouza1@sheffield.ac.uk> & Zhicong Jiang
 */
async function getItemDetails(req, res, next) {
    try {
        const item = await getItemDetail(req.params.id)
        var specs = []

        var quotes = await getQuotes(req.params.id)
        if (quotes.length > 0 && item.state < deviceState.HAS_QUOTE && item.state !== deviceState.IN_REVIEW) {
            item.state = deviceState.HAS_QUOTE;
            await item.save()
        }

        if (item.model != null) {
            const specProp = item.model.properties.find(property => property.name === 'specifications')?.value;
            if (specProp != null) {
                specs = JSON.parse(specProp)
            } else {
                specs = []
            }
        } else {
            await handleMissingModels(item)
        }

        // Add a QR code to each quote
        for (let quote of quotes) {
            const qr = await generateQR(quote._id);
            quote.qr_code = qr;
        }

        const deviceReviewHistory = await getHistoryByDevice(req.params.id, [historyType.REVIEW_REQUESTED, historyType.REVIEW_REJECTED, historyType.REVIEW_ACCEPTED]);
        const deviceVisibilityHistory = await getHistoryByDevice(req.params.id, [historyType.ITEM_HIDDEN, historyType.ITEM_UNHIDDEN]);


        let retrievalData = null;
        if (item.state === deviceState.DATA_RECOVERY) {
            retrievalData = await getRetrievalObjectByDeviceId(item._id);
        }
        renderUserLayout(req, res, '../marketplace/item_details', {
            item, specs, deviceCategory, deviceState, quoteState, quotes, auth: req.isLoggedIn, user: req.user, retrievalData, retrievalState,deviceReviewHistory, deviceVisibilityHistory, historyType, roleTypes
        })
        // res.render('marketplace/item_details', {
        //     item, specs, deviceCategory, deviceState, quoteState, quotes, auth: req.isLoggedIn, user: req.user,
        // })
    } catch (e) {
        console.log(e)
        res.status(500);
        next({message: "Internal server error"});
    }

}

async function postUpdateQuote(req, res) {
    try {
        const state = req.body.state
        const value = quoteState[state]
        const device_state = deviceState.HAS_QUOTE
        const updated_quote = await updateQuoteState(req.params.id, value)
        await updateDeviceState(req.params.id, device_state)
    } catch (err) {
        console.log(err)
    }
}


/*
 * ######################################################################
 * ## These functions are called by the QR router, not the marketplace ##
 * ######################################################################
 */

/**
 * Render the QR code quote page for the given quote ID
 * @author Benjamin Lister
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

    //A quote is deeemed active if it is not converted, rejected, or expired as these are end states
    //This flag is used to block access to the quote if it is not active as it may contain sensitive information and
    // this endpoint is publicly facing so that the QR code can be scanned by the buyer
    const quoteActive = quote.state !== CONVERTED && quote.state !== REJECTED && quote.state !== EXPIRED;

    //If the quote has been converted, rejected, or expired, then it should no longer be accessible on this page if it is not the listing_user
    //This is to prevent any QR codes displaying sensitive information about the transaction
    if (!quoteActive) {
        if (typeof (req.user) === "undefined" || !quote.device.listing_user._id.equals(new mongoose.Types.ObjectId(req.user?.id))) {
            res.render('error/403unauthorised', {
                auth: req.isLoggedIn,
                user: req.user,
                message: "This quote is no longer active or you are not the listing user. Please contact the listing user for more information."
            });
            return;
        }
    }


    //Return the QR code page
    //Three functions are passed to the view so that the view can use them to display the quote information in
    // a user-friendly way
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


/**
 * The endpoint to confirm a quote. This is called by the /qr/:id/confirm endpoint and is intentioned to
 *  be called by either the buyer or the seller after the buyer has paid for the item.
 *  This action is intended to close the quote and move it into the converted state.
 *  The actor must provide the final price, receipt ID, receipt date, and receipt image for verification on
 *  our end.
 * @author Benjamin Lister
 */
async function confirmQuote(req, res, next) {
    //Get the quote id from the request
    const {id} = req.params;

    const quote = await getQuoteById(id);

    //If the quote is in a final state, this endpoint should reject the request as
    // the quote is no longer active and is effectively closed and is therefore read-only
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
        //const success = true;
        const success = await updateQuote(id, {
            state: CONVERTED, confirmation_details: {
                final_price, receipt_id, receipt_date, receipt_image: {
                    img_type: receipt_image_type, img_data: receipt_image_data
                }
            }
        });

        const device = await getDevice(quote.device?._id);
        device.state = deviceState.SOLD;
        await device.save();

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

/**
 * The endpoint to reject a quote. This is called by the /qr/:id/reject endpoint and is intentioned to
 * be called by either the buyer or the seller if the transaction cannot be completed.
 * This could be due to a variety of reasons such as the buyer not paying, the seller not being able to
 * provide the item as described, or any other reason that would prevent the transaction from being completed.
 * This action is intended to close the quote and move it into the rejected state.
 * @author Benjamin Lister
 */
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

/**
 * Generates a QR code that links to the QR quote page for the given quote ID.
 * The QR code is returned as a data URL so that it can be displayed in the browser.
 * This endpoint should be used if a QR code is needed at runtime, i.e: when the QR code is displayed
 *  in a modal
 * @author Benjamin Lister
 */
async function generateQRCode(req, res, next) {
    //Get the quote id from the request
    const {id} = req.params;

    //Generate the QR code
    const qr = await generateQR(id);

    //Return the QR code as a data URL
    res.send(qr);
}

module.exports = {
    postListItem,
    getListItem,
    getModelByBrandAndType,
    getItemDetails,
    postUpdateQuote,
    getItemQrCodeView,
    confirmQuote,
    rejectQuote,
    generateQRCode
}