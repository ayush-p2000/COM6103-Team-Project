const sinon = require('sinon');
const { expect } = require('chai');
const sinonChai = require('sinon-chai');
const chai = require('chai');
chai.use(sinonChai);
const proxyquire = require('proxyquire');
const dotenv = require("dotenv");
const parse = require("dotenv-parse-variables");
const {mockRequest,
    mockResponse
} = require("mock-req-res");
const {generateFakeDevice} = require("../mocks/device");

let env = dotenv.config({path: __dirname + '/../../.env.test'})
if (env.error) {
    throw env.error
}
env = parse(env, {assignToProcessEnv: true, overrideProcessEnv: true})

let getItemDetail = sinon.stub();

let devicesMiddleware;

let req, res, next;
describe('Test Devices Middleware', () => {
    beforeEach(() => {
        req = mockRequest();
        res = mockResponse();

        req.session = {};

        next = sinon.spy();
    })
    describe('Test populateDeviceObject', () => {
        beforeEach(() => {
            getItemDetail = sinon.stub();

            devicesMiddleware = proxyquire('../../middlewares/devices', {
                '../model/mongodb': {
                    getItemDetail
                }
            });
        });

        it('should call next if the device is found and set the device in the request', async () => {
            // Arrange
            req.params = {
                id: '123'
            }

            const device = generateFakeDevice();
            getItemDetail.resolves(device);

            // Act
            await devicesMiddleware.populateDeviceObject(req, res, next);

            // Assert
            expect(getItemDetail).to.have.been.calledWith('123');
            expect(req.device).to.deep.equal(device);
            expect(next).to.have.been.called;
        });

        it('should return 404 if the device is not found', async () => {
            // Arrange
            req.params = {
                id: '123'
            }

            getItemDetail.resolves(null);

            // Act
            await devicesMiddleware.populateDeviceObject(req, res, next);

            // Assert
            expect(getItemDetail).to.have.been.calledWith('123');
            expect(res.status).to.have.been.calledWith(404);
            expect(res.send).to.have.been.calledWith('Item not found');
            expect(next).not.to.have.been.called;
        });

        it('should return 500 if there is an error', async () => {
            // Arrange
            req.params = {
                id: '123'
            }

            getItemDetail.rejects(new Error('Test error'));

            // Act
            await devicesMiddleware.populateDeviceObject(req, res, next);

            // Assert
            expect(getItemDetail).to.have.been.calledWith('123');
            expect(res.status).to.have.been.calledWith(500);
            expect(res.send).to.have.been.calledWith('Test error');
            expect(next).not.to.have.been.called;
        });

        it('should call next if the device is already set in the request', async () => {
            // Arrange
            req.device = generateFakeDevice();

            // Act
            await devicesMiddleware.populateDeviceObject(req, res, next);

            // Assert
            expect(getItemDetail).not.to.have.been.called;
            expect(next).to.have.been.called;
        });

        it('should call next if the device ID is not provided', async () => {
            // Arrange
            req.params = {};

            // Act
            await devicesMiddleware.populateDeviceObject(req, res, next);

            // Assert
            expect(getItemDetail).not.to.have.been.called;
            expect(next).to.have.been.called;
        });

        it('should call next if the device ID is null', async () => {
            // Arrange
            req.params = {
                id: null
            }

            // Act
            await devicesMiddleware.populateDeviceObject(req, res, next);

            // Assert
            expect(getItemDetail).not.to.have.been.called;
            expect(next).to.have.been.called;
        });

        it('should call next if the device ID is undefined', async () => {
            // Arrange
            req.params = {
                id: undefined
            }

            // Act
            await devicesMiddleware.populateDeviceObject(req, res, next);

            // Assert
            expect(getItemDetail).not.to.have.been.called;
            expect(next).to.have.been.called;
        });
    });
});