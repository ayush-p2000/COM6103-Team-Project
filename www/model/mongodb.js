/* Imports */
const mongoose = require('mongoose');
const regexEscape = require('regex-escape');
const MongoStore = require('connect-mongo')

/* Schemas */
const {User} = require("./schema/user");
const {Device} = require("./schema/device");
const {DeviceType} = require("./schema/deviceType");
const {Brand} = require("./schema/brand");
const {Model} = require("./schema/model");
const {Provider} = require("./schema/provider");
const {Quote} = require("./schema/quote");
const {Retrieval} = require("./schema/retrieval");
const {History} = require("./schema/history");

const {UNKNOWN_DEVICE} = require("./enum/historyType");

const {UNKNOWN} = require("./enum/deviceCategory")
const {HAS_QUOTE} = require("./enum/deviceState")
const deviceState = require("./enum/deviceState");
const {quoteState} = require("./enum/quoteState");
const historyType = require("./enum/historyType");
const transactionState = require('./enum/transactionState')
const retrievalState = require('./enum/retrievalState')

/* Connection Properties */
const MONGO_HOST = process.env.MONGO_HOST || "localhost";
const MONGO_USER = process.env.MONGO_USER || "admin";
const MONGO_PASS = process.env.MONGO_PASS;
const MONGO_DBNAME = process.env.MONGO_DBNAME || "test";
const MONGO_CONNNAME = process.env.MONGO_CONNNAME || "mongodb";

/* Connection String */
const connectionString = `mongodb+srv://${MONGO_USER}:${MONGO_PASS}@${MONGO_HOST}/${MONGO_DBNAME}?retryWrites=true&w=majority`;

/* Variables */
let connected = false;
let store;

mongoose.connect(connectionString)

const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', async () => {
    console.log(`Connected to ${MONGO_CONNNAME}`);
    connected = true;
});

/* Functions */
async function getAllUsers() {
    return User.find();
}

async function getUserById(id) {
    return await User.findOne({_id: id});
}

async function searchUser(filter) {
    return User.findOne(filter);
}

async function searchUserAndPopulate(filter) {
    return User.findOne(filter).populate('listed_devices').populate('listed_devices.model').populate('listed_devices.brand').populate('listed_devices.device_type');
}

async function createUser(user) {
    return await User.create(user);
}

async function updateUser(id, user) {
    return await User.updateOne({_id: id}, user);
}


/**
 * Get method to retrieve the user items from mongodb database
 * @author Vinroy Miltan Dsouza <vmdsouza1@sheffield.ac.uk>
 */
async function getUserItems(id) {
    return Device.find({'listing_user': id}).populate({
        path: 'device_type brand model listing_user',
        options: {strictPopulate: false}
    });
}

/**
 * Get method to retrieve a specific device details of the User from the database
 * @author Vinroy Miltan Dsouza <vmdsouza1@sheffield.ac.uk>
 */
async function getItemDetail(id) {
    return await Device.findOne({_id: id}).populate({
        path: 'device_type brand model listing_user',
        options: {strictPopulate: false}
    });
}


/**
 * Get method to retrieve a quotation details of the device from the database
 * @author Vinroy Miltan Dsouza <vmdsouza1@sheffield.ac.uk>
 */
async function getQuotes(deviceId) {
    try {
        return await Quote.find({device: deviceId}).populate('provider')
    } catch (err) {
        console.log(err)
    }

}

/**
 * Get method to retrieve providers detail  from the database
 * @author Vinroy Miltan Dsouza <vmdsouza1@sheffield.ac.uk>
 */
async function getProviders() {
    return await Provider.find()
}

/**
 * Add method to save the details of a new Quote to the database
 * @author Vinroy Miltan Dsouza <vmdsouza1@sheffield.ac.uk>
 */
async function addQuote(quoteDetails) {
    try {
        const quote = new Quote({
            device: quoteDetails.device,
            provider: quoteDetails.provider,
            url: quoteDetails.url,
            value: quoteDetails.value,
            state: quoteDetails.state,
            expiry: quoteDetails.expiry
        })
        return await quote.save()
    } catch (err) {
        console.error("An error occurred while adding the quotes:", err);
        throw err;
    }
}

/**
 * Update method to save the quote state to the database
 * @author Vinroy Miltan Dsouza <vmdsouza1@sheffield.ac.uk>
 */
async function updateQuoteState(id, state) {
    try {
        return await Quote.updateOne({device: id}, {state: state})
    } catch (err) {
        console.log(err)
    }
}


/**
 * Delete method to delete the quote from the database if the expiry date is passed
 * @author Vinroy Miltan Dsouza <vmdsouza1@sheffield.ac.uk>
 */
