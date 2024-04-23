/* Imports */
const mongoose = require('mongoose');

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
let store;

const connectToDB = async () => {
    await mongoose.connect(connectionString)

    const db = mongoose.connection;
    db.on('error', (error) => console.error(error));
    db.once('open', async () => {
        console.log(`Connected to ${MONGO_CONNNAME}`);
        connected = true;
    });
}

if (process.env.ENVIRONMENT !== 'test') {
    connectToDB();
}


module.exports = {
    User,
    Device,
    DeviceType,
    Brand,
    Model,
    Provider,
    Quote,
    Retrieval,
    History,
    connected,
    store
}