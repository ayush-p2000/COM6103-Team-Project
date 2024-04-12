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
const transactionState = require('./enum/transactionState')

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
 * Update method to save the device state to the database
 * @author Vinroy Miltan Dsouza <vmdsouza1@sheffield.ac.uk>
 */
async function updateDeviceState(id, state) {
    try {
        return await Device.updateOne({device: id}, {state: state})
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
        return await DeviceType.find();
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
        return await Brand.find();
    } catch (error) {
        console.error("An error occurred while get All Brand:", error);
        throw error;
    }
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
                history_type: 6,
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
    return History.find({history_type: UNKNOWN_DEVICE});
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
 * Updating Specific Field for The Specific Device
 * @author Zhicong Jiang <zjiang34@sheffield.ac.uk>
 */
const updateDevice = async (id, deviceData, photos) => {
    try {
        const filter = {_id: id}
        const update = {
            $set: {
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
        return Device.find({_id: id}).populate('brand').populate('device_type').populate('model');
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
    const devices = await Device.find({category: {$ne: UNKNOWN}, state: HAS_QUOTE}).populate("model").select({model:1,photos:1, listing_user:0, brand:0, device_type:0}).limit(imgPerCarousel * 3)
    // devices = Array.from(devices)
    for (let i = 0; i < devices.length; i++) {
        const quotes = await getQuotes(devices[i]._id);
        devices[i] = {...devices[i]._doc, quote: quotes.length ? quotes[0]:null}
    }
    console.log(devices[0])
    return devices
}

/**
 * Get method to retrieve all the device types
 * @author Vinroy Miltan Dsouza <vmdsouza1@sheffield.ac.uk>
 */
async function getAllDeviceTypes() {
    return await DeviceType.find();
}

/**
 * Get method to retrieve all the brands
 * @author Vinroy Miltan Dsouza <vmdsouza1@sheffield.ac.uk>
 */
async function getAllBrands() {
    return await Brand.find();
}

/**
 * Update method to update the details of the device from the staff side to the mongodb database
 * @author Vinroy Miltan Dsouza <vmdsouza1@sheffield.ac.uk>
 */
async function updateDeviceDetails(id, deviceDetails) {
    try {
        console.log(deviceDetails);
        const filter = {_id: id}
        const device = {
            $set: {
                model: deviceDetails.model,
                details: JSON.parse(deviceDetails.details),
                category: deviceDetails.category,
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

const getAccountsCountByStatus = async () => {
    return User.aggregate([
        {
            $group: {
                _id: "$active",
                count: { $sum: 1}
            }
        },
        { $sort: { "_id": -1 } },
    ])
}

const getAccountsCountByType = async () => {
    return User.aggregate([
        {
            $group: {
                _id: "$role",
                count: { $sum: 1}
            }
        },
        { $sort: { "_id": 1 } },
    ])
}

async function addTransaction(transactionDetails) {
    try {
        const retrieval = new Retrieval({
            device: transactionDetails.deviceId,
            expiry: getDate(),
            transaction: {
                value: transactionDetails.value,
                transaction_state: transactionDetails.state
            }
        })
        return await retrieval.save()
    }catch (err) {
        console.log(err)
    }
}

function getDate(extension) {
    const currentDate = new Date()

    let currentMonth = currentDate.getMonth()
    let currentYear = currentDate.getFullYear();
    if (extension) {
        currentMonth += extension
    } else {
        currentMonth += 3;
    }

    if (currentMonth > 11) {
        currentMonth -= 12;
        currentYear += 1;
    }

    return new Date(currentYear, currentMonth, currentDate.getDate())
}

async function updateTransaction(transactionDetails) {

    try {
        const filter = { device: transactionDetails.deviceId }
        var update
        if (transactionDetails.extension) {
            if (transactionState.PAYMENT_CANCELLED === transactionState[transactionDetails.state]) {
                update = {
                    $set: {
                        extension_transaction: {
                            value: transactionDetails.value,
                            transaction_state: transactionDetails.state,
                            payment_date: new Date(),
                            length: transactionDetails.extension
                        },
                        payment_method: transactionDetails.paymentMethod
                    }
                };
            } else {
                const date = getDate(transactionDetails.extension)
                update = {
                    $set: {
                        expiry: date,
                        extension_transaction: {
                            value: transactionDetails.value,
                            transaction_state: transactionDetails.state,
                            payment_date: new Date(),
                            length: transactionDetails.extension
                        },
                        is_extended: true,
                        payment_method: transactionDetails.paymentMethod
                    }
                };
            }
        } else {
            update = {
                $set: {
                    transaction: {
                        value: transactionDetails.value,
                        transaction_state: transactionDetails.state
                    },
                    payment_method: transactionDetails.paymentMethod
                }
            };
        }
        console.log(filter)
        return await Retrieval.updateOne(filter, update);
    }catch (err) {
        console.log(err)
    }
}

async function getTransactionByDevice(deviceId) {
    try {
        return await Retrieval.findOne({device: deviceId})
    } catch (err) {
        console.log(err)
    }
}

async function getTransactionById(id) {
    try{
        return await Retrieval.findOne({_id: id})
    } catch (err) {
        console.log(err)
    }
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
    addDeviceType,
    addBrand,
    addModel,
    getDevice,
    getQuotes,
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
    getDevicesGroupByCategory,
    getDevicesGroupByState,
    getDevicesGroupByType,
    getAccountsCountByStatus,
    getAccountsCountByType,
    addTransaction,
    updateTransaction,
    getTransactionByDevice,
    getTransactionById
}