const {expect} = require("chai");
const proxyquire = require('proxyquire');

const sandbox = require('sinon').createSandbox();

const dotenv = require('dotenv')
const parse = require('dotenv-parse-variables')

const {mock_user} = require("../mocks/user");
const {mock_photo} = require("../mocks/photo");
const {generateFakeDevice} = require("../mocks/device");
const deviceCategory = require("../../model/enum/deviceCategory");
const deviceColors = require("../../model/enum/deviceColors");
const deviceCapacity = require("../../model/enum/deviceCapacity");
const {generateFakeDeviceTypes} = require("../mocks/deviceType");
const {generateFakeBrands} = require("../mocks/brand");
const {generateFakeModels} = require("../mocks/model");
const {generateFakeProviders, generateFakeEbayProvider, generateFakeCexProvider} = require("../mocks/provider");
const {generateFakeQuote} = require("../mocks/quote");
const deviceState = require("../../model/enum/deviceState");
const retrievalState = require("../../model/enum/retrievalState");
const historyType = require("../../model/enum/historyType");
const roleTypes = require("../../model/enum/roleTypes");
const quoteState = require("../../model/enum/quoteState")



let env = dotenv.config({path: __dirname + '/../../.env.test'})
if (env.error) {
    throw env.error
}
env = parse(env, {assignToProcessEnv: true, overrideProcessEnv: true})

const listDevice = sandbox.stub();
const updateUserListedItem = sandbox.stub();
const updateDevice = sandbox.stub();
const getAllDeviceType = sandbox.stub();
const getAllBrand = sandbox.stub();
const renderUserLayout = sandbox.stub();
const getDevice = sandbox.stub();
const getModels = sandbox.stub();
const getItemDetail = sandbox.stub();
const getQuotes = sandbox.stub();
const generateQR = sandbox.stub();
const getRetrievalObjectByDeviceId = sandbox.stub();
const handleMissingModel = sandbox.stub();
const getHistoryByDevice = sandbox.stub();

const itemController = proxyquire('../../controllers/marketplace/itemController',
    {
        '../../model/mongodb': {
            listDevice,
            updateUserListedItem,
            updateDevice,
            getAllDeviceType,
            getAllBrand,
            getDevice,
            getModels,
            getItemDetail,
            getQuotes,
            getRetrievalObjectByDeviceId,
            getHistoryByDevice
        },
        "../../util/layout/layoutUtils":{
            renderUserLayout
        },
        "../../util/Devices/devices":{
            handleMissingModel
        },
        "../../util/qr/qrcodeGenerator":{
            generateQR
        }
    });

