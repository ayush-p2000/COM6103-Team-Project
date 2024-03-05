/* Imports */
const mongoose = require('mongoose');
const regexEscape = require('regex-escape');

/* Schemas */
const {userSchema} = require("./schema/user");
const {deviceSchema} = require("./schema/device");
const {deviceTypeSchema} = require("./schema/deviceType");
const {brandSchema} = require("./schema/brand");
const {modelSchema} = require("./schema/model");
const {providerSchema} = require("./schema/provider");
const {quoteSchema} = require("./schema/quote");
const {transactionSchema} = require("./schema/transaction");
const {retrievalSchema} = require("./schema/retrieval");


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

mongoose.connect(connectionString, {useNewUrlParser: true});

const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => {
    console.log(`Connected to ${MONGO_CONNNAME}`);
    connected = true;
});

/* Models */
const modelModel = mongoose.model('Model', modelSchema);
const brandModel = mongoose.model('Brand', brandSchema);
const deviceTypeModel = mongoose.model('DeviceType', deviceTypeSchema);
const userModel = mongoose.model('User', userSchema);
const deviceModel = mongoose.model('Device', deviceSchema);
const providerModel = mongoose.model('Provider', providerSchema);
const quoteModel = mongoose.model('Quote', quoteSchema);
const retrievalModel = mongoose.model('Retrieval', retrievalSchema);
const transactionModel = mongoose.model('Transaction', transactionSchema);