async function deleteQuote(id) {
    try {
        return await Quote.deleteOne({_id: id})
    } catch (err) {
        console.log(err)
    }
}

/**
 * Update method to save the device state to the database
 * @author Vinroy Miltan Dsouza <vmdsouza1@sheffield.ac.uk>
 */
async function updateDeviceState(id, state) {
    try {
        const filter = {
            _id: id
        }
        const update = {
            $set : {
                state: state
            }
        }
        return await Device.updateOne(filter, update)
    } catch (err) {
        console.log(err)
    }
}

/**
 * Get a List of All DeviceType
 * @author Zhicong Jiang <zjiang34@sheffield.ac.uk>
 */
const getAllDeviceType = async () => {
    try {
        return await DeviceType.find({is_deleted: {$ne: true}});
    } catch (error) {
        console.error("An error occurred while get All DeviceType:", error);
        throw error;
    }
}

/**
 * Get a List of All Brands
 * @author Zhicong Jiang <zjiang34@sheffield.ac.uk>
 */
const getAllBrand = async () => {
    try {
        return await Brand.find({is_deleted: {$ne: true}});
    } catch (error) {
        console.error("An error occurred while get All Brand:", error);
        throw error;
    }
}

/**
 * Get Brand by ID
 * @author Adrian Urbanczyk <aurbanczyk1@sheffield.ac.uk>
 */

const getBrandById = async (id) => {
    return await Brand.findById(id).populate({
        path: "models", populate: [{path: "deviceType"}, {path: "category"}
        ]
    })
}

/**
 * Get a List of Models Base on Specific Brand and Type
 * @author Zhicong Jiang <zjiang34@sheffield.ac.uk>
 */
const getModels = async (brandId, deviceTypeId) => {
    try {
        return await Model.find({
            brand: new mongoose.Types.ObjectId(brandId),
            deviceType: new mongoose.Types.ObjectId(deviceTypeId)
        })
    } catch (error) {
        console.error("An error occurred while get Models:", error);
        throw error;
    }
}
/**
 * Get All models
 * @author Adrian Urbanczyk <aurbanczyk1@sheffield.ac.uk>
 */
const getAllModels = async () => {
    return await Model.find({is_deleted: {$ne: true}}).populate("deviceType").populate("brand")
}

/**
 * Get All models of a type
 * @author Adrian Urbanczyk <aurbanczyk1@sheffield.ac.uk>
 */
const getAllModelsOfType = async (type) => {
    return await Model.find({deviceType: type, is_deleted: false}).populate("deviceType").populate("brand")
}

/**
 * Get Model By ID
 * @author Adrian Urbanczyk <aurbanczyk1@sheffield.ac.uk>
 */
const getModelById = async (id) => {
    return await Model.findById(id)
}

/**
 * Update Model Details
 * @author Adrian Urbanczyk <aurbanczyk1@sheffield.ac.uk>
 */
const updateModelDetails = async (id, name, modelBrand, modelType) => {
    const model = await getModelById(id)
    model.name = name
    model.brand = modelBrand
    model.deviceType = modelType
    await model.save()
}
/**
 * Adding a Device to the Database
 * If User Input Custom Model,Create a History Link To The Device
 * @author Zhicong Jiang <zjiang34@sheffield.ac.uk>
 */
const listDevice = async (deviceData, photos, user) => {
    try {
        const newDevice = new Device({
            device_type: mongoose.Types.ObjectId.isValid(deviceData.device_type) ? deviceData.device_type : new mongoose.Types.ObjectId(),
            brand: mongoose.Types.ObjectId.isValid(deviceData.brand) ? deviceData.brand : new mongoose.Types.ObjectId(),
            model: mongoose.Types.ObjectId.isValid(deviceData.model) ? deviceData.model : new mongoose.Types.ObjectId(),
            color: deviceData.color,
            capacity: deviceData.capacity,
            years_used: deviceData.years_used,
            details: JSON.parse(deviceData.details),
            category: deviceData.category,
            good_condition: deviceData.good_condition,
            state: deviceData.state,
            data_service: deviceData.data_service,
            additional_details: deviceData.additional_details,
            listing_user: user.id,
            photos: photos,
            visible: deviceData.visible
        });
        const savedDevice = await newDevice.save();

        if (!mongoose.Types.ObjectId.isValid(deviceData.model)) {
            const data = [
                {name: 'device_type', value: deviceData.device_type, data_type: 0},
                {name: 'brand', value: deviceData.brand, data_type: 0},
                {name: 'model', value: deviceData.model, data_type: 0}
            ];
            const newHistory = new History({
                device: savedDevice,
                history_type: historyType.UNKNOWN_DEVICE,
                data: data.map(item => ({
                    name: item.name,
                    value: item.value,
                    data_type: item.data_type
                })),
                actioned_by: user.id
            })
            const savedHistory = await newHistory.save();
        }

        return savedDevice._id;
    } catch (error) {
        console.error("An error occurred while listing the device:", error);
        throw error;
    }
}

