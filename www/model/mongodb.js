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
 * @author Vinroy Miltan Dsouza
 */
async function getUserItems(id) {
    return Device.find({'listing_user': id}).populate({
        path: 'device_type brand model',
        options: {strictPopulate: false}
    });
}

/**
 * Get method to retrieve a specific device details of the User from the database
 * @author Vinroy Miltan Dsouza
 */
async function getItemDetail(id) {
    return await Device.findOne({_id: id}).populate({
        path: 'device_type brand model',
        options: {strictPopulate: false}
    });
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
 * Adding a Device to the Database
 * If User Input Custom Model,Create a History Link To The Device
 * @author Zhicong Jiang <zjiang34@sheffield.ac.uk>
 */
const listDevice = async (deviceData, photos, user) => {
    const newDevice = new Device({
        device_type: mongoose.Types.ObjectId.isValid(deviceData.device_type)? deviceData.device_type : new mongoose.Types.ObjectId(),
        brand: mongoose.Types.ObjectId.isValid(deviceData.brand)? deviceData.brand : new mongoose.Types.ObjectId(),
        model: mongoose.Types.ObjectId.isValid(deviceData.model)? deviceData.model : new mongoose.Types.ObjectId(),
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

    if (!mongoose.Types.ObjectId.isValid(deviceData.model)){
        const data = [
            { name: 'device_type', value: deviceData.device_type, data_type: 0 },
            { name: 'brand', value: deviceData.brand, data_type: 0 },
            { name: 'model', value: deviceData.model, data_type: 0 }
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
}

/**
 * Get History Data for UnknownDevice(history_type: 6)
 * @author Zhicong Jiang <zjiang34@sheffield.ac.uk>
 */
const getAllUnknownDevices = async () => {
    return History.find({history_type: 6});
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
const addModel = async (modelData,properties,category) => {
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


const getAllDevices = async () => {
    return Device.find({});
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
    getAllUnknownDevices,
    addDeviceType,
    addBrand,
    addModel,
    getDevice,
    updateDevice

}