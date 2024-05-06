const {faker} = require('@faker-js/faker');
const {generateFakeDevice} = require("./device");
const dataTypes = require("../../model/enum/dataTypes");
const retrievalState = require("../../model/enum/retrievalState");
const transactionState = require("../../model/enum/transactionState");

const generateFakeFile = (data_type = faker.helpers.arrayElement([dataTypes.IMAGE, dataTypes.FILE, dataTypes.URL])) => {
    //Pick a random data type from dataTypes.getList

    const use_buffer = (data_type === dataTypes.IMAGE || data_type === dataTypes.FILE);
    const buffer = use_buffer ? Buffer.from(faker.image.dataUri().split(',')[1], 'base64') : null;
    //Value is either a url (if data_type is URL) or a mime type (if data_type is IMAGE or FILE)
    const value = use_buffer ? (data_type === dataTypes.IMAGE) ? "image/jpeg" : faker.system.mimeType() : faker.internet.url();

    return {
        _id : faker.database.mongodbObjectId(),
        name: faker.lorem.word(),
        value: value,
        buffer: buffer,
        use_buffer: use_buffer,
        data_type: data_type
    };

}

const generateFakeFiles = (n, types) => {
    let files = [];
    for (let i = 0; i < n; i++) {
        files.push(generateFakeFile((!types) ? null : types[i]));
    }

    return files;
}

const generateFakeRetrieval = (user = faker.database.mongodbObjectId(), retrieval_state = faker.helpers.arrayElement(retrievalState.getList())) => {
    const is_extension = faker.datatype.boolean();

    return {
        _id: faker.database.mongodbObjectId(),
        device: generateFakeDevice(user),
        data: generateFakeFiles(faker.number.int({ min: 1, max: 5 })),
        retrieval_state: retrieval_state,
        expiry: faker.date.future(),
        transaction: {
            value: faker.number.int({ min: 0, max: 500 }),
            transaction_state: faker.helpers.arrayElement(transactionState.getList()),
            payment_date: faker.date.recent(),
            payment_method: faker.helpers.arrayElement([0, 1, 2])
        },
        extension_transaction: is_extension ? {
            value: faker.number.int({ min: 0, max: 500 }),
            transaction_state: faker.helpers.arrayElement(transactionState.getList()),
            payment_date: faker.date.recent(),
            payment_method: faker.helpers.arrayElement([0, 1, 2])
        } : null,
        is_extended: is_extension,
        locked: faker.datatype.boolean(),
        emails_sent: {
            near_expiry: faker.datatype.boolean(),
            expired: faker.datatype.boolean()
        },
        createdAt: faker.date.recent(),
        updatedAt: faker.date.recent()
    };
}

const generateFakeRetrievals = (count, user = faker.database.mongodbObjectId()) => {
    const fakeRetrievals = [];
    for (let i = 0; i < count; i++) {
        fakeRetrievals.push(generateFakeRetrieval(user));
    }
    return fakeRetrievals;
}

module.exports = {
    generateFakeRetrieval,
    generateFakeRetrievals,
    generateFakeFile,
    generateFakeFiles
};