/**
 * Get History Data for UnknownDevice(history_type: 6)
 * @author Zhicong Jiang <zjiang34@sheffield.ac.uk>
 */
const getAllUnknownDevices = async () => {
    return History.find({history_type: UNKNOWN_DEVICE}).populate("device");
}

const addHistory = async (device, history_type, data, actioned_by) => {
    return History.create({
        device: device,
        history_type: history_type,
        data: data,
        actioned_by: actioned_by
    });
}

const getReviewHistory = async (device) => {
    //Get all the history of the device matching only the review history types ordered by the date they were created
    return History.find({
        device: device,
        history_type: {$in: [historyType.REVIEW_REQUESTED, historyType.REVIEW_ACCEPTED, historyType.REVIEW_REJECTED]}
    }).sort({createdAt: -1});
}

/**
 * Get History Data for a Specific Device and Filtered by History Types.
 * This will be returned in reverse-chronological order.
 * @param device - The device ID to get the history for
 * @param historyTypes {Array<number>} - The history types to filter by
 * @author Benjamin Lister
 */
const getHistoryByDevice = async (device, historyTypes) => {
    //Get all the history of the device matching only the review history types ordered by the date they were created
    return History.find({
        device: device,
        history_type: {$in: historyTypes}
    }).sort({createdAt: -1});
}

const getAllRetrievalDevices = async () => {
    return Device.find({state: deviceState.DATA_RECOVERY});
}

/**
 * Get Device Type By ID
 * @author Adrian Urbanczyk <aurbanczyk1@sheffield.ac.uk>
 */
const getDeviceTypeById = async (id) => {
    return await DeviceType.findById(id)
}
/**
 * Update device type details
 * @author Adrian Urbanczyk <aurbanczyk1@sheffield.ac.uk>
 */
const updateDeviceTypeDetails = async (id, name, description) => {
    const deviceType = await DeviceType.findById(id)
    deviceType.name = name
    deviceType.description = description

    await deviceType.save()
}

/**
 * Delete device type
 * @author Adrian Urbanczyk <aurbanczyk1@sheffield.ac.uk>
 */
const deleteType = async id => {
    const type = await getDeviceTypeById(id)
    type.is_deleted = true
    type.name = "Deleted device type"
    await type.save()
}
/**
 * Add a New DeviceType to db
 * @author Zhicong Jiang <zjiang34@sheffield.ac.uk>
 */
const addDeviceType = async (name, description) => {
    const newDeviceType = new DeviceType({
        name: name,
        description: description
    });
    return await newDeviceType.save()
}

/**
 * Add a New Brand to db
 * @author Zhicong Jiang <zjiang34@sheffield.ac.uk>
 */
const addBrand = async (name) => {
    const newBrand = new Brand({
        name: name,
        models: []
    });
    return await newBrand.save()
}

/**
 * Update device type details
 * @author Adrian Urbanczyk <aurbanczyk1@sheffield.ac.uk>
 */
const updateBrandDetails = async (id, name) => {
    const brand = await Brand.findById(id)
    brand.name = name

    await brand.save()
}

/**
 * Delete brand
 * @author Adrian Urbanczyk <aurbanczyk1@sheffield.ac.uk>
 */
const deleteBrand = async id => {
    const brand = await getBrandById(id)
    brand.is_deleted = true
    brand.name = "Deleted brand"
    await brand.save()
}

/**
 * Add a New Model to db
 * @author Zhicong Jiang <zjiang34@sheffield.ac.uk>
 */
const addModel = async (modelData, properties, category) => {
    const newModel = new Model({
        name: modelData.name,
        brand: modelData.brand,
        deviceType: modelData.device_type,
        properties: properties,
        category: category,
    });
    return await newModel.save()
}

/**
 * Update Unknown Devices if there is a custom model match the brand and model name
 * @author Zhicong Jiang <zjiang34@sheffield.ac.uk>
 */
