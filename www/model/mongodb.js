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

mongoose.connect(connectionString);

const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', async () => {
    console.log(`Connected to ${MONGO_CONNNAME}`);
    connected = true;
});

/* Session Storage */
let store;
if(connected){
    // Use Session schema from connect-mongo which aligns with express-session setup.
    store = new MongoStore.create({
        client: db,
        dbName: process.env.MONGO_DBNAME,
        collection: 'sessions',
        expires: 1000 * 60 * 60 * 48,
        crypto: {
            secret: process.env.STORE_SECRET || "secret",
        }
    });
}
/* Functions */
async function getAllUsers() {
    return User.find();
}

async function getUserById(id) {
    return await User.findOne({_id: id});
}

async function searchUser(filter) {
    return await User.findOne(filter);
}

async function searchUserAndPopulate(filter) {
    return User.find(filter).populate('listed_devices').populate('listed_devices.model').populate('listed_devices.brand').populate('listed_devices.device_type');
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
async function getQuote(id) {
    try {
        return await Quote.find({device: id}).populate('provider')
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
async function addQuote(quoteDetails){
    try {
        const quote = new Quote({
            device: quoteDetails.device,
            provider: quoteDetails.provider,
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

async function updateQuoteState(id, state) {
    try {
        return await Quote.updateOne({device: id}, {state: state})
    } catch (err) {
        console.log(err)
    }
}

async function updateDeviceState(id, state) {
    try {
        return await Device.updateOne({device:id}, {state: state})
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
    }catch (error) {
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
    }catch (error) {
        console.error("An error occurred while get All Brand:", error);
        throw error;
    }
}


/**
 * Get a List of Models Base on Specific Brand and Type
 * @author Zhicong Jiang <zjiang34@sheffield.ac.uk>
 */
const getModels = async (brandId,deviceTypeId) => {
    try {
        return await Model.find({brand: new mongoose.Types.ObjectId(brandId),
            deviceType: new mongoose.Types.ObjectId(deviceTypeId)})
    }catch (error) {
        console.error("An error occurred while get Models:", error);
        throw error;
    }
}

/**
 * Add a New Device Base On the Device's Data
 * @author Zhicong Jiang <zjiang34@sheffield.ac.uk>
 */
const listDevice = async (deviceData, photos, user) => {
    try {
        const newDevice = new Device({
            device_type: deviceData.device_type,
            brand: deviceData.brand,
            model: deviceData.model,
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
        return savedDevice._id;
    } catch (error) {
        console.error("An error occurred while listing the device:", error);
        throw error;
    }
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
    }catch (error) {
        console.error("An error occurred while update Device:", error);
        throw error;
    }
}

/**
 * Getting Device's Detail by Device's id
 * @author Zhicong Jiang <zjiang34@sheffield.ac.uk>
 */
const getDevice = async (id) => {
    try {
        return Device.find({_id:id}).populate('brand').populate('device_type').populate('model');
    }catch (error) {
        console.error("An error occurred while get Device:", error);
        throw error;
    }
}

const getAllDevices = async () => {
    return Device.find({});
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
            model : deviceDetails.model,
            details : JSON.parse(deviceDetails.details),
            category : deviceDetails.category,
            good_condition : deviceDetails.good_condition,
            state : deviceDetails.state,
            additional_details : deviceDetails.additional_details,
            visible : deviceDetails.visible
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




module.exports = {
    getAllUsers,
    getUserById,
    searchUser,
    searchUserAndPopulate,
    createUser,
    updateUser,
    getUserItems,
    getItemDetail,
    store,
    getAllDeviceType,
    getAllBrand,
    getModels,
    listDevice,
    getAllDevices,
    getDevice,
    getQuote,
    getProviders,
    addQuote,
    updateQuoteState,
    updateDevice,
    updateDeviceDetails,
    updateDeviceState
}