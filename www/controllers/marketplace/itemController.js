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
const {getItemDetail, getAllDeviceType, getAllBrand, getModels, listDevice, getDevice, updateDevice, getHistoryByDevice} = require('../../model/mongodb');
const deviceState = require("../../model/enum/deviceState")
const deviceCategory = require("../../model/enum/deviceCategory")

/**
 * Handling Request to post item base on the info in request body
 * @author Zhicong Jiang
 */
const postListItem = async (req, res) => {
    console.log("PostingItem")
    var id = req.params.id;
    try {
        const files = req.files;
        const filePaths = [];
        for (let i = 0; i < files.length; i++) {
            const filePath = files[i].path;
            filePaths.push(filePath);
        }

        if (typeof id === 'undefined'){
            console.log("Adding")
            const deviceId = await listDevice(req.body, filePaths, req.user);
            res.status(200).send(deviceId);
        }else{
            console.log("Updating")
            const deviceId = await updateDevice(id, req.body, filePaths);
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
            res.render('marketplace/list_item', {
                auth: req.isLoggedIn,user:req.user, role: 'user',
                deviceTypes: deviceTypes, brands: brands
            });
        } catch (err) {
            console.log(err)
        }
    }else{
        try{
            let device = await getDevice(id);
            res.render('marketplace/edit_item', {
                auth: req.isLoggedIn,user:req.user, role: 'user', device: device[0]
            });
            // res.send(device)
        }catch (err){
            console.log(err)
        }
    }
}

/**
 * get specific Model By querying Brand And DeviceType
 * @author Zhicong Jiang
 */
async function getModelByBrandAndType(req, res) {
    try {
        let models = await getModels(req.query.brand,req.query.deviceType);
        res.send(models);
    } catch (err) {
        res.send(err)
    }
}


/**
 * Get item details to display it in the User's item detail page, where it shows the device specifications
 * @author Vinroy Miltan DSouza & Zhicong Jiang
 */
async function getItemDetails(req, res, next) {
    try{
        const item = await getItemDetail(req.params.id)
        var specs = []
        if (item.model != null) {
            specs = JSON.parse(item.model.properties.find(property => property.name === 'specifications')?.value)
        }else{
            var deviceType = ""
            var brand = ""
            var model = ""
            const customModel = await getHistoryByDevice(item._id)
            customModel[0].data.forEach(data => {
                if (data.name === "device_type"){
                    deviceType = data.value
                }else if(data.name === "brand"){
                    brand = data.value
                }else if(data.name === "model"){
                    model = data.value
                }
            });
            item.device_type = {name: deviceType}
            item.brand = {name: brand}
            item.model = {name: model}
        }
        res.render('marketplace/item_details', {item, specs, deviceCategory, deviceState, auth: req.isLoggedIn, user:req.user, role: 'user'})
    }catch (e){
        console.log(e)
    }
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
    postListItem,
    getListItem,
    getModelByBrandAndType,
    getItemDetails,
    getItemQrCodeView,
    confirmQuote,
    rejectQuote,
    generateQRCode
}