const updateUnknownDevices = async (type,brand,model) => {
    try{
        const modelData = await Model.findById(model).populate("brand")
        const modelName = modelData.name
        const brandName = modelData.brand.name
        const modelCategory = modelData.category

        var unknownDevices = await History.find({history_type: UNKNOWN_DEVICE}).populate("device")

        for (let device of unknownDevices) {
            if (device.device.category === UNKNOWN){
                var deviceBrand = "";
                var deviceModel = "";

                for (let key in device.data) {
                    if (device.data[key].name === "brand") {
                        deviceBrand = device.data[key].value;
                    } else if (device.data[key].name === "model") {
                        deviceModel = device.data[key].value;
                    }
                }
                const filter = {_id: device.device._id}

                if (brandName.replace(/[^\w]/g, '').toLowerCase() === deviceBrand.replace(/[^\w]/g, '').toLowerCase()
                    && modelName.replace(/[^\w]/g, '').toLowerCase() === deviceModel.replace(/[^\w]/g, '').toLowerCase()){
                    const device = {
                        $set: {
                            model: model,
                            brand: brand,
                            device_type: type,
                            category: modelCategory
                        }
                    }
                    const updatedDevice = await Device.updateOne(filter, device)
                }
            }
        }
    }catch (e) {
        console.log(e)
    }

}

/**
 * Delete model
 * @author Adrian Urbanczyk <aurbanczyk1@sheffield.ac.uk>
 */
const deleteModel = async id => {
    const model = await getModelById(id)
    model.is_deleted = true
    model.name = "Deleted model"
    await model.save()
}

/**
 * Updating Specific Field for The Specific Device
 * @author Zhicong Jiang <zjiang34@sheffield.ac.uk>
 */
const updateDevice = async (id, deviceData, photos) => {
    try {
        const filter = {_id: id}
        const update = {
            $set: {
                color: deviceData.color,
                capacity: deviceData.capacity,
                years_used: deviceData.years_used,
                details: JSON.parse(deviceData.details),
                good_condition: deviceData.good_condition,
                state: 1,
                data_service: deviceData.data_service,
                additional_details: deviceData.additional_details,
            }
        };

        if (photos.length > 0) {
            update.$set.photos = photos;
        }
        const updatedDevice = await Device.updateOne(filter, update);
        return updatedDevice._id;
    } catch (error) {
        console.error("An error occurred while update Device:", error);
        throw error;
    }
}

/**
 * Getting UNKNOWN Device's custom model Detail by Device's id
 * @author Zhicong Jiang <zjiang34@sheffield.ac.uk>
 */
const getUnknownDeviceHistoryByDevice = async (id) => {
    try {
        return History.find({device: id, history_type: UNKNOWN_DEVICE});
    } catch (error) {
        console.error("An error occurred while get History By Device:", error);
        throw error;
    }
}

/**
 * Getting Device's Detail by Device's id
 * @author Zhicong Jiang <zjiang34@sheffield.ac.uk>
 */
const getDevice = async (id) => {
    try {
        return Device.findOne({_id: id}).populate('brand').populate('device_type').populate('model');
    } catch (error) {
        console.error("An error occurred while get Device:", error);
        throw error;
    }
}


/**
 * Get All Devices in DB
 * @author Zhicong Jiang <zjiang34@sheffield.ac.uk>
 */
const getAllDevices = async (filter = {}) => {

    return Device.find(filter).populate('brand').populate('device_type').populate('model').populate('listing_user');
}

/**
 * Get devices for landing page carousel
 * @author Adrian Urbanczyk <aurbanczyk1@sheffield.ac.uk>
 */
const getCarouselDevices = async (imgPerCarousel) => {
    const devices = await Device.find({category: {$ne: UNKNOWN}, state: HAS_QUOTE}).populate("model").select({
        model: 1,
        photos: 1,
        listing_user: 0,
        brand: 0,
        device_type: 0
    }).limit(imgPerCarousel * 3)
    // devices = Array.from(devices)
    for (let i = 0; i < devices.length; i++) {
        const quotes = await getQuotes(devices[i]._id);
        devices[i] = {...devices[i]._doc, quote: quotes.length ? quotes[0] : null}
    }
    console.log(devices[0])
    return devices
}

/**
 * Get method to retrieve all the device types
 * @author Vinroy Miltan Dsouza <vmdsouza1@sheffield.ac.uk>
 */
async function getAllDeviceTypes() {
    return await DeviceType.find({is_deleted: {$ne: true}});
}

/**
 * Get method to retrieve all the brands
 * @author Vinroy Miltan Dsouza <vmdsouza1@sheffield.ac.uk>
 */
async function getAllBrands() {
    return await Brand.find({is_deleted: {$ne: true}});
}

/**
 * Update method to update the details of the device from the staff side to the mongodb database
 * @author Vinroy Miltan Dsouza <vmdsouza1@sheffield.ac.uk> & Zhicong Jiang <zjiang34@sheffield.ac.uk>
 */
