const {
    deleteRetrieval,
    getRetrieval,
    getRetrievalObjectByDeviceId
} = require("../model/mongodb");
const {SEVEN_DAYS_S} = require("../util/time/time");
const retrievalState = require("../model/enum/retrievalState");
const {email} = require("../public/javascripts/Emailing/emailing");
const roleTypes = require("../model/enum/roleTypes");

/**
 * A Middleware to check if a retrieval is expired or expiring soon.
 * If the retrieval is expired, it will be deleted from the database and the user will be informed via email.
 * If the retrieval is expiring soon, the state of the retrieval will be set to "Expiring Soon" and the user will be informed via email.
 * If the retrieval is not expired or expiring soon, the request will continue on without any changes.
 * This middleware does not check if the user is a valid user for the retrieval.
 * This middleware also does not return any responses to the user, all responses are passed to the next middleware.
 * @param req The request object
 * @param res The response object
 * @param next The next middleware in the chain
 * @author Benjamin Lister
 */
exports.verifyRetrievalExpiry = async (req, res, next) => {
    // Check if the retrieval is expired
    // If it is expired, call the deleteRetrieval function in mongodb.js and continue on
    // If it is not expired, continue on

    try {
        //Get the retrieval from the request
        const retrieval = req.retrieval;

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
        if (currentDate > expiryDate && !retrieval.emails_sent?.expired) {
            retrieval.emails_sent.expired = true;
            await deleteRetrieval(retrieval._id);

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
        const expiryLessSevenDays = new Date(expiryDate);
        expiryLessSevenDays.setSeconds(expiryLessSevenDays.getSeconds() - SEVEN_DAYS_S);

        if (currentDate > (expiryLessSevenDays) && !retrieval.emails_sent?.near_expiry) {
            retrieval.retrieval_state = retrievalState.EXPIRING_SOON;
            retrieval.emails_sent.near_expiry = true;
            await retrieval.save();

            //Send the user an email informing them that their retrieval is expiring soon
            const userEmail = retrieval.device?.listing_user?.email;
            const userFullName = `${retrieval.device?.listing_user?.first_name} ${retrieval.device?.listing_user?.last_name}`;
            const deviceName = `${retrieval.device?.brand?.name} ${retrieval.device?.model?.name}`
            const expiry = new Intl.DateTimeFormat("en-GB", {
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
    } catch (error) {
        //If there is an error, return a 500 status code
        res.status(500).render("error/500", {
            auth: req.isLoggedIn,
            user: req.user,
            message: "An error occurred while verifying the retrieval expiry",
            status: 500
        })
    }
}

/**
 * A Middleware to check if a user is a valid user for a retrieval.
 * A user is valid if they are the owner of the retrieval or a staff member.
 * If the user is valid, the request will continue on.
 * If the user is not logged in, they will be sent a 401 status code.
 * If the user is not the owner of the retrieval, they will be sent a 403 status code.
 * @param req The request object
 * @param res The response object
 * @param next The next middleware in the chain
 * @author Benjamin Lister
 */
exports.isValidRetrievalUser = async (req, res, next) => {
    // Check if the user is the owner of the retrieval, or a staff member
    // If they are the owner of the retrieval, continue on
    // If they are a staff member, continue on
    // If they are not the owner of the retrieval, send a 403 status code

    //Get the retrieval object from the request
    const retrieval = req.retrieval;

    //If the retrieval ID is still undefined or null, skip the check
    if (typeof (retrieval) === 'undefined' || retrieval === null) {
        return next();
    }

    //Get the user from the request
    const user = req.user;

    //If the user is null, reject the request as anonymous users cannot access retrievals
    if (typeof (user) === 'undefined' || user === null) {
        return res.render("error/401", {
            auth: req.isLoggedIn,
            user: req.user,
            message: "You do not have permission to access this resource",
            status: 401
        });
    }

    //If the user is the owner of the retrieval, continue on
    if (retrieval.device?.listing_user?._id.toString() === user.id.toString() || user.role >= roleTypes.STAFF) {
        return next();
    }

    //If the user is not the owner of the retrieval, send a 403 status code
    res.render("error/403", {
        auth: req.isLoggedIn,
        user: req.user,
        message: "You do not have permission to access this retrieval",
        status: 403
    });
}

exports.populateRetrievalObject = async (req, res, next) => {
    //Get the retrieval ID from the request parameters
    let retrievalID = req.params.id;

    try {
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

        //If the retrieval is, return a 404 error
        if (retrieval === null || typeof (retrieval) === 'undefined') {
            return res.status(404).render("error/404", {
                auth: req.isLoggedIn,
                user: req.user,
                message: "This item is not available for retrieval",
                status: 404
            });
        }

        req.retrieval = retrieval;
        return next();
    } catch (error) {
        //If there is an error, return a 500 status code
        res.status(500).render("error/500", {
            auth: req.isLoggedIn,
            user: req.user,
            message: "An error occurred while populating the retrieval object",
            status: 500
        })
    }
}