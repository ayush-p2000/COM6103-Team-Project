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
const fixedToCurrency = require("../../util/currency/fixedToCurrency");



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
const getQuoteById = sandbox.stub();
const updateQuote = sandbox.stub();

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
            getHistoryByDevice,
            getQuoteById,
            updateQuote
        },
        "../../util/layout/layoutUtils":{
            renderUserLayout
        },
        "../../util/Devices/devices":{
            handleMissingModel
        },
        "../../util/qr/qrcodeGenerator":{
            generateQR
        },
    });

describe('Test Item Page', () => {
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
            const fakeDevice = generateFakeDevice(mock_user._id,3)
            const fakeProvider = generateFakeEbayProvider()
            const fakeQuote = generateFakeQuote(fakeProvider._id,0)
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
            const fakeDevice = generateFakeDevice(mock_user._id,3)
            const fakeProvider = generateFakeEbayProvider()
            const fakeQuote = generateFakeQuote(fakeProvider._id,0)
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

    describe('getItemQrCodeView', () => {
        it('should render qr view with correct parameters', async () => {
            // Mock req and res objects
            const fakeProvider = generateFakeEbayProvider()
            const fakeQuote = generateFakeQuote(fakeProvider._id,3)
            const req = {
                params: {
                    id: fakeQuote._id
                },
                user: mock_user,
                isLoggedIn: true
            };
            const res = {
                render: sandbox.spy(),
                status: sandbox.stub().returnsThis(),
                send: sandbox.stub()
            };
            const next = sandbox.spy()

            getQuoteById.resolves(fakeQuote)


            await itemController.getItemQrCodeView(req, res, next);

            expect(res.render.calledOnce).to.be.true;
            expect(res.render.calledWith('marketplace/qr_view', {
                quote: fakeQuote,
                auth: req.isLoggedIn,
                user: req.user,
                toCurrencyFunc: fixedToCurrency,
                quoteState: quoteState.quoteState,
                quoteActive: true
            })).to.be.true;
            expect(next.calledOnce).to.be.false;
        });

        it('should render 403unauthorised error page if user is undefined', async () => {
            // Mock req and res objectsr()
            const fakeProvider = generateFakeEbayProvider()
            const fakeQuote = generateFakeQuote(fakeProvider._id,4)
            const req = {
                params: {
                    id: fakeQuote._id
                },
                user: undefined,
                isLoggedIn: true
            };
            const res = {
                render: sandbox.stub(),
                status: sandbox.stub().returnsThis(),
                send: sandbox.stub()
            };
            const next = sandbox.spy()

            getQuoteById.resolves(fakeQuote)

            await itemController.getItemQrCodeView(req, res, next);

            expect(res.render.calledWith('error/403unauthorised', {
                auth: req.isLoggedIn,
                user: req.user,
                message: "This quote is no longer active or you are not the listing user. Please contact the listing user for more information."
            })).to.be.true;
        });

        it('should call res.status with 404 ', async () => {
            // Mock req and res objectsr()
            const req = {
                params: {
                    id: undefined
                },
                user: mock_user,
                isLoggedIn: true
            };
            const res = {
                status: sandbox.stub().returnsThis(),
                send: sandbox.stub()
            };
            const next = sandbox.spy()

            getQuoteById.resolves(undefined)

            await itemController.getItemQrCodeView(req, res, next);

            expect(res.status.calledWith(404)).to.be.true;
        });
    })

    describe('confirmQuote', () => {
        it('should failed confirm quote when quote is not active with res.status(400)', async () => {
            // Mock req and res objects
            const fakeDevice = generateFakeDevice(mock_user._id,3)
            const fakeProvider = generateFakeEbayProvider()
            const fakeQuote = generateFakeQuote(fakeProvider._id,4)
            const req = {
                params: {
                    id: fakeQuote._id
                },
                body:{
                    final_price: 30,
                    receipt_id: "1234",
                    receipt_date: new Date(),
                },
                file: mock_photo,
                user: mock_user,
                isLoggedIn: true
            };
            const res = {
                render: sandbox.spy(),
                status: sandbox.stub().returnsThis(),
                send: sandbox.stub()
            };
            const next = sandbox.spy()

            getQuoteById.resolves(fakeQuote)

            await itemController.confirmQuote(req, res, next);

            expect(res.status.calledWith(400)).to.be.true;
        });

        it('should confirmed quote with res.status(200)', async () => {
            // Mock req and res objects
            const fakeDevice = generateFakeDevice(mock_user._id,3)
            const fakeProvider = generateFakeEbayProvider()
            const fakeQuote = generateFakeQuote(fakeProvider._id,3)
            const req = {
                params: {
                    id: fakeQuote._id
                },
                body:{
                    final_price: 30,
                    receipt_id: "1234",
                    receipt_date: new Date(),
                },
                file: mock_photo,
                user: mock_user,
                isLoggedIn: true
            };
            const res = {
                render: sandbox.spy(),
                status: sandbox.stub().returnsThis(),
                send: sandbox.stub()
            };
            const next = sandbox.spy()


            updateQuote.resolves(true);
            const saveDevice = { ...fakeDevice, save: sandbox.stub().resolves(fakeDevice) };
            getQuoteById.resolves(fakeQuote)
            getDevice.resolves(saveDevice)

            await itemController.confirmQuote(req, res, next);

            expect(saveDevice.state === 4).to.be.true;
            expect(res.status.calledWith(200)).to.be.true;
        });

        it('should failed confirmed quote with res.status(500) if now successfully save to database)', async () => {
            // Mock req and res objects
            const fakeDevice = generateFakeDevice(mock_user._id,3)
            const fakeProvider = generateFakeEbayProvider()
            const fakeQuote = generateFakeQuote(fakeProvider._id,3)
            const req = {
                params: {
                    id: fakeQuote._id
                },
                body:{
                    final_price: 30,
                    receipt_id: "1234",
                    receipt_date: new Date(),
                },
                file: mock_photo,
                user: mock_user,
                isLoggedIn: true
            };
            const res = {
                render: sandbox.spy(),
                status: sandbox.stub().returnsThis(),
                send: sandbox.stub()
            };
            const next = sandbox.spy()

            const saveDevice = { ...fakeDevice, save: sandbox.stub().rejects() };
            getQuoteById.resolves(fakeQuote)
            getDevice.resolves(saveDevice)

            await itemController.confirmQuote(req, res, next);

            expect(res.status.calledWith(500)).to.be.true;
        });

        it('should failed confirmed quote with res.status(500)', async () => {
            // Mock req and res objects
            const fakeDevice = generateFakeDevice(mock_user._id,3)
            const fakeProvider = generateFakeEbayProvider()
            const fakeQuote = generateFakeQuote(fakeProvider._id,3)
            const req = {
                params: {
                    id: fakeQuote._id
                },
                body:{
                    final_price: 30,
                    receipt_id: "1234",
                    receipt_date: new Date(),
                },
                file: mock_photo,
                user: mock_user,
                isLoggedIn: true
            };
            const res = {
                render: sandbox.spy(),
                status: sandbox.stub().returnsThis(),
                send: sandbox.stub()
            };
            const next = sandbox.spy()

            getQuoteById.resolves(fakeQuote)
            getDevice.resolves(fakeDevice)

            await itemController.confirmQuote(req, res, next);

            expect(res.status.calledWith(500)).to.be.true;

        });
    })

    describe('rejectQuote', () => {
        it('should reject quote with res.status(200)', async () => {
            // Mock req and res objects
            const fakeDevice = generateFakeDevice(mock_user._id,3)
            const fakeProvider = generateFakeEbayProvider()
            const fakeQuote = generateFakeQuote(fakeProvider._id,3)
            const req = {
                params: {
                    id: fakeQuote._id
                },
                user: mock_user,
                isLoggedIn: true
            };
            const res = {
                render: sandbox.spy(),
                status: sandbox.stub().returnsThis(),
                send: sandbox.stub()
            };
            const next = sandbox.spy()

            updateQuote.withArgs(fakeQuote._id, {state: 2}).returns(true);

            await itemController.rejectQuote(req, res, next);

            expect(res.status.calledWith(200)).to.be.true;
        });

        it('should failed reject quote with res.status(500)', async () => {
            // Mock req and res objects
            const fakeDevice = generateFakeDevice(mock_user._id,3);
            const fakeProvider = generateFakeEbayProvider();
            const fakeQuote = generateFakeQuote(fakeProvider._id,3);

            const req = {
                params: {
                    id: fakeQuote._id
                },
                user: mock_user,
                isLoggedIn: true
            };

            const res = {
                render: sandbox.spy(),
                status: sandbox.stub().returnsThis(),
                send: sandbox.stub()
            };

            const next = sandbox.spy();

            updateQuote.withArgs(fakeQuote._id, {state: 2}).returns(false);

            await itemController.rejectQuote(req, res, next);

            expect(res.status.calledWith(500)).to.be.true;
            expect(res.send.calledWith("Failed to update quote")).to.be.true;
        });

        it('should failed reject quote with res.status(500) with error', async () => {
            // Mock req and res objects
            const fakeDevice = generateFakeDevice(mock_user._id,3);
            const fakeProvider = generateFakeEbayProvider();
            const fakeQuote = generateFakeQuote(fakeProvider._id,3);

            const req = {
                params: {
                    id: fakeQuote._id
                },
                user: mock_user,
                isLoggedIn: true
            };

            const res = {
                render: sandbox.spy(),
                status: sandbox.stub().returnsThis(),
                send: sandbox.stub()
            };

            const next = sandbox.spy();

            updateQuote.withArgs(fakeQuote._id, {state: 2}).throws(new Error('Failed to update quote'));;

            await itemController.rejectQuote(req, res, next);

            expect(res.status.calledWith(500)).to.be.true;
            expect(res.send.calledWith("Failed to update quote")).to.be.true;
        });
    })

    describe('generateQRCode', () => {
        it('should send qr quote', async () => {
            // Mock req and res objects
            const fakeProvider = generateFakeEbayProvider()
            const fakeQuote = generateFakeQuote(fakeProvider._id,3)
            const req = {
                params: {
                    id: fakeQuote._id
                },
                user: mock_user,
                isLoggedIn: true
            };
            const res = {
                render: sandbox.spy(),
                status: sandbox.stub().returnsThis(),
                send: sandbox.stub()
            };
            const next = sandbox.spy()
            const fakeQRCode = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAIAAAD8GO2jAAAACXBIWXMAAAsSAAALEgHS3X78AAAAJ0lEQVR42mJg5u9PPwMOnAE4DRiw9B7TQQ1YzUS4QmZCFhMS0xkAAAw8SURBVHja7F15aBdVFMZ/7DjRpAQNi4wZm5u3MxY1e3d3dzazmOq+u3iHd/5zKk1SB0gAkAAAAAAAAAAADgJgVU5n4EHmEAAAAAAAAAAHwIxHIDAAAAAAAAAABAB9jF5My5xMysnUolX6VPUO+9nGutu6+JzhDLJ6KygoAAAAAAAAAADAH4BeALDQAA4BaAgHwAAA8AxQGAAAAAABwCMRyAwAAAAAAAAAQBvAXgCAAAAAMAJ8gAAAAAAAAAAEAH2MXsTK5Zn1olVzqY5D9d/bpGfz2Z2JfcO9LrXaVf5dfbNp95n+SS9NvWn3P9J3XVX1/b9n9J3Y5f7Wz9J2n8X2z9Z5f7W3+9n9p/G9j//69r/8D4/K6UOAAAAAAAAAAAfACTid+1l25eDxWdHAAAAAElFTkSuQmCC';

            generateQR.resolves(fakeQRCode)

            await itemController.generateQRCode(req, res, next);

            expect(generateQR.calledWith(req.params.id)).to.be.true;
            expect(res.send.calledWith(fakeQRCode)).to.be.true;
        });
    })
});