async function updateDeviceDetails(id, deviceDetails) {
    try {

        var category = deviceDetails.category

        if (typeof deviceDetails.model !== 'undefined') {
            var modelCategory = await Model.findOne({_id: deviceDetails.model})
            category = modelCategory.category
        }

        const filter = {_id: id}
        const device = {
            $set: {
                color: deviceDetails.color,
                capacity: deviceDetails.capacity,
                years_used: deviceDetails.years_used,
                model: deviceDetails.model,
                brand: deviceDetails.brand,
                device_type: deviceDetails.device_type,
                details: JSON.parse(deviceDetails.details),
                category: category,
                good_condition: deviceDetails.good_condition,
                state: deviceDetails.state,
                additional_details: deviceDetails.additional_details,
                visible: deviceDetails.visible
            }
        }
        const updatedDevice = await Device.updateOne(filter, device)

        if (!updatedDevice) {
            alert("Device not found")
        }
        return updatedDevice;
    } catch (error) {
        console.error('Error updating device:', error);
        throw error;
    }
}

const getQuoteById = async (id) => {
    return Quote.findOne({_id: id});//.populate('device').populate('provider').populate('device.listing_user').populate('device.model').populate('device.brand').populate('device.device_type');
}

const updateQuote = async (id, updatedProps) => {
    return Quote.updateOne({_id: id}, updatedProps);
}

/**
 * Returns a retrieval object that is associated with the provided device id.
 * If you need to query the retrieval object by it's own ID, use {@link getRetrieval} instead.
 * @param deviceId - The device ID to search for.
 * @returns {Promise<Retrieval | null>} - The retrieval object associated with the device ID, or null if no retrieval object is found.
 * @author Benjamin Lister
 */
const getRetrievalObjectByDeviceId = async (deviceId) => {
    return Retrieval.findOne({device: deviceId}).populate('device');
}

/**
 * Returns a retrieval object that is associated with the provided retrieval ID.
 * If you need to query the retrieval object by the device ID, use {@link getRetrievalObjectByDeviceId} instead.
 * @param retrievalId - The retrieval ID to search for.
 * @returns {Promise<Retrieval | null>} - The retrieval object associated with the retrieval ID, or null if no retrieval object is found.
 * @author Benjamin Lister
 */
const getRetrieval = async (retrievalId) => {
    return Retrieval.findOne({_id: retrievalId}).populate('device');//.populate('device.model').populate('device.brand').populate('device.device_type');
}

/**
 * Deletes a retrieval object from the database.
 * This is a soft delete, meaning that the user's data is removed from the retrieval object, but the object itself is kept in the database.
 * This is to ensure that we can still track the history of the retrieval and the device, as well as the transaction that took place.
 *
 * @param retrievalId - The ID of the retrieval object to delete.
 * @returns {Promise<void>} - A promise that resolves when the retrieval object has been deleted.
 * @author Benjamin Lister
 */
const deleteRetrieval = async (retrievalId) => {
    //When deleting a retrieval, it is more of a soft delete. In this case, this means that we will remove the data from the retrieval object but keep the rest of the object in place
    //This is to ensure that we can still track the history of the retrieval and the device, as well as the transaction that took place

    //Get the retrieval object
    const retrieval = await getRetrieval(retrievalId);

    //Clear the data array
    retrieval.data = [];

    //Update the state to DATA_DELETED
    retrieval.retrieval_state = retrievalState.DATA_DELETED;
    retrieval.locked = true;

    //Save the retrieval object
    return retrieval.save();
}

/**
 * Returns a count of devices grouped by device category
 * @returns {Promise<Aggregate<Array<any>>>}
 * @author Benjamin Lister
 */
const getDevicesGroupByCategory = async () => {
    return Device.aggregate([
        {
            $group: {
                _id: "$category",
                total: {$sum: 1}
            }
        }
    ]);
}

/**
 * Returns a count of devices grouped by device state
 * @returns {Promise<Aggregate<Array<any>>>}
 * @author Benjamin Lister
 */
const getDevicesGroupByState = async () => {
    return Device.aggregate([
        {
            $group: {
                _id: "$state",
                total: {$sum: 1}
            }
        }
    ]);
}



/**
 * Returns a count of devices grouped by device type
 * Includes the device type name and the total count of devices of that type
 * @returns {Promise<Aggregate<Array<any>>>}
 * @author Benjamin Lister
 */
const getDevicesGroupByType = async () => {
    //This aggregation effectively mimics a join statement from SQL
    return Device.aggregate([
        {
            //Mongoose Aggregation doesn't support autopopulating, so we have to manually lookup the device type
            $lookup: {
                from: "devicetypes",
                localField: "device_type",
                foreignField: "_id",
                as: "device_type"
            },
        },
        {
            //Unwind the device type array so we can group by the device type name
            $unwind: "$device_type"
        },
        {
            //Group by the device type _id but also include the device type name and count of devices of that type
            $group: {
                _id: "$device_type",
                name: {$first: "$device_type.name"},
                total: {$sum: 1}
            }
        }
    ]);
}

