const {Retrieval} = require('../../../model/schema/retrieval');
const expect = require('chai').expect;

const {faker} = require('@faker-js/faker')
const {generateFakeFile} = require("../../mocks/retrieval");
const retrievalState = require("../../../model/enum/retrievalState");
const transactionState = require("../../../model/enum/transactionState");

describe('Test Retrieval Model', () => {
    it('should pass with all fields present', (done) => {
        const file = generateFakeFile()
        //Remove the _id field from the file object
        delete file._id;

        const deviceID = faker.database.mongodbObjectId();
        const retrieval_state = faker.helpers.arrayElement(retrievalState.getList());
        const expiry = faker.date.future();
        const transaction = {
            value: faker.number.int({
                min: 0,
                max: 500
            }),
            transaction_state: faker.helpers.arrayElement(transactionState.getList()),
            payment_date: faker.date.recent(),
            payment_method: faker.helpers.arrayElement([0, 1, 2])
        }
        const extension_transaction = {
            value: faker.number.int({
                min: 0,
                max: 500
            }),
            transaction_state: faker.helpers.arrayElement(transactionState.getList()),
            payment_date: faker.date.recent(),
            payment_method: faker.helpers.arrayElement([0, 1, 2]),
            length: faker.number.int({
                min: 1,
                max: 10
            })
        }

        const testRetrieval = new Retrieval({
            device: deviceID,
            data: [file],
            retrieval_state: retrieval_state,
            expiry: expiry,
            transaction: transaction,
            extension_transaction: extension_transaction,
            is_extended: true,
            locked: false,
            emails_sent: {
                near_expiry: true,
                expired: false
            }
        });

        const error = testRetrieval.validateSync();

        expect(error).to.not.exist;

        expect(testRetrieval.device.toString()).to.equal(deviceID.toString());
        //Check each field in the file object to ensure they are the same
        testRetrieval.data.forEach((f, index) => {
            expect(f.name).to.equal(file.name);
            expect(f.size).to.equal(file.size);
            expect(f.type).to.equal(file.type);
            expect(f.data_type).to.equal(file.data_type);
        });
        expect(testRetrieval.retrieval_state).to.equal(retrieval_state);
        expect(testRetrieval.expiry).to.eql(expiry);

        expect(testRetrieval.transaction.value).to.equal(transaction.value);
        expect(testRetrieval.transaction.transaction_state).to.equal(transaction.transaction_state);
        expect(testRetrieval.transaction.payment_date).to.eql(transaction.payment_date);
        expect(testRetrieval.transaction.payment_method).to.equal(transaction.payment_method);

        expect(testRetrieval.extension_transaction.value).to.equal(extension_transaction.value);
        expect(testRetrieval.extension_transaction.transaction_state).to.equal(extension_transaction.transaction_state);
        expect(testRetrieval.extension_transaction.payment_date).to.eql(extension_transaction.payment_date);
        expect(testRetrieval.extension_transaction.payment_method).to.equal(extension_transaction.payment_method);
        expect(testRetrieval.extension_transaction.length).to.equal(extension_transaction.length);

        expect(testRetrieval.is_extended).to.equal(true);
        expect(testRetrieval.locked).to.equal(false);

        expect(testRetrieval.emails_sent.near_expiry).to.equal(true);
        expect(testRetrieval.emails_sent.expired).to.equal(false);

        done();
    });

    it('should fail if all fields are missing', (done) => {
        const testRetrieval = new Retrieval();

        const error = testRetrieval.validateSync();

        expect(error.errors['device']).to.exist;
        expect(error.errors['expiry']).to.exist;
        done();
    });

    it('should fail if device is missing', (done) => {
        const retrieval_state = faker.helpers.arrayElement(retrievalState.getList());
        const expiry = faker.date.future();
        const transaction = {
            value: faker.number.int({
                min: 0,
                max: 500
            }),
            transaction_state: faker.helpers.arrayElement(transactionState.getList()),
            payment_date: faker.date.recent(),
            payment_method: faker.helpers.arrayElement([0, 1, 2])
        }
        const extension_transaction = {
            value: faker.number.int({
                min: 0,
                max: 500
            }),
            transaction_state: faker.helpers.arrayElement(transactionState.getList()),
            payment_date: faker.date.recent(),
            payment_method: faker.helpers.arrayElement([0, 1, 2]),
            length: faker.number.int({
                min: 1,
                max: 10
            })
        }

        const testRetrieval = new Retrieval({
            data: [],
            retrieval_state: retrieval_state,
            expiry: expiry,
            transaction: transaction,
            extension_transaction: extension_transaction,
            is_extended: true,
            locked: false,
            emails_sent: {
                near_expiry: true,
                expired: false
            }
        });

        const error = testRetrieval.validateSync();

        expect(error.errors['device']).to.exist;
        done();
    });

    it('should fail if data is not an array', (done) => {
        const deviceID = faker.database.mongodbObjectId();
        const retrieval_state = faker.helpers.arrayElement(retrievalState.getList());
        const expiry = faker.date.future();
        const transaction = {
            value: faker.number.int({
                min: 0,
                max: 500
            }),
            transaction_state: faker.helpers.arrayElement(transactionState.getList()),
            payment_date: faker.date.recent(),
            payment_method: faker.helpers.arrayElement([0, 1, 2])
        }
        const extension_transaction = {
            value: faker.number.int({
                min: 0,
                max: 500
            }),
            transaction_state: faker.helpers.arrayElement(transactionState.getList()),
            payment_date: faker.date.recent(),
            payment_method: faker.helpers.arrayElement([0, 1, 2]),
            length: faker.number.int({
                min: 1,
                max: 10
            })
        }

        const testRetrieval = new Retrieval({
            device: deviceID,
            data: 'not an array',
            retrieval_state: retrieval_state,
            expiry: expiry,
            transaction: transaction,
            extension_transaction: extension_transaction,
            is_extended: true,
            locked: false,
            emails_sent: {
                near_expiry: true,
                expired: false
            }
        });

        const error = testRetrieval.validateSync();

        expect(error.errors['data']).to.exist;
        done();
    });

    it('should pass if data is an empty array', (done) => {
        const deviceID = faker.database.mongodbObjectId();
        const retrieval_state = faker.helpers.arrayElement(retrievalState.getList());
        const expiry = faker.date.future();
        const transaction = {
            value: faker.number.int({
                min: 0,
                max: 500
            }),
            transaction_state: faker.helpers.arrayElement(transactionState.getList()),
            payment_date: faker.date.recent(),
            payment_method: faker.helpers.arrayElement([0, 1, 2])
        }
        const extension_transaction = {
            value: faker.number.int({
                min: 0,
                max: 500
            }),
            transaction_state: faker.helpers.arrayElement(transactionState.getList()),
            payment_date: faker.date.recent(),
            payment_method: faker.helpers.arrayElement([0, 1, 2]),
            length: faker.number.int({
                min: 1,
                max: 10
            })
        }

        const testRetrieval = new Retrieval({
            device: deviceID,
            data: [],
            retrieval_state: retrieval_state,
            expiry: expiry,
            transaction: transaction,
            extension_transaction: extension_transaction,
            is_extended: true,
            locked: false,
            emails_sent: {
                near_expiry: true,
                expired: false
            }
        });

        const error = testRetrieval.validateSync();

        expect(error).to.not.exist;
        done();
    });

    it('should fail if retrieval_state is not a number', (done) => {
        const deviceID = faker.database.mongodbObjectId();
        const retrieval_state = 'not a number';
        const expiry = faker.date.future();
        const transaction = {
            value: faker.number.int({
                min: 0,
                max: 500
            }),
            transaction_state: faker.helpers.arrayElement(transactionState.getList()),
            payment_date: faker.date.recent(),
            payment_method: faker.helpers.arrayElement([0, 1, 2])
        }
        const extension_transaction = {
            value: faker.number.int({
                min: 0,
                max: 500
            }),
            transaction_state: faker.helpers.arrayElement(transactionState.getList()),
            payment_date: faker.date.recent(),
            payment_method: faker.helpers.arrayElement([0, 1, 2]),
            length: faker.number.int({
                min: 1,
                max: 10
            })
        }

        const testRetrieval = new Retrieval({
            device: deviceID,
            data: [],
            retrieval_state: retrieval_state,
            expiry: expiry,
            transaction: transaction,
            extension_transaction: extension_transaction,
            is_extended: true,
            locked: false,
            emails_sent: {
                near_expiry: true,
                expired: false
            }
        });

        const error = testRetrieval.validateSync();

        expect(error.errors['retrieval_state']).to.exist;
        done();
    });

    it('should fail if expiry is not a date', (done) => {
        const deviceID = faker.database.mongodbObjectId();
        const retrieval_state = faker.helpers.arrayElement(retrievalState.getList());
        const expiry = 'not a date';
        const transaction = {
            value: faker.number.int({
                min: 0,
                max: 500
            }),
            transaction_state: faker.helpers.arrayElement(transactionState.getList()),
            payment_date: faker.date.recent(),
            payment_method: faker.helpers.arrayElement([0, 1, 2])
        }
        const extension_transaction = {
            value: faker.number.int({
                min: 0,
                max: 500
            }),
            transaction_state: faker.helpers.arrayElement(transactionState.getList()),
            payment_date: faker.date.recent(),
            payment_method: faker.helpers.arrayElement([0, 1, 2]),
            length: faker.number.int({
                min: 1,
                max: 10
            })
        }

        const testRetrieval = new Retrieval({
            device: deviceID,
            data: [],
            retrieval_state: retrieval_state,
            expiry: expiry,
            transaction: transaction,
            extension_transaction: extension_transaction,
            is_extended: true,
            locked: false,
            emails_sent: {
                near_expiry: true,
                expired: false
            }
        });

        const error = testRetrieval.validateSync();

        expect(error.errors['expiry']).to.exist;
        done();
    });

    it('should fail if is_extended is not a boolean', (done) => {
        const deviceID = faker.database.mongodbObjectId();
        const retrieval_state = faker.helpers.arrayElement(retrievalState.getList());
        const expiry = faker.date.future();
        const transaction = {
            value: faker.number.int({
                min: 0,
                max: 500
            }),
            transaction_state: faker.helpers.arrayElement(transactionState.getList()),
            payment_date: faker.date.recent(),
            payment_method: faker.helpers.arrayElement([0, 1, 2])
        }
        const extension_transaction = {
            value: faker.number.int({
                min: 0,
                max: 500
            }),
            transaction_state: faker.helpers.arrayElement(transactionState.getList()),
            payment_date: faker.date.recent(),
            payment_method: faker.helpers.arrayElement([0, 1, 2]),
            length: faker.number.int({
                min: 1,
                max: 10
            })
        }

        const testRetrieval = new Retrieval({
            device: deviceID,
            data: [],
            retrieval_state: retrieval_state,
            expiry: expiry,
            transaction: transaction,
            extension_transaction: extension_transaction,
            is_extended: 'not a boolean',
            locked: false,
            emails_sent: {
                near_expiry: true,
                expired: false
            }
        });

        const error = testRetrieval.validateSync();

        expect(error.errors['is_extended']).to.exist;
        done();
    });

    it('should fail if locked is not a boolean', (done) => {
        const deviceID = faker.database.mongodbObjectId();
        const retrieval_state = faker.helpers.arrayElement(retrievalState.getList());
        const expiry = faker.date.future();
        const transaction = {
            value: faker.number.int({
                min: 0,
                max: 500
            }),
            transaction_state: faker.helpers.arrayElement(transactionState.getList()),
            payment_date: faker.date.recent(),
            payment_method: faker.helpers.arrayElement([0, 1, 2])
        }
        const extension_transaction = {
            value: faker.number.int({
                min: 0,
                max: 500
            }),
            transaction_state: faker.helpers.arrayElement(transactionState.getList()),
            payment_date: faker.date.recent(),
            payment_method: faker.helpers.arrayElement([0, 1, 2]),
            length: faker.number.int({
                min: 1,
                max: 10
            })
        }

        const testRetrieval = new Retrieval({
            device: deviceID,
            data: [],
            retrieval_state: retrieval_state,
            expiry: expiry,
            transaction: transaction,
            extension_transaction: extension_transaction,
            is_extended: true,
            locked: 'not a boolean',
            emails_sent: {
                near_expiry: true,
                expired: false
            }
        });

        const error = testRetrieval.validateSync();

        expect(error.errors['locked']).to.exist;
        done();
    });

});