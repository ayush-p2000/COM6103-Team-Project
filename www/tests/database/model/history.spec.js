const {History} = require("../../../model/schema/history");
const expect = require('chai').expect;

const {faker,
    de
} = require('@faker-js/faker')
const historyType = require("../../../model/enum/historyType");

describe('Test History Model', () => {
    it('should pass with all fields present', (done) => {
        const deviceID = faker.database.mongodbObjectId();
        const actionedBy = faker.database.mongodbObjectId();
        const testHistory = new History({
            device: deviceID,
            history_type: historyType.ITEM_HIDDEN,
            data: [
                {
                    name: 'test',
                    value: 'test',
                    data_type: 1
                }
            ],
            actioned_by: actionedBy
        });

        const error = testHistory.validateSync();

        expect(error).to.not.exist;

        done();
    });

    it('should throw an error due to all fields missing', (done) => {
        const testHistory = new History();

        const error = testHistory.validateSync();

        expect(error.errors.device).to.exist;
        expect(error.errors.history_type).to.exist;
        expect(error.errors.actioned_by).to.exist;
        done();
    });

    it('should pass if data is an empty array', (done) => {
        const deviceID = faker.database.mongodbObjectId();
        const actionedBy = faker.database.mongodbObjectId();
        const testHistory = new History({
            device: deviceID,
            history_type: historyType.ITEM_HIDDEN,
            data: [],
            actioned_by: actionedBy
        });

        const error = testHistory.validateSync();

        expect(error).to.not.exist;

        expect(testHistory.device.toString()).to.equal(deviceID.toString());
        expect(testHistory.history_type).to.equal(historyType.ITEM_HIDDEN);
        expect(testHistory.data).to.eql([]);
        expect(testHistory.actioned_by.toString()).to.equal(actionedBy.toString());
        done();
    });

    it('should pass if data does not exist', (done) => {
        const deviceID = faker.database.mongodbObjectId();
        const actionedBy = faker.database.mongodbObjectId();
        const testHistory = new History({
            device: deviceID,
            history_type: historyType.ITEM_HIDDEN,
            actioned_by: actionedBy
        });

        const error = testHistory.validateSync();

        expect(error).to.not.exist;

        expect(testHistory.device.toString()).to.equal(deviceID.toString());
        expect(testHistory.history_type).to.equal(historyType.ITEM_HIDDEN);
        expect(testHistory.data).to.eql([]);
        expect(testHistory.actioned_by.toString()).to.equal(actionedBy.toString());
        done();
    });

    it('should fail if data is not an array', (done) => {
        const deviceID = faker.database.mongodbObjectId();
        const actionedBy = faker.database.mongodbObjectId();
        const testHistory = new History({
            device: deviceID,
            history_type: historyType.ITEM_HIDDEN,
            data: 'not an array',
            actioned_by: actionedBy
        });

        const error = testHistory.validateSync();

        expect(error.errors.data).to.exist;
        done();
    });

    it('should fail if device is missing', (done) => {
        const actionedBy = faker.database.mongodbObjectId();
        const testHistory = new History({
            history_type: historyType.ITEM_HIDDEN,
            data: [
                {
                    name: 'test',
                    value: 'test',
                    data_type: 1
                }
            ],
            actioned_by: actionedBy
        });

        const error = testHistory.validateSync();

        expect(error.errors.device).to.exist;
        done();
    });

    it('should fail if history_type is missing', (done) => {
        const deviceID = faker.database.mongodbObjectId();
        const actionedBy = faker.database.mongodbObjectId();
        const testHistory = new History({
            device: deviceID,
            data: [
                {
                    name: 'test',
                    value: 'test',
                    data_type: 1
                }
            ],
            actioned_by: actionedBy
        });

        const error = testHistory.validateSync();

        expect(error.errors.history_type).to.exist;
        done();
    });

    it('should fail if actioned_by is missing', (done) => {
        const deviceID = faker.database.mongodbObjectId();
        const testHistory = new History({
            device: deviceID,
            history_type: historyType.ITEM_HIDDEN,
            data: [
                {
                    name: 'test',
                    value: 'test',
                    data_type: 1
                }
            ]
        });

        const error = testHistory.validateSync();

        expect(error.errors.actioned_by).to.exist;
        done();
    });

    it('should fail if history_type is not a number', (done) => {
        const deviceID = faker.database.mongodbObjectId();
        const actionedBy = faker.database.mongodbObjectId();
        const testHistory = new History({
            device: deviceID,
            history_type: 'not a number',
            data: [
                {
                    name: 'test',
                    value: 'test',
                    data_type: 1
                }
            ],
            actioned_by: actionedBy
        });

        const error = testHistory.validateSync();

        expect(error.errors.history_type).to.exist;
        done();
    });

    it('should fail if data_type is not a number', (done) => {
        const deviceID = faker.database.mongodbObjectId();
        const actionedBy = faker.database.mongodbObjectId();
        const testHistory = new History({
            device: deviceID,
            history_type: historyType.ITEM_HIDDEN,
            data: [
                {
                    name: 'test',
                    value: 'test',
                    data_type: 'not a number'
                }
            ],
            actioned_by: actionedBy
        });

        const error = testHistory.validateSync();

        expect(error.errors['data.0.data_type']).to.exist;
        done();
    });

    it('should fail if device is not an objectID', (done) => {
        const actionedBy = faker.database.mongodbObjectId();
        const testHistory = new History({
            device: 'not an objectID',
            history_type: historyType.ITEM_HIDDEN,
            data: [
                {
                    name: 'test',
                    value: 'test',
                    data_type: 1
                }
            ],
            actioned_by: actionedBy
        });

        const error = testHistory.validateSync();

        expect(error.errors.device).to.exist;
        done();
    });

    it('should fail if actioned_by is not an objectID', (done) => {
        const deviceID = faker.database.mongodbObjectId();
        const testHistory = new History({
            device: deviceID,
            history_type: historyType.ITEM_HIDDEN,
            data: [
                {
                    name: 'test',
                    value: 'test',
                    data_type: 1
                }
            ],
            actioned_by: 'not an objectID'
        });

        const error = testHistory.validateSync();

        expect(error.errors.actioned_by).to.exist;
        done();
    });
});