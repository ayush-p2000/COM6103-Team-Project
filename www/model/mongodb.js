/* Imports */
const mongoose = require('mongoose');
const regexEscape = require('regex-escape');
const MongoStore = require('connect-mongo')

/* Schemas */
const {userSchema} = require("./schema/user");
const {deviceSchema} = require("./schema/device");
const {deviceTypeSchema} = require("./schema/deviceType");
const {brandSchema} = require("./schema/brand");
const {modelSchema} = require("./schema/model");
const {providerSchema} = require("./schema/provider");
const {quoteSchema} = require("./schema/quote");
const {retrievalSchema} = require("./schema/retrieval");
const {historySchema} = require("./schema/history");


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
    store = new MongoStore.create({
        client: db,
        dbName: "test",
        collection: 'sessions',
        expires: 1000 * 60 * 60 * 48,
        crypto: {
            secret: process.env.STORE_SECRET || "secret",
        }
    });
}

/* Models */
const modelModel = mongoose.model('Model', modelSchema);
const brandModel = mongoose.model('Brand', brandSchema);
const deviceTypeModel = mongoose.model('DeviceType', deviceTypeSchema);
const userModel = mongoose.model('User', userSchema);
const deviceModel = mongoose.model('Device', deviceSchema);
const providerModel = mongoose.model('Provider', providerSchema);
const quoteModel = mongoose.model('Quote', quoteSchema);
const retrievalModel = mongoose.model('Retrieval', retrievalSchema);
const historyModel = mongoose.model('History', historySchema);

/* Functions */
async function getAllUsers() {
    return await userModel.find();
}

async function getUserById(id) {
    return await userModel.findOne({_id: id});
}

async function searchUser(filter) {
    return await userModel.findOne(filter);
}

async function searchUserAndPopulate(filter) {
    return await userModel.find(filter).populate('listed_devices');
}

async function createUser(user) {
    return await userModel.create(user);
}

async function updateUser(id, user) {
    return await userModel.updateOne({_id: id}, user);
}

module.exports = {
    getAllUsers,
    getUserById,
    searchUser,
    searchUserAndPopulate,
    createUser,
    updateUser,
    store
}