const getTotalAccountsCount = async () => {
    //Return the total number of accounts in the database
    return User.countDocuments();
}

const getAccountsCountByStatus = async () => {
    return User.aggregate([
        {
            $group: {
                _id: "$active",
                count: {$sum: 1}
            }
        },
        {$sort: {"_id": -1}},
    ])
}

const getAccountsCountByType = async () => {
    return User.aggregate([
        {
            $group: {
                _id: "$role",
                count: {$sum: 1}
            }
        },
        {$sort: {"_id": 1}},
    ])
}

/*
 * Sales Calculation
 * Sales are defined in this context as the total value of all transactions using our paymeny gateways
 * This information is found within the transaction object inside the retrieval object
 * These calculations also need to factor in money spent for retrieval extensions too
 */

/**
 * Calculates and returns the number of sales made in the last numPrevMonths months.
 * @param numPrevMonths {number} - The number of months to go back in time
 * @returns {Promise<Aggregate<Array<any>>>}
 */
const getSalesCountByMonth = async (numPrevMonths) => {
    const date = new Date();
    date.setMonth(date.getMonth() - numPrevMonths);

    return Retrieval.aggregate([
        {
            $facet: {
                initial_sales: [
                    {
                        $match: {
                            "transaction.transaction_state": 1,
                            "transaction.value": {$gt: 0},
                            "transaction.payment_date": {$gt: date}
                        }
                    },
                    {
                        $group: {
                            _id: { month: { $month: "$transaction.payment_date" }, year: { $year: "$transaction.payment_date" } },
                            count: { $sum: 1 }
                        }
                    }
                ],
                extension_sales: [
                    {
                        $match: {
                            "extension_transaction.transaction_state": 1,
                            "extension_transaction.value": {$gt: 0},
                            "extension_transaction.payment_date": {$gt: date}
                        }
                    },
                    {
                        $group: {
                            _id: { month: { $month: "$extension_transaction.payment_date" }, year: { $year: "$extension_transaction.payment_date" } },
                            count: { $sum: 1 }
                        }
                    }
                ]
            }
        },
        {
            $project: {
                all_sales: {
                    $concatArrays: ["$initial_sales", "$extension_sales"]
                }
            }
        },
        { $unwind: "$all_sales" },
        { $replaceRoot: { newRoot: "$all_sales" } },
        {
            $group: {
                _id: { month: "$_id.month", year: "$_id.year" },
                total: { $sum: "$count" }
            }
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);
}

/**
 * Calculates and returns the total value of sales made in the last numPrevMonths months.
 * This function returns two arrays, one for initial payments and one for extension payments
 * @param numPrevMonths {number} - The number of months to go back in time
 * @returns {Promise<[Array<any>, Array<any>]>} - An array of two arrays, one for initial payments and one for extension payments
 */
const getSalesValueByMonth = async (numPrevMonths) => {
    const date = new Date();
    date.setMonth(date.getMonth() - numPrevMonths);

    return Retrieval.aggregate([
        {
            $facet: {
                initial_sales: [
                    {
                        $match: {
                            "transaction.transaction_state": 1,
                            "transaction.value": {$gt: 0},
                            "transaction.payment_date": {$gt: date}
                        }
                    },
                    {
                        $group: {
                            _id: { month: { $month: "$transaction.payment_date" }, year: { $year: "$transaction.payment_date" } },
                            value: { $sum: "$transaction.value" }
                        }
                    }
                ],
                extension_sales: [
                    {
                        $match: {
                            "extension_transaction.transaction_state": 1,
                            "extension_transaction.value": {$gt: 0},
                            "extension_transaction.payment_date": {$gt: date}
                        }
                    },
                    {
                        $group: {
                            _id: { month: { $month: "$extension_transaction.payment_date" }, year: { $year: "$extension_transaction.payment_date" } },
                            value: { $sum: "$extension_transaction.value" }
                        }
                    }
                ]
            }
        },
        {
            $project: {
                all_sales: {
                    $concatArrays: ["$initial_sales", "$extension_sales"]
                }
            }
        },
        { $unwind: "$all_sales" },
        { $replaceRoot: { newRoot: "$all_sales" } },
        {
            $group: {
                _id: { month: "$_id.month", year: "$_id.year" },
                value: { $sum: "$value" }
            }
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);
}

const getAllSalesOrderedByDate = async (numPrevMonths) => {
    const date = new Date();
    date.setMonth(date.getMonth() - numPrevMonths);

    //This aggregation performs a facet operation to make two passes, one for initial sales and one for extension sales
    //These are then combined together and sorted by date
    //This is necessary as one parent object can potentially show up twice in the results, if a user pays for retrieval and then an extension
    return Retrieval.aggregate([
        {
            $facet: {
                initial_sales: [
                    {
                        $match: {
                            "transaction.transaction_state": 1,
                            "transaction.value": {$gt: 0},
                            "transaction.payment_date": {$gt: date}
                        }
                    },
                    {
                        $project: {
                            _id: 1,
                            device: 1,
                            value: "$transaction.value",
                            date: "$transaction.payment_date",
                            purchase_type: { $literal: 0 }
                        }
                    }
                ],
                extension_sales: [
                    {
                        $match: {
                            "extension_transaction.transaction_state": 1,
                            "extension_transaction.value": {$gt: 0},
                            "extension_transaction.payment_date": {$gt: date}
                        }
                    },
                    {
                        $project: {
                            _id: 1,
                            device: 1,
                            value: "$extension_transaction.value",
                            date: "$extension_transaction.payment_date",
                            purchase_type: { $literal: 1 }
                        }
                    }
                ]
            }
        },
        {
            $project: {
                all_sales: {
                    $concatArrays: ["$initial_sales", "$extension_sales"]
                }
            }
        },
        { $unwind: "$all_sales" },
        { $replaceRoot: { newRoot: "$all_sales" } },
        { $sort: { date: 1 } },
        {
            $lookup: {
                from: "devices",
                localField: "device",
                foreignField: "_id",
                as: "device"
            }
        },
        { $unwind: "$device" },
        {
            $lookup: {
                from: "brands",
                localField: "device.brand",
                foreignField: "_id",
                as: "device.brand"
            }
        },
        { $unwind: "$device.brand" },
        {
            $lookup: {
                from: "models",
                localField: "device.model",
                foreignField: "_id",
                as: "device.model"
            }
        },
        { $unwind: "$device.model" },
        {
            $lookup: {
                from: "users",
                localField: "device.listing_user",
                foreignField: "_id",
                as: "device.listing_user"
            }
        },
        { $unwind: "$device.listing_user" }
    ]);
}
/*
 * Referrals Calculation
 * Referrals are defined in this context as a converted quote
 * Referral value is our commission from the sale
 * Our commission is currently £2.50 + 10% of the sale value
 */

const getReferralCountByMonth = async (numPrevMonths) => {
    const date = new Date();
    date.setMonth(date.getMonth() - numPrevMonths);
    return Quote.aggregate([
        {
            $match: {
                state: quoteState.CONVERTED,
                "confirmation_details.receipt_date": {$gte: date}
            }
        },
        {
            $group: {
                _id: {
                    $month: "$confirmation_details.receipt_date"
                },
                month: {$first: {$month: "$confirmation_details.receipt_date"}},
                year: {$first: {$year: "$confirmation_details.receipt_date"}},
                total: {$sum: 1}
            }
        },
        {$sort: {"_id": 1}},
    ]);
}

const getReferralValueByMonth = async (numPrevMonths) => {
    const date = new Date();
    date.setMonth(date.getMonth() - numPrevMonths);
    return Quote.aggregate([
        {
            $match: {
                state: quoteState.CONVERTED,
                "confirmation_details.receipt_date": {$gte: date}
            }
        },
        {
            $group: {
                _id: {
                    month: {$month: "$confirmation_details.receipt_date"}
                },
                month: {$first: {$month: "$confirmation_details.receipt_date"}},
                year: {$first: {$year: "$confirmation_details.receipt_date"}},
                total: {$sum: 1},
                value: {$sum: {$add: [2.5, {$multiply: [0.1, "$confirmation_details.final_price"]}]}}
            }
        },
        {$sort: {"_id.year": 1, "_id.month": 1}},
    ]);
}

const getAllReferralsOrderedByDate = async (prevMonths) => {
    const date = new Date();
    date.setMonth(date.getMonth() - prevMonths);
    return Quote.find({
        state: quoteState.CONVERTED,
        "confirmation_details.receipt_date": {$gte: date}
    }).sort({"confirmation_details.receipt_date": 1});
}


async function getQuotesGroupByState() {
    return Quote.aggregate([
        {
            $group: {
                _id: '$state',
                total: {$sum:1}
            }
        }
    ])
}

async function getAllQuotes() {
    return Quote.find().populate('device').populate('provider')
}

/**
 * Method to add a new transaction
 * @author Vinroy Miltan Dsouza <vmdsouza1@sheffield.ac.uk>
 */
async function addTransaction(transactionDetails) {
    const retrieval = new Retrieval({
        device: transactionDetails.deviceId,
        expiry: getDate(),
        retrieval_state: retrievalState.AWAITING_DEVICE,
        transaction: {
            value: transactionDetails.value,
            transaction_state: transactionDetails.state
        }
    })
    return retrieval.save()
}


const DEFAULT_EXTENSION_LENGTH = 3
/**
 * Get method used to set the expiry date based on extension i.e. number of months(3 or 6)
 * @author Vinroy Miltan Dsouza <vmdsouza1@sheffield.ac.uk>
 */
function getDate(extension) {
    const currentDate = new Date()

    let currentMonth = currentDate.getMonth()
    let currentYear = currentDate.getFullYear();
    if (extension) {
        currentMonth += parseInt(extension);
    } else {
        currentMonth += DEFAULT_EXTENSION_LENGTH;
    }

    if (currentMonth > 11) {
        currentMonth -= 12;
        currentYear += 1;
    }

    //Include the current time
    return new Date(currentYear, currentMonth, currentDate.getDate(), currentDate.getHours(), currentDate.getMinutes(), currentDate.getSeconds());
}

/**
 * Method used to update the transaction based on the type of service i.e. retrieval or extension
 * @author Vinroy Miltan Dsouza <vmdsouza1@sheffield.ac.uk>
 */
async function updateTransaction(transactionDetails) {
        const filter = { _id: transactionDetails.id }
        let update
        if (transactionDetails.extension > 0) {
            let extension_details = {
                        value: transactionDetails.value,
                        transaction_state: transactionDetails.state,
                        payment_date: new Date(),
                        length: transactionDetails.extension,
                        payment_method: transactionDetails.paymentMethod
            };

            switch (transactionDetails.state) {
                case transactionState.PAYMENT_CANCELLED:
                    update = {
                        $set: {
                            extension_transaction: extension_details
                        }
                    }
                    break
                case transactionState.PAYMENT_RECEIVED:
                    const date = getDate(transactionDetails.extension)
                    update = {
                        $set: {
                            expiry: date,
                            extension_transaction: extension_details,
                            is_extended: true,
                        }
                    };
                    break
                case transactionState.AWAITING_PAYMENT:
                    update = {
                        $set: {
                            extension_transaction: extension_details
                        }
                    }
                    break
            }
        } else {
            update = {
                $set: {
                    transaction: {
                        value: transactionDetails.value,
                        transaction_state: transactionDetails.state,
                        payment_method: transactionDetails.paymentMethod,
                        payment_date: new Date()
                    },
                }
            };
        }
        return Retrieval.updateOne(filter, update);
}

/**
 * get method to retrieve the transaction details by device id
 * @author Vinroy Miltan Dsouza <vmdsouza1@sheffield.ac.uk>
 */
async function getTransactionByDevice(deviceId) {
    return Retrieval.findOne({device: deviceId});
}

/**
 * get method to retrieve the transaction details by transaction id
 * @author Vinroy Miltan Dsouza <vmdsouza1@sheffield.ac.uk>
 */
async function getTransactionById(id) {
    return Retrieval.findOne({_id: id});
}


module.exports = {
    getAllUsers,
    getUserById,
    searchUser,
    searchUserAndPopulate,
    createUser,
    updateUser,
    getUserItems,
    getItemDetail,
    getQuoteById,
    updateQuote,
    store,
    getAllDeviceType,
    getAllBrand,
    getModels,
    listDevice,
    getAllDevices,
    getAllUnknownDevices,
    addHistory,
    getReviewHistory,
    getHistoryByDevice,
    getAllRetrievalDevices,
    addDeviceType,
    addBrand,
    addModel,
    getDevice,
    getQuotes,
    deleteQuote,
    getProviders,
    addQuote,
    updateQuoteState,
    updateDevice,
    updateDeviceDetails,
    updateDeviceState,
    getUnknownDeviceHistoryByDevice,
    getCarouselDevices,
    getAllDeviceTypes,
    getAllBrands,
    getRetrievalObjectByDeviceId,
    getRetrieval,
    deleteRetrieval,
    getDevicesGroupByCategory,
    getDevicesGroupByState,
    getDevicesGroupByType,
    getAllModels,
    getDeviceTypeById,
    getBrandById,
    getModelById,
    updateDeviceTypeDetails,
    updateBrandDetails,
    updateModelDetails,
    getAllModelsOfType,
    deleteModel,
    deleteBrand,
    deleteType,
    getTotalAccountsCount,
    getAccountsCountByStatus,
    getSalesCountByMonth,
    getSalesValueByMonth,
    getAllSalesOrderedByDate,
    getAccountsCountByType,
    getReferralCountByMonth,
    getReferralValueByMonth,
    getAllReferralsOrderedByDate,
    addTransaction,
    updateTransaction,
    getTransactionByDevice,
    getTransactionById,
    getQuotesGroupByState,
    getAllQuotes,
    updateUnknownDevices
}