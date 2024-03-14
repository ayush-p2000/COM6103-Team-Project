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


async function getAllDeviceType(){
    return await DeviceType.find();

}

async function getAllBrand(){
    return await Brand.find();
}

async function getModels(brandId,deviceTypeId){
    return await Model.find({brand: new mongoose.Types.ObjectId(brandId),
        deviceType: new mongoose.Types.ObjectId(deviceTypeId)})
}

async function listDevice(deviceData, photos, user) {
    console.log(user)
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
}

const getAllDevices = async () => {
    return Device.find({});
}

async function getItemDetail(id) {
    return await Device.findOne({_id: id}).populate({
        path: 'device_type brand model',
        options: {strictPopulate: false}
    });
}
async function getAllDeviceTypes() {
    return await DeviceType.find();
}

async function getAllBrands() {
    return await Brand.find();
}

async function getAllModels() {
    return await Model.find();
}

async function getModel(name) {
    return await Model.findOne({name:name})
}

async function getBrand(name) {
    return await Brand.findOne({name: name});
}
async function getDeviceType(name) {
    return await DeviceType.findOne({name:name})
}

async function updateDeviceDetails(id, deviceDetails) {
    const device =
        {
            device_type: deviceDetails.device_type,
            brand: deviceDetails.brand,
            model: deviceDetails.model,
            details: [{
                name:'capacity',
                value:deviceDetails.capacity.toString()
            }],
            category: deviceDetails.category,
            good_condition: deviceDetails.good_condition,
            data_service: deviceDetails.data_service
        }
    const status = await Device.findByIdAndUpdate(id, device)
    if(status) {
        return "OK"
    } else {
        return "404"
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
    getAllDevices
    getAllDevices,
    getItemDetail,
    getAllDeviceTypes,
    getAllBrands,
    getAllModels,
    updateDeviceDetails,
    getBrand,
    getModel,
    getDeviceType,
    store
}