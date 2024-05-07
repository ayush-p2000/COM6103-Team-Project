const {getItemDetail} = require("../model/mongodb");

exports.populateDeviceObject = async (req, res, next) => {
    //Get the device ID from the request
    const id = req.params.id;

    //If the device ID is undefined or null, skip the check
    if (typeof (id) === 'undefined' || id === null) {
        return next();
    }

    //If the device already exists in the request, skip the check
    if (req.device) {
        return next();
    }

    try {
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
    } catch (error) {
        //If there is an error, return a 500 status code
        res.status(500).send(error.message);
    }
}