const {deleteRetrieval, getRetrieval, getRetrievalObjectByDeviceId} = require("../model/mongodb");
const {SEVEN_DAYS_S} = require("../util/time/time");
const retrievalState = require("../model/enum/retrievalState");
const {email} = require("../public/javascripts/Emailing/emailing");
const roleTypes = require("../model/enum/roleTypes");
exports.verifyRetrievalExpiry = async (req, res, next) => {
    // Check if the retrieval is expired
    // If it is expired, call the deleteRetrieval function in mongodb.js and continue on
    // If it is not expired, continue on

    //Get the retrieval ID from the request parameters
    let retrievalID = req.params.id;

    //If the retrieval ID is undefined or null, check for the parameter retrieval_id
    if (typeof (retrievalID) === 'undefined' || retrievalID === null) {
        retrievalID = req.params.retrieval_id;
    }

    //If the retrieval ID is still undefined or null, check the body for the retrieval_id
    if (typeof (retrievalID) === 'undefined' || retrievalID === null) {
        retrievalID = req.body.retrieval_id;
    }

    //If the retrieval ID is still undefined or null, check the parameters for a device_id
    if (typeof (retrievalID) === 'undefined' || retrievalID === null) {
        const deviceID = req.params.device_id;
        if (typeof (deviceID) !== 'undefined' && deviceID !== null) {
            const retrieval = await getRetrievalObjectByDeviceId(deviceID);
            if (retrieval !== null) {
                retrievalID = retrieval._id;
            }
        }
    }

    //If the retrieval ID is still undefined or null, skip the check
    if (typeof (retrievalID) === 'undefined' || retrievalID === null) {
        return next();
    }

    //Get the retrieval from the database
    const retrieval = await getRetrieval(retrievalID);

    //If the retrieval is null, skip the check
    if (retrieval === null) {
        return next();
    }

    //Get the expiry date of the retrieval
    const expiryDate = retrieval.expiry;

    //If the expiry date is null, skip the check
    if (expiryDate === null) {
        return next();
    }

    //Get the current date
    const currentDate = new Date();

    //If the current date is after the expiry date, delete the retrieval
    if (currentDate > expiryDate) {
        await deleteRetrieval(retrievalID);

        //Send the user an email informing them that their retrieval has expired
        const userEmail = retrieval.device?.listing_user?.email;
        const userFullName = `${retrieval.device?.listing_user?.first_name} ${retrieval.device?.listing_user?.last_name}`;
        const deviceName = `${retrieval.device?.brand?.name} ${retrieval.device?.model?.name}`

        const subject = "ePanda - Data Retrieval Expired";
        const message = `Hi ${userFullName} <br><br> We just wanted to let you know that your data from your device has expired.
        <br><br> The device this retrieval is associated with is your ${deviceName}.
        <br> The data has now been deleted from our servers, and you will no longer be able to retrieve it.
        <br><br> If you have any questions or need help, please do not hesitate to contact us.
        <br> Thanks for using ePanda.
        <br><br> Best regards, <p style="color: #2E8B57">Team Panda</p>`;

        email(userEmail, subject, message)

        //The expiring soon check can be skipped if the retrieval has expired
        return next();
    }

    //If the expiry is soon (within 1 week), set the state to "Expiring"
    if (currentDate > (expiryDate - SEVEN_DAYS_S)) {
        retrieval.retrieval_state = retrievalState.EXPIRING_SOON;
        await retrieval.save();

        //Send the user an email informing them that their retrieval is expiring soon
        const userEmail = retrieval.device?.listing_user?.email;
        const userFullName = `${retrieval.device?.listing_user?.first_name} ${retrieval.device?.listing_user?.last_name}`;
        const deviceName = `${retrieval.device?.brand?.name} ${retrieval.device?.model?.name}`
        const expiry= new Intl.DateTimeFormat("en-GB", {
            year: "numeric",
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
            timeZone: "Europe/London"
        }).format(retrieval.expiry)

        const subject = "ePanda - Data Retrieval Expiring Soon";
        const message = `Hi ${userFullName} <br><br> We just wanted to let you know that your data from your device is expiring soon. 
        <br><br> The device this retrieval is associated with is your ${deviceName}, 
        <br> and it is due to expire on ${expiry}.
        <br><br> Please make sure to download your data before it expires. or it will be deleted from our servers.
        <br> If you need more time, you have the option to extend the retrieval period by 3 or 6 months for an additional fee.
        <br> To do this, please log in to your account and go to the retrieval page to extend the retrieval period.
        <br><br> If you have any questions or need help, please do not hesitate to contact us.
        <br><br> Best regards, <p style="color: #2E8B57">Team Panda</p>`;
        
        email(userEmail, subject, message)
    }

    return next();
}

exports.isValidRetrievalUser = async (req, res, next) => {
    // Check if the user is the owner of the retrieval, or a staff member
    // If they are the owner of the retrieval, continue on
    // If they are a staff member, continue on
    // If they are not the owner of the retrieval, send a 403 status code

    //Get the retrieval ID from the request parameters
    let retrievalID = req.params.id;

    //If the retrieval ID is undefined or null, check for the parameter retrieval_id
    if (typeof (retrievalID) === 'undefined' || retrievalID === null) {
        retrievalID = req.params.retrieval_id;
    }

    //If the retrieval ID is still undefined or null, check the body for the retrieval_id
    if (typeof (retrievalID) === 'undefined' || retrievalID === null) {
        retrievalID = req.body.retrieval_id;
    }

    //If the retrieval ID is still undefined or null, check the parameters for a device_id
    if (typeof (retrievalID) === 'undefined' || retrievalID === null) {
        const deviceID = req.params.device_id;
        if (typeof (deviceID) !== 'undefined' && deviceID !== null) {
            const retrieval = await getRetrievalObjectByDeviceId(deviceID);
            if (retrieval !== null) {
                retrievalID = retrieval._id;
            }
        }
    }

    //If the retrieval ID is still undefined or null, skip the check
    if (typeof (retrievalID) === 'undefined' || retrievalID === null) {
        return next();
    }

    //Get the retrieval from the database
    const retrieval = await getRetrieval(retrievalID);

    //If the retrieval is null, skip the check
    if (retrieval === null) {
        return next();
    }

    //Get the user from the request
    const user = req.user;

    //If the user is null, reject the request as anonymous users cannot access retrievals
    if (user === null) {
        return res.render("error/401", {auth: req.isLoggedIn, user: req.user, message: "You do not have permission to access this resource", status: 401});
    }

    //If the user is the owner of the retrieval, continue on
    if (retrieval.device?.listing_user?._id.toString() === user.id.toString() || user.role >= roleTypes.STAFF) {
        return next();
    }

    //If the user is not the owner of the retrieval, send a 403 status code
    res.render("error/403", {auth: req.isLoggedIn, user: req.user, message: "You do not have permission to access this retrieval", status: 403});
}