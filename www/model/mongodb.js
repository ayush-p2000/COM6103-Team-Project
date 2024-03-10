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
    return await User.find();
}

async function getUserById(id) {
    return await User.findOne({_id: id});
}

async function searchUser(filter) {
    return await User.findOne(filter);
}

async function searchUserAndPopulate(filter) {
    return await User.find(filter).populate('listed_devices');
}

async function createUser(user) {
    return await User.create(user);
}

async function updateUser(id, user) {
    return await User.updateOne({_id: id}, user);
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

async function listDevice(deviceData) {
    const newDevice = new Device({
        device_type: deviceData.device_type,
        brand: deviceData.brand,
        model: deviceData.model,
        details: deviceData.details,
        category: deviceData.category,
        good_condition: deviceData.good_condition,
        state: deviceData.state,
        data_service: deviceData.data_service,
        additional_details: deviceData.additional_details,
        listing_user: deviceData.listing_user,
        photos: deviceData.photos,
        visible: deviceData.visible
    });
    const savedDevice = await newDevice.save();
    return savedDevice._id;
}

module.exports = {
    getAllUsers,
    getUserById,
    searchUser,
    searchUserAndPopulate,
    createUser,
    updateUser,
    store,
    getAllDeviceType,
    getAllBrand,
    getModels,
    listDevice
}