describe('Test Landing Page', () => {
    afterEach(() => {
        sandbox.restore()
    });

    describe('post ListItem', () => {
        it('should create a new device if id is undefined', async () => {
            // Mock req and res objects
            const fakeDevice = generateFakeDevice(mock_user._id,1)

            const req = {
                params: { id: undefined },
                body: {
                    device_type: fakeDevice.device_type,
                    brand: fakeDevice.brand,
                    model: fakeDevice.model,
                    color: fakeDevice.color,
                    capacity: fakeDevice.capacity,
                    years_used: fakeDevice.years_used,
                    details: JSON.stringify(fakeDevice.details),
                    good_condition: fakeDevice.good_condition,
                    data_service: fakeDevice.data_service,
                    additional_details: fakeDevice.additional_details,
                    visible: false
                },
                user: mock_user,
                files: [mock_photo]
            };
            const res = {
                status: sandbox.stub().returnsThis(),
                send: sandbox.stub()
            };

            await itemController.postListItem(req, res);

            expect(res.status.calledWith(200)).to.be.true;
        });

        it('should update an existing device if id is provided', async () => {
            const fakeDevice = generateFakeDevice(mock_user._id,1)
            const fakeDeviceNew = generateFakeDevice(mock_user._id,1)
            const req = {
                params: { id: fakeDevice._id },
                body: {
                    color: fakeDeviceNew.color,
                    capacity: fakeDeviceNew.capacity,
                    years_used: fakeDeviceNew.years_used,
                    details: JSON.stringify(fakeDeviceNew.details),
                    good_condition: fakeDeviceNew.good_condition,
                    data_service: fakeDeviceNew.data_service,
                    additional_details: fakeDeviceNew.additional_details
                },
                user: mock_user,
                files: [mock_photo]
            };
            const res = {
                status: sandbox.stub().returnsThis(),
                send: sandbox.stub()
            };

            await itemController.postListItem(req, res);

            expect(res.status.calledWith(200)).to.be.true;
        });

        it('should not update with error throw ', async () => {
            const fakeDevice = generateFakeDevice(mock_user._id,1)
            const fakeDeviceNew = generateFakeDevice(mock_user._id,1)

            const req = {
                params: { id: fakeDevice._id },
                body: {
                    color: fakeDeviceNew.color,
                    capacity: fakeDeviceNew.capacity,
                    years_used: fakeDeviceNew.years_used,
                    details: JSON.stringify(fakeDeviceNew.details),
                    good_condition: fakeDeviceNew.good_condition,
                    data_service: fakeDeviceNew.data_service,
                    additional_details: fakeDeviceNew.additional_details
                },
                user: mock_user,
                files: [mock_photo]
            };
            const res = {
                status: sandbox.stub().returnsThis(),
                send: sandbox.stub()
            };
            const err = new Error("'Internal server error'")
            updateDevice.throws(err)

            await itemController.postListItem(req, res);

            expect(res.status.calledWith(500)).to.be.true;
        });

    });

    describe('getListItem', () => {
        it('should call list_item with correct parameter when id is undefind', async () => {
            // Mock req and res objects


            const req = {
                params: { id: undefined },
                user: mock_user,
                isLoggedIn: true
            };
            const res = {
                status: sandbox.stub().returnsThis(),
                send: sandbox.stub()
            };

            const deviceTypes = generateFakeDeviceTypes(5)
            const brands = generateFakeBrands(5)

            getAllDeviceType.resolves(deviceTypes)
            getAllBrand.resolves(brands)

            await itemController.getListItem(req, res);

            expect(renderUserLayout.calledWith(req, res, '../marketplace/list_item', {
                auth: req.isLoggedIn,
                user: req.user,
                deviceTypes: deviceTypes,
                brands: brands,
                colors: deviceColors,
                capacities: deviceCapacity
            })).to.be.true;
        });

        it('should not update with error throw ', async () => {
            const req = {
                params: { id: undefined },
                user: mock_user,
                isLoggedIn: true
            };
            const res = {
                status: sandbox.stub().returnsThis(),
                send: sandbox.stub()
            };
            const next = sandbox.spy();

            const err = new Error("'Internal server error'")
            getAllDeviceType.throws(err)

            await itemController.getListItem(req, res, next);

            expect(res.status.calledWith(500)).to.be.true;
        });

        it('should call edit_item with correct parameter when have device id', async () => {
            // Mock req and res objects
            const fakeDevice = generateFakeDevice(mock_user,1)
            const req = {
                params: { id: fakeDevice._id },
                user: mock_user,
                isLoggedIn: true
            };
            const res = {
                status: sandbox.stub().returnsThis(),
                send: sandbox.stub()
            };

            const deviceTypes = generateFakeDeviceTypes(5)
            const brands = generateFakeBrands(5)

            getDevice.resolves(fakeDevice)

            await itemController.getListItem(req, res);

            expect(renderUserLayout.calledWith(req, res, '../marketplace/edit_item', {
                auth: req.isLoggedIn,
                user: req.user,
                device: fakeDevice,
                colors: deviceColors,
                capacities: deviceCapacity
            })).to.be.true;
        });

        it('should not update with error throw', async () => {
            const fakeDevice = generateFakeDevice(mock_user,1)
            const req = {
                params: { id: fakeDevice._id },
                user: mock_user,
                isLoggedIn: true
            };
            const res = {
                status: sandbox.stub().returnsThis(),
                send: sandbox.stub()
            };
            const next = sandbox.spy();

            const err = new Error("'Internal server error'")
            getDevice.throws(err)

            await itemController.getListItem(req, res, next);

            expect(res.status.calledWith(500)).to.be.true;
        });
    });

    describe('getModelByBrandAndType', () => {
        it('should get list of model for brand and type', async () => {
            // Mock req and res objects
            const req = {
                query: { brand: 'SomeBrand', deviceType: 'SomeDeviceType' },
                user: mock_user,
                isLoggedIn: true
            };
            const res = {
                status: sandbox.stub().returnsThis(),
                send: sandbox.stub()
            };

            const models = generateFakeModels(5)
            getModels.resolves(models)

            await itemController.getModelByBrandAndType(req, res);

            expect(res.send.calledOnce).to.be.true;
            expect(res.send.calledWith(models)).to.be.true;
        });

        it('should get list of model for brand and type', async () => {
            // Mock req and res objects
            const req = {
                query: { brand: 'SomeBrand', deviceType: 'SomeDeviceType' },
                user: mock_user,
                isLoggedIn: true
            };
            const res = {
                status: sandbox.stub().returnsThis(),
                send: sandbox.stub()
            };

            const models = generateFakeModels(5)

            const err = new Error("'Internal server error'")
            getModels.throws(err)

            await itemController.getModelByBrandAndType(req, res);
            expect(res.send.calledWith(err)).to.be.true;
        });
    });

    describe('getItemDetails', () => {
        it('should load item_details with correct parameters', async () => {
            // Mock req and res objects
            const fakeDevice = generateFakeDevice(mock_user._id,1)
            const req = {
                params: { id: fakeDevice._id },
                user: mock_user,
                isLoggedIn: true
            };
            const res = {
                status: sandbox.stub().returnsThis(),
                send: sandbox.stub()
            };

            const models = generateFakeModels(5)
            const specs = []
            const fakeEbayProvider = generateFakeEbayProvider()
            const fakeCexProvider = generateFakeCexProvider()
            const fakeQuotes = [generateFakeQuote(fakeEbayProvider,3),generateFakeQuote(fakeCexProvider),2]

            getItemDetail.resolves(fakeDevice)
            getQuotes.resolves(fakeQuotes)
            generateQR.resolves({})
            getHistoryByDevice.resolves([])

            await itemController.getItemDetails(req, res);

            expect(renderUserLayout.calledWith(req, res, '../marketplace/item_details', {
                item: fakeDevice,
                specs,
                deviceCategory,
                deviceState,
                quoteState,
                quotes: fakeQuotes,
                auth: req.isLoggedIn,
                user: req.user,
                retrievalData: null,
                retrievalState,
                deviceReviewHistory: [],
                deviceVisibilityHistory: [],
                historyType,
                roleTypes,
                approvedQuote: fakeQuotes[0],
                hasApprovedQuote:true
            })).to.be.true;
        });

        it('should call res.status with 500 and next with an error message', async () => {
            // Mock req and res objects
            const fakeDevice = generateFakeDevice(mock_user,1)
            const req = {
                params: { id: fakeDevice._id },
                user: mock_user,
                isLoggedIn: true
            };
            const res = {
                status: sandbox.stub().returnsThis(),
                send: sandbox.stub()
            };
            const next = sandbox.spy();

            const err = new Error("Internal server error")
            getQuotes.throws(err)

            await itemController.getItemDetails(req, res,next);
            expect(res.status.calledOnce).to.be.true;
            expect(res.status.calledWith(500)).to.be.true;
            expect(next.calledOnce).to.be.true;
        });
    });

    describe('getItemDetails', () => {
        it('should update quote state to accepted', async () => {
            // Mock req and res objects
            const fakeDevice = generateFakeDevice(mock_user,3)
            const fakeProvider = generateFakeEbayProvider()
            const fakeQuote = generateFakeQuote(fakeProvider,0)
            const req = {
                body: {
                    id: fakeQuote._id,
                    state: 'ACCEPTED'
                },
                params: {
                    id: fakeDevice._id
                },
                user: mock_user,
                isLoggedIn: true
            };
            const res = {
                status: sandbox.stub().returnsThis(),
                send: sandbox.stub()
            };
            const next = sandbox.spy()

            getQuotes.resolves([fakeQuote])

            await itemController.postUpdateQuote(req, res, next);

            expect(res.status.calledWith(200)).to.be.true;
        });

        it('should call res.status with 500 and next with an error message', async () => {
            // Mock req and res objects
            const fakeDevice = generateFakeDevice(mock_user,3)
            const fakeProvider = generateFakeEbayProvider()
            const fakeQuote = generateFakeQuote(fakeProvider,0)
            const req = {
                body: {
                    id: fakeQuote._id,
                    state: 'ACCEPTED'
                },
                params: {
                    id: fakeDevice._id
                },
                user: mock_user,
                isLoggedIn: true
            };
            const res = {
                status: sandbox.stub().returnsThis(),
                send: sandbox.stub()
            };
            const next = sandbox.spy()

            const err = new Error('Internal server error')
            getQuotes.throws(err)

            await itemController.postUpdateQuote(req, res, next);

            expect(res.status.calledWith(500)).to.be.true;
            expect(next.calledWith(err)).to.be.true;
        });
    })
});