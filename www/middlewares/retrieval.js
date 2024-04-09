const {deleteRetrieval, getRetrieval} = require("../model/mongodb");
const {SEVEN_DAYS_S} = require("../util/time/time");
const retrievalState = require("../model/enum/retrievalState");
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
    const expiryDate = retrieval.expiry_date;

    //If the expiry date is null, skip the check
    if (expiryDate === null) {
        return next();
    }

    //Get the current date
    const currentDate = new Date();

    //If the current date is after the expiry date, delete the retrieval
    if (currentDate > expiryDate) {
        await deleteRetrieval(retrievalID);
    }

    //If the expiry is soon (within 1 week), set the state to "Expiring"
    if (currentDate > (expiryDate - SEVEN_DAYS_S)) {
        retrieval.retrieval_state = retrievalState.EXPIRING_SOON;
        await retrieval.save();
    }

    return next();
}