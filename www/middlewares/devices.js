const {getItemDetail} = require("../model/mongodb");

exports.populateDeviceObject = async (req, res, next) => {
    //Get the device ID from the request
    const {id} = req.params;

    //Get the device object from the database
    const item = await getItemDetail(id);

    //If the device object is not found, then the item is not available
    if (typeof (item) === 'undefined' || item === null) {
        res.status(404).send('Item not found');
        return;
    }

    //Set the device object in the request
    req.device = item;

    //Continue with the next middleware
    next();
}