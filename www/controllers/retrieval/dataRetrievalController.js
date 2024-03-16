/*
 * This controller should handle any operations related to data retrieval such as the file explorer and secure viewing
 */


function getDataRetrivalPage(req, res, next) {
    //TODO: Add functionality for the data retrieval page
    res.send('[Data Retrieval Page Here]')
}

function getDataSetPage(req, res, next) {
    //TODO: Add functionality for the data set page
    res.send('[Data Set Page Here]')
}

module.exports = {
    getDataRetrivalPage,
    getDataSetPage
}