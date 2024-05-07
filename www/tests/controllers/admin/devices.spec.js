const {expect} = require("chai");
const proxyquire = require('proxyquire');

const sandbox = require('sinon').createSandbox();

let email = sandbox.spy();

const {faker} = require('@faker-js/faker');

const {mock_user} = require("../../mocks/user");
const {
    generateFakeDevices,
    generateFakeDevice
} = require("../../mocks/device");
const deviceState = require("../../../model/enum/deviceState");
const deviceCategory = require("../../../model/enum/deviceCategory");
const {
    generateFakeBrands,
    generateFakeBrand
} = require("../../mocks/brand");
const {
    generateFakeDeviceTypes,
    generateFakeDeviceType
} = require("../../mocks/deviceType");
const {
    mockResponse,
    mockRequest
} = require("mock-req-res");
const {
    generateFakeModels,
    generateFakeModel
} = require("../../mocks/model");
const dataService = require("../../../model/enum/dataService");
const historyType = require("../../../model/enum/historyType");
const roleTypes = require("../../../model/enum/roleTypes");
const deviceCapacity = require("../../../model/enum/deviceCapacity");
const deviceColors = require("../../../model/enum/deviceColors");
const {match} = require("sinon");

let getItemDetail = sandbox.stub();
let getAllDeviceType = sandbox.stub();
let getAllBrand = sandbox.stub();
let getModels = sandbox.stub();
let getModelsFromTypeAndBrand = sandbox.stub();
let updateItemDetails = sandbox.stub();
let addHistory = sandbox.stub();
let updateDeviceDetails = sandbox.stub();
let updateBrandDetails = sandbox.stub();
let updateModelDetails = sandbox.stub();
let updateUnknownDevices = sandbox.stub();
let updateDeviceTypeDetails = sandbox.stub();
let deleteBrand = sandbox.stub();
let deleteModel = sandbox.stub();
let deleteType = sandbox.stub();
let getReviewHistory = sandbox.stub();
let getDevices = sandbox.stub();
let getAllDevices = sandbox.stub();
let getAllUnknownDevices = sandbox.stub();
let getAllRetrievalDevices = sandbox.stub();
let addDeviceType = sandbox.stub();
let addBrand = sandbox.stub();
let addModel = sandbox.stub();
let getDeviceTypeById = sandbox.stub();
let getModelById = sandbox.stub();
let getBrandById = sandbox.stub();
let getAllModelsOfType = sandbox.stub();
let getAllModelsTableData = sandbox.stub();
let handleMissingModel = sandbox.stub();
let handleMissingModels = sandbox.stub();

let axios = sandbox.stub();
let gsmArena = {};

let renderAdminLayout = sandbox.spy();
let renderAdminLayoutPlaceholder = sandbox.spy();

let adminDevicesController;

let req = {}, res = {}, next = sandbox.spy();

describe('Test Admin Devices Controller', () => {
    beforeEach(() => {
        req = mockRequest();
        res = mockResponse();

        req.session = {};

        next = sandbox.spy();
    });

    describe('Test getDevices', () => {
        beforeEach(() => {
            getAllDevices = sandbox.stub();
            handleMissingModels = sandbox.stub();
            renderAdminLayout = sandbox.spy();


            adminDevicesController = proxyquire('../../../controllers/admin/adminDevicesController', {
                '../../model/mongodb': {
                    getAllDevices
                },
                '../../util/Devices/devices': {
                    handleMissingModels
                },
                '../../public/javascripts/Emailing/emailing': {
                    email
                },
                '../../util/layout/layoutUtils': {
                    renderAdminLayout
                }
            });
        });

        it('normally should call renderAdminLayout with the correct parameters', async () => {
            // Arrange
            const devices = generateFakeDevices(5);

            getAllDevices.resolves(devices);

            handleMissingModels.resolves();

            // Act
            await adminDevicesController.getDevicesPage(req, res, next);

            // Assert
            expect(renderAdminLayout.calledOnce).to.be.true;
            expect(renderAdminLayout.calledWith(req, res, 'devices', {
                devices: devices,
                deviceState,
                deviceCategory
            })).to.be.true;
            expect(next.calledOnce).to.be.false;
        });

        it('should call res.status with 500 and next with an error message when getAllDevices fails', async () => {
            // Arrange
            getAllDevices.rejects(new Error('An error occurred in getAllDevices'));

            // Act
            await adminDevicesController.getDevicesPage(req, res, next);

            // Assert
            expect(res.status.calledOnce).to.be.true;
            expect(res.status.calledWith(500)).to.be.true;
            expect(next.calledOnce).to.be.true;
        });

        it('should call res.status with 500 and next with an error message when handleMissingModels throws an error', async () => {
            // Arrange
            const devices = generateFakeDevices(5);

            getAllDevices.resolves(devices);

            handleMissingModels.throws(new Error('An error occurred in handleMissingModels'));

            // Act
            await adminDevicesController.getDevicesPage(req, res, next);

            // Assert
            expect(res.status.calledOnce).to.be.true;
            expect(res.status.calledWith(500)).to.be.true;
            expect(next.calledOnce).to.be.true;
        });
    });

    describe('Test getFlaggedDevicesPage', () => {
        beforeEach(() => {
            getAllUnknownDevices = sandbox.stub();
            getAllDeviceType = sandbox.stub();
            getAllBrand = sandbox.stub();

            renderAdminLayout = sandbox.spy();

            adminDevicesController = proxyquire('../../../controllers/admin/adminDevicesController', {
                '../../model/mongodb': {
                    getAllUnknownDevices,
                    getAllDeviceType,
                    getAllBrand
                },
                '../../util/layout/layoutUtils': {
                    renderAdminLayout
                },
                '../../public/javascripts/Emailing/emailing': {
                    email
                }
            });

        })
        it('normally should call renderAdminLayout with the correct parameters', async () => {
            // Arrange
            const devices = generateFakeDevices(5);
            const brands = generateFakeBrands(5);
            const deviceTypes = generateFakeDeviceTypes(5);

            getAllUnknownDevices.resolves(devices);
            getAllDeviceType.resolves(deviceTypes);
            getAllBrand.resolves(brands);

            // Act
            await adminDevicesController.getFlaggedDevicesPage(req, res, next);

            // Assert
            expect(renderAdminLayout.calledOnce).to.be.true;
            expect(renderAdminLayout.calledWith(req, res, 'unknown_devices', {
                devices: devices,
                deviceTypes: deviceTypes,
                brands: brands
            })).to.be.true;
            expect(next.calledOnce).to.be.false;
        });

        it('should call res.status with 500 and next with an error message when getAllUnknownDevices fails', async () => {
            // Arrange
            getAllUnknownDevices.rejects(new Error('An error occurred in getAllUnknownDevices'));

            // Act
            await adminDevicesController.getFlaggedDevicesPage(req, res, next);

            // Assert
            expect(res.status.calledOnce).to.be.true;
            expect(res.status.calledWith(500)).to.be.true;
            expect(next.calledOnce).to.be.true;
        });

        it('should call res.status with 500 and next with an error message when getAllDeviceType throws an error', async () => {
            // Arrange
            const devices = generateFakeDevices(5);

            getAllUnknownDevices.resolves(devices);
            getAllDeviceType.rejects(new Error('An error occurred in getAllDeviceType'));

            // Act
            await adminDevicesController.getFlaggedDevicesPage(req, res, next);

            // Assert
            expect(res.status.calledOnce).to.be.true;
            expect(res.status.calledWith(500)).to.be.true;
            expect(next.calledOnce).to.be.true;
        });

        it('should call res.status with 500 and next with an error message when getAllBrand throws an error', async () => {
            // Arrange
            const devices = generateFakeDevices(5);
            const deviceTypes = generateFakeDeviceTypes(5);

            getAllUnknownDevices.resolves(devices);
            getAllDeviceType.resolves(deviceTypes);
            getAllBrand.rejects(new Error('An error occurred in getAllBrand'));

            // Act
            await adminDevicesController.getFlaggedDevicesPage(req, res, next);

            // Assert
            expect(res.status.calledOnce).to.be.true;
            expect(res.status.calledWith(500)).to.be.true;
            expect(next.calledOnce).to.be.true;
        });
    });

    describe('Test getRetrievalDevicesPage', () => {
        beforeEach(() => {
            getAllRetrievalDevices = sandbox.stub();
            getAllDeviceType = sandbox.stub();
            getAllBrand = sandbox.stub();

            renderAdminLayout = sandbox.spy();

            adminDevicesController = proxyquire('../../../controllers/admin/adminDevicesController', {
                '../../model/mongodb': {
                    getAllRetrievalDevices,
                    getAllDeviceType,
                    getAllBrand
                },
                '../../util/layout/layoutUtils': {
                    renderAdminLayout
                },
                '../../public/javascripts/Emailing/emailing': {
                    email
                }
            });
        })
        it('normally should call renderAdminLayout with the correct parameters', async () => {
            // Arrange
            const devices = generateFakeDevices(5);
            const deviceTypes = generateFakeDeviceTypes(5);
            const brands = generateFakeBrands(5);

            getAllRetrievalDevices.resolves(devices);
            getAllDeviceType.resolves(deviceTypes);
            getAllBrand.resolves(brands);

            // Act
            await adminDevicesController.getRetrievalDevicesPage(req, res, next);

            // Assert
            expect(renderAdminLayout.calledOnce).to.be.true;
            expect(renderAdminLayout.calledWith(req, res, 'retrieval_devices', {
                devices: devices,
                deviceTypes: deviceTypes,
                brands: brands,
                deviceCategory,
                deviceState
            })).to.be.true;
        });

        it('should call res.status with 500 and next with an error message when getAllRetrievalDevices fails', async () => {
            // Arrange
            getAllRetrievalDevices.rejects(new Error('An error occurred in getAllRetrievalDevices'));

            // Act
            await adminDevicesController.getRetrievalDevicesPage(req, res, next);

            // Assert
            expect(res.status.calledOnce).to.be.true;
            expect(res.status.calledWith(500)).to.be.true;
            expect(next.calledOnce).to.be.true;
        });

        it('should call res.status with 500 and next with an error message when getAllDeviceType throws an error', async () => {
            // Arrange
            const devices = generateFakeDevices(5);

            getAllRetrievalDevices.resolves(devices);
            getAllDeviceType.rejects(new Error('An error occurred in getAllDeviceType'));

            // Act
            await adminDevicesController.getRetrievalDevicesPage(req, res, next);

            // Assert
            expect(res.status.calledOnce).to.be.true;
            expect(res.status.calledWith(500)).to.be.true;
            expect(next.calledOnce).to.be.true;
        });

        it('should call res.status with 500 and next with an error message when getAllBrand throws an error', async () => {
            // Arrange
            const devices = generateFakeDevices(5);
            const deviceTypes = generateFakeDeviceTypes(5);

            getAllRetrievalDevices.resolves(devices);
            getAllDeviceType.resolves(deviceTypes);
            getAllBrand.rejects(new Error('An error occurred in getAllBrand'));

            // Act
            await adminDevicesController.getRetrievalDevicesPage(req, res, next);

            // Assert
            expect(res.status.calledOnce).to.be.true;
            expect(res.status.calledWith(500)).to.be.true;
            expect(next.calledOnce).to.be.true;
        });
    });

    describe('Test postNewDeviceType', () => {
        beforeEach(() => {
            addDeviceType = sandbox.stub();

            adminDevicesController = proxyquire('../../../controllers/admin/adminDevicesController', {
                '../../model/mongodb': {
                    addDeviceType
                },
                '../../public/javascripts/Emailing/emailing': {
                    email
                }
            });
        });

        it('should return a 200 status code and the correct message when addDeviceType is successful', async () => {
            // Arrange
            req.body = {
                name: 'Test Device Type',
                description: 'This is a test device type'
            };

            addDeviceType.resolves();

            const expectedSuccessMessage = 'Device Type Added Successfully';

            // Act
            await adminDevicesController.postNewDeviceType(req, res, next);

            // Assert
            expect(res.status.calledOnce).to.be.true;
            expect(res.status.calledWith(200)).to.be.true;
            expect(res.send.calledOnce).to.be.true;
            expect(res.send.calledWith(expectedSuccessMessage)).to.be.true;
        });

        it('should call res.status with 500 with an error message when addDeviceType throws an error', async () => {
            // Arrange
            req.body = {
                name: 'Test Device Type',
                description: 'This is a test device type'
            };

            addDeviceType.rejects(new Error('An error occurred in addDeviceType'));

            // Act
            await adminDevicesController.postNewDeviceType(req, res, next);

            // Assert
            expect(res.status.calledOnce).to.be.true;
            expect(res.status.calledWith(500)).to.be.true;
            expect(res.send.calledOnce).to.be.true
            expect(res.send.calledWith('Internal Server Error')).to.be.true;
        });

        it('should return a 400 status code when the body is empty', async () => {
            // Arrange
            req.body = {};

            // Act
            await adminDevicesController.postNewDeviceType(req, res, next);

            // Assert
            expect(res.status.calledOnce).to.be.true;
            expect(res.status.calledWith(400)).to.be.true;
            expect(res.send.calledOnce).to.be.true;
        });

        it('should return a 400 status code when the body is missing the name field', async () => {
            // Arrange
            req.body = {
                description: 'This is a test device type'
            };

            // Act
            await adminDevicesController.postNewDeviceType(req, res, next);

            // Assert
            expect(res.status.calledOnce).to.be.true;
            expect(res.status.calledWith(400)).to.be.true;
            expect(res.send.calledOnce).to.be.true;
        });

        it('should return a 400 status code when the body is missing the description field', async () => {
            // Arrange
            req.body = {
                name: 'Test Device Type'
            };

            // Act
            await adminDevicesController.postNewDeviceType(req, res, next);

            // Assert
            expect(res.status.calledOnce).to.be.true;
            expect(res.status.calledWith(400)).to.be.true;
            expect(res.send.calledOnce).to.be.true;
        });
    });

    describe('Test postNewBrand', () => {
        beforeEach(() => {
            addBrand = sandbox.stub();

            adminDevicesController = proxyquire('../../../controllers/admin/adminDevicesController', {
                '../../model/mongodb': {
                    addBrand
                },
                '../../public/javascripts/Emailing/emailing': {
                    email
                }
            });
        });

        it('should return a 200 status code and the correct message when addBrand is successful', async () => {
            // Arrange
            req.body = {
                name: 'Test Brand'
            };

            addBrand.resolves();

            const expectedSuccessMessage = 'Brand Added Successfully';

            // Act
            await adminDevicesController.postNewBrand(req, res, next);

            // Assert
            expect(res.status.calledOnce).to.be.true;
            expect(res.status.calledWith(200)).to.be.true;
            expect(res.send.calledOnce).to.be.true;
            expect(res.send.calledWith(expectedSuccessMessage)).to.be.true;
        });

        it('should call res.status with 500 with an error message when addBrand throws an error', async () => {
            // Arrange
            req.body = {
                name: 'Test Brand'
            };

            addBrand.rejects(new Error('An error occurred in addBrand'));

            // Act
            await adminDevicesController.postNewBrand(req, res, next);

            // Assert
            expect(res.status.calledOnce).to.be.true;
            expect(res.status.calledWith(500)).to.be.true;
            expect(res.send.calledOnce).to.be.true
            expect(res.send.calledWith('Internal Server Error')).to.be.true;
        });

        it('should return a 400 status code when the body is empty', async () => {
            // Arrange
            req.body = {};

            // Act
            await adminDevicesController.postNewBrand(req, res, next);

            // Assert
            expect(res.status.calledOnce).to.be.true;
            expect(res.status.calledWith(400)).to.be.true;
            expect(res.send.calledOnce).to.be.true;
        });

        it('should return a 400 status code when the body is missing the name field', async () => {
            // Arrange
            req.body = {};

            // Act
            await adminDevicesController.postNewBrand(req, res, next);

            // Assert
            expect(res.status.calledOnce).to.be.true;
            expect(res.status.calledWith(400)).to.be.true;
            expect(res.send.calledOnce).to.be.true;
        });
    });

    describe('Test postNewModel', () => {
        beforeEach(() => {
            addModel = sandbox.stub();
            updateUnknownDevices = sandbox.stub();

            axios = {
                get: sandbox.stub()
            }

            gsmArena = {
                search: {
                    search: sandbox.stub()
                }
            }

            adminDevicesController = proxyquire('../../../controllers/admin/adminDevicesController', {
                '../../model/mongodb': {
                    addModel,
                    updateUnknownDevices
                },
                '../../public/javascripts/Emailing/emailing': {
                    email
                },
                'gsmarena-api': gsmArena,
                'axios': axios
            });
        })

        describe('Valid Behaviour', () => {
            it('[Current] should return a 200 status code and the correct message when addModel is successful', async () => {
                // Arrange
                req.body = {
                    name: 'Apple iPhone 12',
                    deviceType: faker.database.mongodbObjectId(),
                    brand: faker.database.mongodbObjectId()
                };

                addModel.resolves({
                    _id: faker.database.mongodbObjectId(),
                    deviceType: req.body.deviceType,
                    brand: req.body.brand,
                });
                updateUnknownDevices.resolves();

                gsmArena.search.search.resolves([{
                    id: 1,
                    name: 'Apple iPhone 12'
                }]);
                axios.get.resolves(
                    {
                        data: {
                            data: {
                                thumbnail: '',
                                specifications: [{}, {}],
                                release_date: "Released 2020, October 23",
                            }
                        }
                    });

                const expectedSuccessMessage = 'Model Added Successfully';

                // Act
                await adminDevicesController.postNewModel(req, res, next);

                // Assert
                expect(res.status.calledOnce).to.be.true;
                expect(res.status.calledWith(200)).to.be.true;
                expect(res.send.calledOnce).to.be.true;
                expect(res.send.calledWith(expectedSuccessMessage)).to.be.true;
            });

            it('[Rare] should return a 200 status code and the correct message when addModel is successful', async () => {
                // Arrange
                req.body = {
                    name: 'Apple iPhone 12',
                    deviceType: faker.database.mongodbObjectId(),
                    brand: faker.database.mongodbObjectId()
                };

                addModel.resolves({
                    _id: faker.database.mongodbObjectId(),
                    deviceType: req.body.deviceType,
                    brand: req.body.brand,
                });
                updateUnknownDevices.resolves();

                gsmArena.search.search.resolves([{
                    id: 1,
                    name: 'Apple iPhone 12'
                }]);
                axios.get.resolves(
                    {
                        data: {
                            data: {
                                thumbnail: '',
                                specifications: [{}, {}],
                                release_date: "Released 2018, October 23",
                            }
                        }
                    });

                const expectedSuccessMessage = 'Model Added Successfully';

                // Act
                await adminDevicesController.postNewModel(req, res, next);

                // Assert
                expect(res.status.calledOnce).to.be.true;
                expect(res.status.calledWith(200)).to.be.true;
                expect(res.send.calledOnce).to.be.true;
                expect(res.send.calledWith(expectedSuccessMessage)).to.be.true;
            });

            it('[Recycle] should return a 200 status code and the correct message when addModel is successful', async () => {
                // Arrange
                req.body = {
                    name: 'Apple iPhone 12',
                    deviceType: faker.database.mongodbObjectId(),
                    brand: faker.database.mongodbObjectId()
                };

                addModel.resolves({
                    _id: faker.database.mongodbObjectId(),
                    deviceType: req.body.deviceType,
                    brand: req.body.brand,
                });
                updateUnknownDevices.resolves();

                gsmArena.search.search.resolves([{
                    id: 1,
                    name: 'Apple iPhone 12'
                }]);
                axios.get.resolves(
                    {
                        data: {
                            data: {
                                thumbnail: '',
                                specifications: [{}, {}],
                                release_date: "Released 2005, October 23",
                            }
                        }
                    });

                const expectedSuccessMessage = 'Model Added Successfully';

                // Act
                await adminDevicesController.postNewModel(req, res, next);

                // Assert
                expect(res.status.calledOnce).to.be.true;
                expect(res.status.calledWith(200)).to.be.true;
                expect(res.send.calledOnce).to.be.true;
                expect(res.send.calledWith(expectedSuccessMessage)).to.be.true;
            });
        });

        it('should call res.status with 500 with an error message when addModel throws an error', async () => {
            // Arrange
            req.body = {
                name: 'iPhone 12',
                deviceType: faker.database.mongodbObjectId(),
                brand: faker.database.mongodbObjectId()
            };

            addModel.rejects(new Error('An error occurred in addModel'));

            // Act
            await adminDevicesController.postNewModel(req, res, next);

            // Assert
            expect(res.status.calledOnce).to.be.true;
            expect(res.status.calledWith(500)).to.be.true;
            expect(res.send.calledOnce).to.be.true
            expect(res.send.calledWith('Internal Server Error')).to.be.true;
        });

        it('should return a 400 status code when the body is empty', async () => {
            // Arrange
            req.body = {};

            // Act
            await adminDevicesController.postNewModel(req, res, next);

            // Assert
            expect(res.status.calledOnce).to.be.true;
            expect(res.status.calledWith(400)).to.be.true;
            expect(res.send.calledOnce).to.be.true;
        });

        it('should return a 400 status code when the body is missing the name field', async () => {
            // Arrange
            req.body = {
                deviceType: faker.database.mongodbObjectId(),
                brand: faker.database.mongodbObjectId()
            };

            // Act
            await adminDevicesController.postNewModel(req, res, next);

            // Assert
            expect(res.status.calledOnce).to.be.true;
            expect(res.status.calledWith(400)).to.be.true;
            expect(res.send.calledOnce).to.be.true;
        });

        it('should return a 400 status code when the body is missing the deviceType field', async () => {
            // Arrange
            req.body = {
                name: 'iPhone 12',
                brand: faker.database.mongodbObjectId()
            };

            // Act
            await adminDevicesController.postNewModel(req, res, next);

            // Assert
            expect(res.status.calledOnce).to.be.true;
            expect(res.status.calledWith(400)).to.be.true;
            expect(res.send.calledOnce).to.be.true;
        });

        it('should return a 400 status code when the body is missing the brand field', async () => {
            // Arrange
            req.body = {
                name: 'iPhone 12',
                deviceType: faker.database.mongodbObjectId()
            };

            // Act
            await adminDevicesController.postNewModel(req, res, next);

            // Assert
            expect(res.status.calledOnce).to.be.true;
            expect(res.status.calledWith(400)).to.be.true;
            expect(res.send.calledOnce).to.be.true;
        });
    });

    describe('Test getDeviceTypePage', () => {
        beforeEach(() => {
            getAllDeviceType = sandbox.stub();
            getAllBrand = sandbox.stub();
            getAllModelsTableData = sandbox.stub();

            renderAdminLayout = sandbox.spy();

            adminDevicesController = proxyquire('../../../controllers/admin/adminDevicesController', {
                '../../model/mongodb': {
                    getAllDeviceType,
                    getAllBrand,
                    getAllModelsTableData
                },
                '../../util/layout/layoutUtils': {
                    renderAdminLayout,
                },
                '../../public/javascripts/Emailing/emailing': {
                    email
                }
            });
        });

        it('normally should call renderAdminLayout with the correct parameters', async () => {
            // Arrange
            req.params = {
                subpage: 'brands'
            };

            const deviceTypes = generateFakeDeviceTypes(5);
            const brands = generateFakeBrands(5);

            getAllDeviceType.resolves(deviceTypes);
            getAllBrand.resolves(brands);

            // Act
            await adminDevicesController.getDeviceTypePage(req, res, next);

            // Assert
            expect(renderAdminLayout.calledOnce).to.be.true;
            expect(renderAdminLayout.calledWith(req, res, 'device_types', {
                deviceTypes: deviceTypes,
                brands: brands,
                subpage: 'brands',
                models: []
            })).to.be.true;
        });

        it('should call renderAdminLayout for the brands subpage if the subpage parameter is missing', async () => {
            // Arrange
            const deviceTypes = generateFakeDeviceTypes(5);
            const brands = generateFakeBrands(5);

            getAllDeviceType.resolves(deviceTypes);
            getAllBrand.resolves(brands);

            // Act
            await adminDevicesController.getDeviceTypePage(req, res, next);

            // Assert
            expect(renderAdminLayout.calledOnce).to.be.true;
            expect(renderAdminLayout.calledWith(req, res, 'device_types', {
                deviceTypes: deviceTypes,
                brands: brands,
                subpage: 'brands',
                models: []
            })).to.be.true;
        });

        it('should call res.status with 500 and next with an error message when getAllDeviceType fails', async () => {
            // Arrange
            req.params = {
                subpage: 'brands'
            };

            getAllDeviceType.rejects(new Error('An error occurred in getAllDeviceType'));

            // Act
            await adminDevicesController.getDeviceTypePage(req, res, next);

            // Assert
            expect(res.status.calledOnce).to.be.true;
            expect(res.status.calledWith(500)).to.be.true;
            expect(next.calledOnce).to.be.true;
        });

        it('should call res.status with 500 and next with an error message when getAllBrand throws an error', async () => {
            // Arrange
            req.params = {
                subpage: 'brands'
            };

            const deviceTypes = generateFakeDeviceTypes(5);

            getAllDeviceType.resolves(deviceTypes);
            getAllBrand.rejects(new Error('An error occurred in getAllBrand'));

            // Act
            await adminDevicesController.getDeviceTypePage(req, res, next);

            // Assert
            expect(res.status.calledOnce).to.be.true;
            expect(res.status.calledWith(500)).to.be.true;
            expect(next.calledOnce).to.be.true;
        });

        describe('model subpage Tests', () => {
            it('normally should call renderAdminLayout with the correct parameters', async () => {
                // Arrange
                req.params = {
                    subpage: 'models'
                };

                const deviceTypes = generateFakeDeviceTypes(5);
                const brands = generateFakeBrands(5);
                const models = generateFakeModels(5);

                getAllDeviceType.resolves(deviceTypes);
                getAllBrand.resolves(brands);
                getAllModelsTableData.resolves(models);

                // Act
                await adminDevicesController.getDeviceTypePage(req, res, next);

                // Assert
                expect(renderAdminLayout.calledOnce).to.be.true;
                expect(renderAdminLayout.calledWith(req, res, 'device_types', {
                    deviceTypes: deviceTypes,
                    brands: brands,
                    subpage: 'models',
                    models: models
                })).to.be.true;
            });

            it('should call res.status with 500 and next with an error message when getAllModelsTableData fails', async () => {
                // Arrange
                req.params = {
                    subpage: 'models'
                };

                const deviceTypes = generateFakeDeviceTypes(5);
                const brands = generateFakeBrands(5);

                getAllDeviceType.resolves(deviceTypes);
                getAllBrand.resolves(brands);
                getAllModelsTableData.rejects(new Error('An error occurred in getAllModelsTableData'));

                // Act
                await adminDevicesController.getDeviceTypePage(req, res, next);

                // Assert
                expect(res.status.calledOnce).to.be.true;
                expect(res.status.calledWith(500)).to.be.true;
                expect(next.calledOnce).to.be.true;
            });
        });
    });

    describe('Test getDeviceTypeDetailsPage', () => {
        beforeEach(() => {
            getDeviceTypeById = sandbox.stub();
            getModelById = sandbox.stub();
            getBrandById = sandbox.stub();
            getAllDeviceType = sandbox.stub();
            getAllBrand = sandbox.stub();
            getAllModelsOfType = sandbox.stub();

            renderAdminLayout = sandbox.spy();

            adminDevicesController = proxyquire('../../../controllers/admin/adminDevicesController', {
                '../../model/mongodb': {
                    getDeviceTypeById,
                    getModelById,
                    getBrandById,
                    getAllDeviceType,
                    getAllBrand,
                    getAllModelsOfType
                },
                '../../util/layout/layoutUtils': {
                    renderAdminLayout
                },
                '../../public/javascripts/Emailing/emailing': {
                    email
                }
            });
        });

        describe('brands subpage Tests', () => {
            it('normally should call renderAdminLayout with the correct parameters', async () => {
                // Arrange
                req.params = {
                    subpage: 'brands',
                    id: faker.database.mongodbObjectId()
                };

                const brand = generateFakeBrand();

                getBrandById.resolves(brand);

                // Act
                await adminDevicesController.getDeviceTypeDetailsPage(req, res, next);

                // Assert
                expect(renderAdminLayout.calledOnce).to.be.true;
                expect(renderAdminLayout.calledWith(req, res, 'device_type_details', {
                    item: brand,
                    itemType: 'brand',
                    brands: [],
                    deviceTypes: [],
                    typeModels: []
                })).to.be.true;
            });

            it('should call res.status with 500 and next with an error message when getBrandById fails', async () => {
                // Arrange
                req.params = {
                    subpage: 'brands',
                    id: faker.database.mongodbObjectId()
                };

                getBrandById.rejects(new Error('An error occurred in getBrandById'));

                // Act
                await adminDevicesController.getDeviceTypeDetailsPage(req, res, next);

                // Assert
                expect(res.status.calledOnce).to.be.true;
                expect(res.status.calledWith(500)).to.be.true;
                expect(next.calledOnce).to.be.true;
            });
        });

        describe('models subpage Tests', () => {
            it('normally should call renderAdminLayout with the correct parameters', async () => {
                // Arrange
                req.params = {
                    subpage: 'models',
                    id: faker.database.mongodbObjectId()
                };

                const model = generateFakeModel;
                const deviceTypes = generateFakeDeviceTypes(5);
                const brands = generateFakeBrands(5);

                getModelById.resolves(model);
                getAllDeviceType.resolves(deviceTypes);
                getAllBrand.resolves(brands);

                // Act
                await adminDevicesController.getDeviceTypeDetailsPage(req, res, next);

                // Assert
                expect(renderAdminLayout.calledOnce).to.be.true;
                expect(renderAdminLayout.calledWith(req, res, 'device_type_details', {
                    item: model,
                    itemType: 'model',
                    brands: brands,
                    deviceTypes: deviceTypes,
                    typeModels: []
                })).to.be.true;
            });

            it('should call res.status with 500 and next with an error message when getModelById fails', async () => {
                // Arrange
                req.params = {
                    subpage: 'models',
                    id: faker.database.mongodbObjectId()
                };

                getModelById.rejects(new Error('An error occurred in getModelById'));

                // Act
                await adminDevicesController.getDeviceTypeDetailsPage(req, res, next);

                // Assert
                expect(res.status.calledOnce).to.be.true;
                expect(res.status.calledWith(500)).to.be.true;
                expect(next.calledOnce).to.be.true;
            });

            it('should call res.status with 500 and next with an error message when getAllDeviceType fails', async () => {
                // Arrange
                req.params = {
                    subpage: 'models',
                    id: faker.database.mongodbObjectId()
                };

                const model = generateFakeModel();

                getModelById.resolves(model);
                getAllDeviceType.rejects(new Error('An error occurred in getAllDeviceType'));

                // Act
                await adminDevicesController.getDeviceTypeDetailsPage(req, res, next);

                // Assert
                expect(res.status.calledOnce).to.be.true;
                expect(res.status.calledWith(500)).to.be.true;
                expect(next.calledOnce).to.be.true;
            });

            it('should call res.status with 500 and next with an error message when getAllBrand fails', async () => {
                // Arrange
                req.params = {
                    subpage: 'models',
                    id: faker.database.mongodbObjectId()
                };

                const model = generateFakeModel();
                const deviceTypes = generateFakeDeviceTypes(5);

                getModelById.resolves(model);
                getAllDeviceType.resolves(deviceTypes);
                getAllBrand.rejects(new Error('An error occurred in getAllBrand'));

                // Act
                await adminDevicesController.getDeviceTypeDetailsPage(req, res, next);

                // Assert
                expect(res.status.calledOnce).to.be.true;
                expect(res.status.calledWith(500)).to.be.true;
                expect(next.calledOnce).to.be.true;
            });
        });

        describe('device-types subpage Tests', () => {
            it('normally should call renderAdminLayout with the correct parameters', async () => {
                // Arrange
                req.params = {
                    subpage: 'device-types',
                    id: faker.database.mongodbObjectId()
                };

                const deviceType = generateFakeDeviceType();
                const models = generateFakeModels(5);

                getDeviceTypeById.resolves(deviceType);
                getAllModelsOfType.resolves(models);

                // Act
                await adminDevicesController.getDeviceTypeDetailsPage(req, res, next);

                // Assert
                expect(renderAdminLayout.calledOnce).to.be.true;
                expect(renderAdminLayout.calledWith(req, res, 'device_type_details', {
                    item: deviceType,
                    itemType: 'device-type',
                    brands: [],
                    deviceTypes: [],
                    typeModels: models
                })).to.be.true;
            });

            it('should call res.status with 500 and next with an error message when getDeviceTypeById fails', async () => {
                // Arrange
                req.params = {
                    subpage: 'device-types',
                    id: faker.database.mongodbObjectId()
                };

                getDeviceTypeById.rejects(new Error('An error occurred in getDeviceTypeById'));

                // Act
                await adminDevicesController.getDeviceTypeDetailsPage(req, res, next);

                // Assert
                expect(res.status.calledOnce).to.be.true;
                expect(res.status.calledWith(500)).to.be.true;
                expect(next.calledOnce).to.be.true;
            });

            it('should call res.status with 500 and next with an error message when getAllModelsOfType fails', async () => {
                // Arrange
                req.params = {
                    subpage: 'device-types',
                    id: faker.database.mongodbObjectId()
                };

                const deviceType = generateFakeDeviceType();

                getDeviceTypeById.resolves(deviceType);
                getAllModelsOfType.rejects(new Error('An error occurred in getAllModelsOfType'));

                // Act
                await adminDevicesController.getDeviceTypeDetailsPage(req, res, next);

                // Assert
                expect(res.status.calledOnce).to.be.true;
                expect(res.status.calledWith(500)).to.be.true;
                expect(next.calledOnce).to.be.true;
            });
        });

        describe('default behaviour Tests', () => {
            it('should redirect to /admin/types if the subpage parameter is missing', async () => {
                // Arrange
                req.params = {};

                // Act
                await adminDevicesController.getDeviceTypeDetailsPage(req, res, next);

                // Assert
                expect(res.redirect.calledOnce).to.be.true;
                expect(res.redirect.calledWith('/admin/types')).to.be.true;
            });

            it('should redirect to /admin/types if the subpage parameter is invalid', async () => {
                // Arrange
                req.params = {
                    subpage: 'invalid'
                };

                // Act
                await adminDevicesController.getDeviceTypeDetailsPage(req, res, next);

                // Assert
                expect(res.redirect.calledOnce).to.be.true;
                expect(res.redirect.calledWith('/admin/types')).to.be.true;
            });
        });
    });

    describe('Test updateDeviceType', () => {
        beforeEach(() => {
            updateBrandDetails = sandbox.stub();
            updateModelDetails = sandbox.stub();
            updateDeviceTypeDetails = sandbox.stub();

            adminDevicesController = proxyquire('../../../controllers/admin/adminDevicesController', {
                '../../model/mongodb': {
                    updateBrandDetails,
                    updateModelDetails,
                    updateDeviceTypeDetails
                },
                '../../public/javascripts/Emailing/emailing': {
                    email
                }
            });
        });

        it(`should redirect to /admin/types/<subpage>/<id> if there are any session messages`, async () => {
            // Arrange
            req.session = {
                messages: ['Test Message']
            };

            // Act
            await adminDevicesController.updateDeviceType(req, res, next);

            // Assert
            expect(res.redirect.calledOnce).to.be.true;
            expect(res.redirect.calledWith(`/admin/types/${req.body.subpage}/${req.body.id}`)).to.be.true;
        })

        describe('brands subpage Tests', () => {
            it('should redirect to the details page when updateBrandDetails is successful', async () => {
                // Arrange
                req.params = {
                    id: faker.database.mongodbObjectId(),
                    subpage: 'brands'
                };

                req.body = {
                    name: 'Test Brand'
                }

                updateBrandDetails.resolves();

                // Act
                await adminDevicesController.updateDeviceType(req, res, next);

                // Assert
                expect(res.redirect.calledOnce).to.be.true;
                expect(res.redirect.calledWith(`/admin/types/${req.params.subpage}/${req.params.id}`)).to.be.true;
            });

            it('should call res.status with 500 and next with an error message when updateBrandDetails throws an error', async () => {
                // Arrange
                req.params = {
                    id: faker.database.mongodbObjectId(),
                    subpage: 'brands'
                };

                req.body = {
                    name: 'Test Brand'
                }

                updateBrandDetails.rejects(new Error('An error occurred in updateBrandDetails'));

                // Act
                await adminDevicesController.updateDeviceType(req, res, next);

                // Assert
                expect(res.status.calledOnce).to.be.true;
                expect(res.status.calledWith(500)).to.be.true;
                expect(next.calledOnce).to.be.true;
            });

            it('should redirect with an error when the body is empty', async () => {
                // Arrange
                req.params = {
                    id: faker.database.mongodbObjectId(),
                    subpage: 'brands'
                };

                req.body = {};

                // Act
                await adminDevicesController.updateDeviceType(req, res, next);

                // Assert
                expect(res.redirect.calledOnce).to.be.true;
                expect(res.redirect.calledWith(`/admin/types/${req.params.subpage}/${req.params.id}`)).to.be.true;
            });

            it('should redirect with an error when the body is missing the name field', async () => {
                // Arrange
                req.params = {
                    id: faker.database.mongodbObjectId(),
                    subpage: 'brands'
                };

                req.body = {};

                // Act
                await adminDevicesController.updateDeviceType(req, res, next);

                // Assert
                expect(res.redirect.calledOnce).to.be.true;
                expect(res.redirect.calledWith(`/admin/types/${req.params.subpage}/${req.params.id}`)).to.be.true;
            });
        });

        describe('models subpage Tests', () => {
            it('should redirect to the details page when updateModelDetails is successful', async () => {
                // Arrange
                req.params = {
                    id: faker.database.mongodbObjectId(),
                    subpage: 'models'
                };

                req.body = {
                    name: 'Test Model',
                    modelBrand: faker.database.mongodbObjectId(),
                    modelType: faker.database.mongodbObjectId()
                }

                updateModelDetails.resolves();

                // Act
                await adminDevicesController.updateDeviceType(req, res, next);

                // Assert
                expect(res.redirect.calledOnce).to.be.true;
                expect(res.redirect.calledWith(`/admin/types/${req.params.subpage}/${req.params.id}`)).to.be.true;
            });

            it('should call res.status with 500 and next with an error message when updateModelDetails throws an error', async () => {
                // Arrange
                req.params = {
                    id: faker.database.mongodbObjectId(),
                    subpage: 'models'
                };

                req.body = {
                    name: 'Test Model',
                    modelBrand: faker.database.mongodbObjectId(),
                    modelType: faker.database.mongodbObjectId()
                }

                updateModelDetails.rejects(new Error('An error occurred in updateModelDetails'));

                // Act
                await adminDevicesController.updateDeviceType(req, res, next);

                // Assert
                expect(res.status.calledOnce).to.be.true;
                expect(res.status.calledWith(500)).to.be.true;
                expect(next.calledOnce).to.be.true;
            });

            it('should redirect with a message when the body is empty', async () => {
                // Arrange
                req.params = {
                    id: faker.database.mongodbObjectId(),
                    subpage: 'models'
                };

                req.body = {};

                // Act
                await adminDevicesController.updateDeviceType(req, res, next);

                // Assert
                expect(res.redirect.calledOnce).to.be.true;
                expect(res.redirect.calledWith(`/admin/types/${req.params.subpage}/${req.params.id}`)).to.be.true;
            });

            it('should redirect with a message when the body is missing the name field', async () => {
                // Arrange
                req.params = {
                    id: faker.database.mongodbObjectId(),
                    subpage: 'models'
                };

                req.body = {};

                // Act
                await adminDevicesController.updateDeviceType(req, res, next);

                // Assert
                expect(res.redirect.calledOnce).to.be.true;
                expect(res.redirect.calledWith(`/admin/types/${req.params.subpage}/${req.params.id}`)).to.be.true;
            });

            it('should redirect with a message when the body is missing the modelBrand field', async () => {
                // Arrange
                req.params = {
                    id: faker.database.mongodbObjectId(),
                    subpage: 'models'
                };

                req.body = {
                    name: 'Test Model',
                    modelType: faker.database.mongodbObjectId()
                };

                // Act
                await adminDevicesController.updateDeviceType(req, res, next);

                // Assert
                expect(res.redirect.calledOnce).to.be.true;
                expect(res.redirect.calledWith(`/admin/types/${req.params.subpage}/${req.params.id}`)).to.be.true;
            });

            it('should redirect with a message when the body is missing the modelType field', async () => {
                // Arrange
                req.params = {
                    id: faker.database.mongodbObjectId(),
                    subpage: 'models'
                };

                req.body = {
                    name: 'Test Model',
                    modelBrand: faker.database.mongodbObjectId()
                };

                // Act
                await adminDevicesController.updateDeviceType(req, res, next);

                // Assert
                expect(res.redirect.calledOnce).to.be.true;
                expect(res.redirect.calledWith(`/admin/types/${req.params.subpage}/${req.params.id}`)).to.be.true;
            });
        });

        describe('device-types subpage Tests', () => {
            it('should redirect to the details page when updateDeviceTypeDetails is successful', async () => {
                // Arrange
                req.params = {
                    id: faker.database.mongodbObjectId(),
                    subpage: 'device-types'
                };

                req.body = {
                    name: 'Test Device Type',
                    description: 'This is a test device type'
                }

                updateDeviceTypeDetails.resolves();

                // Act
                await adminDevicesController.updateDeviceType(req, res, next);

                // Assert
                expect(res.redirect.calledOnce).to.be.true;
                expect(res.redirect.calledWith(`/admin/types/${req.params.subpage}/${req.params.id}`)).to.be.true;
            });

            it('should call res.status with 500 and next with an error message when updateDeviceTypeDetails throws an error', async () => {
                // Arrange
                req.params = {
                    id: faker.database.mongodbObjectId(),
                    subpage: 'device-types'
                };

                req.body = {
                    name: 'Test Device Type',
                    description: 'This is a test device type'
                }

                updateDeviceTypeDetails.rejects(new Error('An error occurred in updateDeviceTypeDetails'));

                // Act
                await adminDevicesController.updateDeviceType(req, res, next);

                // Assert
                expect(res.status.calledOnce).to.be.true;
                expect(res.status.calledWith(500)).to.be.true;
                expect(next.calledOnce).to.be.true;
            });

            it('should redirect with an error when the body is empty', async () => {
                // Arrange
                req.params = {
                    id: faker.database.mongodbObjectId(),
                    subpage: 'device-types'
                };

                req.body = {};

                // Act
                await adminDevicesController.updateDeviceType(req, res, next);

                // Assert
                expect(res.redirect.calledOnce).to.be.true;
                expect(res.redirect.calledWith(`/admin/types/${req.params.subpage}/${req.params.id}`)).to.be.true;
            });

            it('should redirect with an error when the body is missing the name field', async () => {
                // Arrange
                req.params = {
                    id: faker.database.mongodbObjectId(),
                    subpage: 'device-types'
                };

                req.body = {
                    description: 'This is a test device type'
                };

                // Act
                await adminDevicesController.updateDeviceType(req, res, next);

                // Assert
                expect(res.redirect.calledOnce).to.be.true;
                expect(res.redirect.calledWith(`/admin/types/${req.params.subpage}/${req.params.id}`)).to.be.true;
            });

            it('should redirect with an error when the body is missing the description field', async () => {
                // Arrange
                req.params = {
                    id: faker.database.mongodbObjectId(),
                    subpage: 'device-types'
                };

                req.body = {
                    name: 'Test Device Type'
                };

                // Act
                await adminDevicesController.updateDeviceType(req, res, next);

                // Assert
                expect(res.redirect.calledOnce).to.be.true;
                expect(res.redirect.calledWith(`/admin/types/${req.params.subpage}/${req.params.id}`)).to.be.true;
            });
        });

        describe('default behaviour Tests', () => {
            it('should redirect to /admin/types if the subpage parameter is missing', async () => {
                // Arrange
                req.params = {
                    id: faker.database.mongodbObjectId()
                };

                req.body = {
                    name: 'Test Device Type',
                }

                // Act
                await adminDevicesController.updateDeviceType(req, res, next);

                // Assert
                expect(res.redirect.calledOnce).to.be.true;
                expect(res.redirect.calledWith('/admin/types')).to.be.true;
            });

            it('should redirect to /admin/types if the subpage parameter is invalid', async () => {
                // Arrange
                req.params = {
                    id: faker.database.mongodbObjectId(),
                    subpage: 'invalid'
                };

                req.body = {
                    name: 'Test Device Type',
                }

                // Act
                await adminDevicesController.updateDeviceType(req, res, next);

                // Assert
                expect(res.redirect.calledOnce).to.be.true;
                expect(res.redirect.calledWith('/admin/types')).to.be.true;
            });
        });
    });

    describe('Test deleteDeviceType', () => {
        beforeEach(() => {
            deleteBrand = sandbox.stub();
            deleteModel = sandbox.stub();
            deleteType = sandbox.stub();

            adminDevicesController = proxyquire('../../../controllers/admin/adminDevicesController', {
                '../../model/mongodb': {
                    deleteBrand,
                    deleteModel,
                    deleteType
                }
            });
        });
        describe('brands subpage Tests', () => {
            it('should redirect to the type subpage when deleteBrand is successful', async () => {
                // Arrange
                req.params = {
                    id: faker.database.mongodbObjectId(),
                    subpage: 'brands'
                };

                deleteBrand.resolves();

                // Act
                await adminDevicesController.deleteDeviceType(req, res, next);

                // Assert
                expect(res.redirect.calledOnce).to.be.true;
                expect(res.redirect.calledWith(`/admin/types/brands`)).to.be.true;
            });

            it('should call res.status with 500 and next with an error message when deleteBrand throws an error', async () => {
                // Arrange
                req.params = {
                    id: faker.database.mongodbObjectId(),
                    subpage: 'brands'
                };

                deleteBrand.rejects(new Error('An error occurred in deleteBrand'));

                // Act
                await adminDevicesController.deleteDeviceType(req, res, next);

                // Assert
                expect(res.status.calledOnce).to.be.true;
                expect(res.status.calledWith(500)).to.be.true;
                expect(next.calledOnce).to.be.true;
            });
        });

        describe('models subpage Tests', () => {
            it('should redirect to the type subpage when deleteModel is successful', async () => {
                // Arrange
                req.params = {
                    id: faker.database.mongodbObjectId(),
                    subpage: 'models'
                };

                deleteModel.resolves();

                // Act
                await adminDevicesController.deleteDeviceType(req, res, next);

                // Assert
                expect(res.redirect.calledOnce).to.be.true;
                expect(res.redirect.calledWith(`/admin/types/models`)).to.be.true;
            });

            it('should call res.status with 500 and next with an error message when deleteModel throws an error', async () => {
                // Arrange
                req.params = {
                    id: faker.database.mongodbObjectId(),
                    subpage: 'models'
                };

                deleteModel.rejects(new Error('An error occurred in deleteModel'));

                // Act
                await adminDevicesController.deleteDeviceType(req, res, next);

                // Assert
                expect(res.status.calledOnce).to.be.true;
                expect(res.status.calledWith(500)).to.be.true;
                expect(next.calledOnce).to.be.true;
            });
        });

        describe('device-types subpage Tests', () => {
            it('should redirect to the type subpage when deleteType is successful', async () => {
                // Arrange
                req.params = {
                    id: faker.database.mongodbObjectId(),
                    subpage: 'device-types'
                };

                deleteType.resolves();

                // Act
                await adminDevicesController.deleteDeviceType(req, res, next);

                // Assert
                expect(res.redirect.calledOnce).to.be.true;
                expect(res.redirect.calledWith(`/admin/types/device-types`)).to.be.true;
            });

            it('should call res.status with 500 and next with an error message when deleteType throws an error', async () => {
                // Arrange
                req.params = {
                    id: faker.database.mongodbObjectId(),
                    subpage: 'device-types'
                };

                deleteType.rejects(new Error('An error occurred in deleteType'));

                // Act
                await adminDevicesController.deleteDeviceType(req, res, next);

                // Assert
                expect(res.status.calledOnce).to.be.true;
                expect(res.status.calledWith(500)).to.be.true;
                expect(next.calledOnce).to.be.true;
            });
        });

        describe('default behaviour Tests', () => {
            it('should redirect to /admin/types if the subpage parameter is missing', async () => {
                // Arrange
                req.params = {
                    id: faker.database.mongodbObjectId()
                };

                // Act
                await adminDevicesController.deleteDeviceType(req, res, next);

                // Assert
                expect(res.redirect.calledOnce).to.be.true;
                expect(res.redirect.calledWith('/admin/types')).to.be.true;
            });

            it('should redirect to /admin/types if the subpage parameter is invalid', async () => {
                // Arrange
                req.params = {
                    id: faker.database.mongodbObjectId(),
                    subpage: 'invalid'
                };

                // Act
                await adminDevicesController.deleteDeviceType(req, res, next);

                // Assert
                expect(res.redirect.calledOnce).to.be.true;
                expect(res.redirect.calledWith('/admin/types')).to.be.true;
            });
        });
    });

    describe('Test getUserDeviceDetailsPage', () => {
        beforeEach(() => {
            getItemDetail = sandbox.stub();
            getAllDeviceType = sandbox.stub();
            getAllBrand = sandbox.stub();
            getModels = sandbox.stub();
            handleMissingModel = sandbox.stub();
            getReviewHistory = sandbox.stub();

            renderAdminLayout = sandbox.spy();

            adminDevicesController = proxyquire('../../../controllers/admin/adminDevicesController', {
                '../../model/mongodb': {
                    getItemDetail,
                    getAllDeviceType,
                    getAllBrand,
                    getModels,
                    getReviewHistory
                },
                '../../util/layout/layoutUtils': {
                    renderAdminLayout
                },
                '../../public/javascripts/Emailing/emailing': {
                    email
                },
                '../../util/Devices/devices': {
                    handleMissingModel
                }
            });
        });

        it('normally should call renderAdminLayout with the correct parameters', async () => {
            // Arrange
            req.params = {
                id: faker.database.mongodbObjectId()
            };

            const item = generateFakeDevice();
            const deviceTypes = generateFakeDeviceTypes(5);
            const brands = generateFakeBrands(5);
            const models = generateFakeModels(5);

            getItemDetail.resolves(item);
            getAllDeviceType.resolves(deviceTypes);
            getAllBrand.resolves(brands);
            getModels.resolves(models);
            handleMissingModel.resolves();
            getReviewHistory.resolves([]);

            // Act
            await adminDevicesController.getUserDeviceDetailsPage(req, res, next);

            // Assert
            expect(renderAdminLayout.calledOnce).to.be.true;
            expect(renderAdminLayout.calledWith(req, res, 'edit_details', {
                item: item,
                deviceTypes: deviceTypes,
                brands: brands,
                models: models,
                specs: [],
                reviewHistory: [],
                roleTypes,
                historyType,
                dataService,
                deviceCategory,
                deviceState,
                colors: deviceColors,
                capacities: deviceCapacity,
                visibilityVisible: true
            })).to.be.true;
        });

        it('should call res.status with 500 and next with an error message when getItemDetail fails', async () => {
            // Arrange
            req.params = {
                id: faker.database.mongodbObjectId()
            };

            getItemDetail.rejects(new Error('An error occurred in getItemDetail'));

            // Act
            await adminDevicesController.getUserDeviceDetailsPage(req, res, next);

            // Assert
            expect(res.status.calledOnce).to.be.true;
            expect(res.status.calledWith(500)).to.be.true;
            expect(next.calledOnce).to.be.true;
        });

        it('should call res.status with 500 and next with an error message when getAllDeviceType fails', async () => {
            // Arrange
            req.params = {
                id: faker.database.mongodbObjectId()
            };

            const item = generateFakeDevice();

            getItemDetail.resolves(item);
            getAllDeviceType.rejects(new Error('An error occurred in getAllDeviceType'));

            // Act
            await adminDevicesController.getUserDeviceDetailsPage(req, res, next);

            // Assert
            expect(res.status.calledOnce).to.be.true;
            expect(res.status.calledWith(500)).to.be.true;
            expect(next.calledOnce).to.be.true;
        });

        it('should call res.status with 500 and next with an error message when getAllBrand fails', async () => {
            // Arrange
            req.params = {
                id: faker.database.mongodbObjectId()
            };

            const item = generateFakeDevice();
            const deviceTypes = generateFakeDeviceTypes(5);

            getItemDetail.resolves(item);
            getAllDeviceType.resolves(deviceTypes);
            getAllBrand.rejects(new Error('An error occurred in getAllBrand'));

            // Act
            await adminDevicesController.getUserDeviceDetailsPage(req, res, next);

            // Assert
            expect(res.status.calledOnce).to.be.true;
            expect(res.status.calledWith(500)).to.be.true;
            expect(next.calledOnce).to.be.true;
        });

        describe('Custom Models Tests', () => {
            it('should call rest.status with 500 and next with an error message when getModels fails', async () => {
                // Arrange
                req.params = {
                    id: faker.database.mongodbObjectId()
                };

                const item = generateFakeDevice();
                const deviceTypes = generateFakeDeviceTypes(5);
                const brands = generateFakeBrands(5);

                getItemDetail.resolves(item);
                getAllDeviceType.resolves(deviceTypes);
                getAllBrand.resolves(brands);
                getModels.rejects(new Error('An error occurred in getModels'));

                // Act
                await adminDevicesController.getUserDeviceDetailsPage(req, res, next);

                // Assert
                expect(res.status.calledOnce).to.be.true;
                expect(res.status.calledWith(500)).to.be.true;
                expect(next.calledOnce).to.be.true;
            });

            it('should call rest.status with 500 and next with an error message when handleMissingModel fails', async () => {
                // Arrange
                req.params = {
                    id: faker.database.mongodbObjectId()
                };

                const item = generateFakeDevice();
                const deviceTypes = generateFakeDeviceTypes(5);
                const brands = generateFakeBrands(5);
                const models = generateFakeModels(5);

                getItemDetail.resolves(item);
                getAllDeviceType.resolves(deviceTypes);
                getAllBrand.resolves(brands);
                getModels.resolves(models);
                handleMissingModel.rejects(new Error('An error occurred in handleMissingModel'));

                // Act
                await adminDevicesController.getUserDeviceDetailsPage(req, res, next);

                // Assert
                expect(res.status.calledOnce).to.be.true;
                expect(res.status.calledWith(500)).to.be.true;
                expect(next.calledOnce).to.be.true;
            });
        });

        it('should call res.status with 500 and next with an error message when getReviewHistory fails', async () => {
            // Arrange
            req.params = {
                id: faker.database.mongodbObjectId()
            };

            const item = generateFakeDevice();
            const deviceTypes = generateFakeDeviceTypes(5);
            const brands = generateFakeBrands(5);
            const models = generateFakeModels(5);

            getItemDetail.resolves(item);
            getAllDeviceType.resolves(deviceTypes);
            getAllBrand.resolves(brands);
            getModels.resolves(models);
            handleMissingModel.resolves();
            getReviewHistory.rejects(new Error('An error occurred in getReviewHistory'));

            // Act
            await adminDevicesController.getUserDeviceDetailsPage(req, res, next);

            // Assert
            expect(res.status.calledOnce).to.be.true;
            expect(res.status.calledWith(500)).to.be.true;
            expect(next.calledOnce).to.be.true;
        });
    });

    describe('Test getModelsFromTypeAndBrand', () => {
        beforeEach(() => {
            getModels = sandbox.stub();

            adminDevicesController = proxyquire('../../../controllers/admin/adminDevicesController', {
                '../../model/mongodb': {
                    getModels
                }
            });
        });

        it('should return a 200 status code and a JSON object with the correct data when getModelsFromTypeAndBrand is successful', async () => {
            // Arrange
            req.body = {
                deviceType: faker.database.mongodbObjectId(),
                deviceBrand: faker.database.mongodbObjectId()
            };

            const models = generateFakeModels(5);

            getModels.resolves(models);

            // Act
            await adminDevicesController.getModelsFromTypeAndBrand(req, res, next);

            // Assert
            expect(res.json.calledOnce).to.be.true;
            expect(res.json.calledWith({models})).to.be.true;
        });

        it('should call res.status with 500 and json with an error message when getModelsFromTypeAndBrand throws an error', async () => {
            // Arrange
            req.body = {
                deviceType: faker.database.mongodbObjectId(),
                deviceBrand: faker.database.mongodbObjectId()
            };

            getModels.rejects(new Error('An error occurred in getModelsFromTypeAndBrand'));

            // Act
            await adminDevicesController.getModelsFromTypeAndBrand(req, res, next);

            // Assert
            expect(res.status.calledOnce).to.be.true;
            expect(res.status.calledWith(500)).to.be.true;
            expect(res.json.calledOnce).to.be.true;
            expect(res.json.calledWith({error: 'internal server error'})).to.be.true;
        });

        it('should return a 400 status code when the body is empty', async () => {
            // Arrange
            req.body = {};

            // Act
            await adminDevicesController.getModelsFromTypeAndBrand(req, res, next);

            // Assert
            expect(res.status.calledOnce).to.be.true;
            expect(res.status.calledWith(400)).to.be.true;
            expect(res.json.calledOnce).to.be.true;
        });

        it('should return a 400 status code when the body is missing the deviceType field', async () => {
            // Arrange
            req.body = {
                deviceBrand: faker.database.mongodbObjectId()
            };

            // Act
            await adminDevicesController.getModelsFromTypeAndBrand(req, res, next);

            // Assert
            expect(res.status.calledOnce).to.be.true;
            expect(res.status.calledWith(400)).to.be.true;
            expect(res.json.calledOnce).to.be.true;
        });

        it('should return a 400 status code when the body is missing the deviceBrand field', async () => {
            // Arrange
            req.body = {
                deviceType: faker.database.mongodbObjectId()
            };

            // Act
            await adminDevicesController.getModelsFromTypeAndBrand(req, res, next);

            // Assert
            expect(res.status.calledOnce).to.be.true;
            expect(res.status.calledWith(400)).to.be.true;
            expect(res.json.calledOnce).to.be.true;
        });
    });

    describe('Test updateUserDeviceDetailsPage', () => {
        beforeEach(() => {
            updateDeviceDetails = sandbox.stub();

            adminDevicesController = proxyquire('../../../controllers/admin/adminDevicesController', {
                '../../model/mongodb': {
                    updateDeviceDetails
                }
            });
        });

        it('should return a 200 status code and the item ID when updateItemDetails is successful', async () => {
            // Arrange
            req.params = {
                id: faker.database.mongodbObjectId()
            };

            req.body = {
                color: 'Black',
                capacity: '64GB',
            }

            updateDeviceDetails.resolves({_id: req.params.id});

            // Act
            await adminDevicesController.updateUserDeviceDetailsPage(req, res, next);

            // Assert
            expect(res.status.calledOnce).to.be.true;
            expect(res.status.calledWith(200)).to.be.true;
            expect(res.send.calledOnce).to.be.true;
            expect(res.send.calledWith(req.params.id)).to.be.true;
        });

        it('should call res.status with 500 with an error message when updateDeviceDetails throws an error', async () => {
            // Arrange
            req.params = {
                id: faker.database.mongodbObjectId()
            };

            req.body = {
                color: 'Black',
                capacity: '64GB',
            }

            updateDeviceDetails.rejects(new Error('An error occurred in updateDeviceDetails'));

            // Act
            await adminDevicesController.updateUserDeviceDetailsPage(req, res, next);

            // Assert
            expect(res.status.calledOnce).to.be.true;
            expect(res.status.calledWith(500)).to.be.true;
            expect(res.send.calledOnce).to.be.true;
            expect(res.send.calledWith('Internal Server Error')).to.be.true;
        });

        it('should return a 400 status code when the body is empty', async () => {
            // Arrange
            req.params = {
                id: faker.database.mongodbObjectId()
            };

            req.body = {};

            // Act
            await adminDevicesController.updateUserDeviceDetailsPage(req, res, next);

            // Assert
            expect(res.status.calledOnce).to.be.true;
            expect(res.status.calledWith(400)).to.be.true;
            expect(res.send.calledOnce).to.be.true;
        });
    });

    describe('Test postDevicePromotion', () => {
        beforeEach(() => {
            addHistory = sandbox.stub();
            getReviewHistory = sandbox.stub();

            adminDevicesController = proxyquire('../../../controllers/admin/adminDevicesController', {
                '../../model/mongodb': {
                    addHistory,
                    getReviewHistory
                }
            });
        });

        it('should return a 200 status code and the correct message when the device is successfully promoted', async () => {
            // Arrange
            req.device = generateFakeDevice(faker.database.mongodbObjectId(), deviceState.DRAFT);

            req.device.save = sandbox.stub();
            req.device.save.resolves();

            // Act
            await adminDevicesController.postDevicePromotion(req, res, next);

            // Assert
            expect(req.device.save.calledOnce).to.be.true;
            expect(res.status.calledOnce).to.be.true;
            expect(res.status.calledWith(200)).to.be.true;
            expect(res.send.calledOnce).to.be.true;
            expect(res.send.calledWith('Device promoted successfully')).to.be.true;
        });

        it('should not change the state of the device if the new state is not a valid state', async () => {
            // Arrange
            req.device = generateFakeDevice(faker.database.mongodbObjectId(), -1);

            req.device.save = sandbox.stub();
            req.device.save.resolves();

            // Act
            await adminDevicesController.postDevicePromotion(req, res, next);

            // Assert
            expect(req.device.save.calledOnce).to.be.true;
            expect(req.device.state).to.equal(-1);
            expect(res.status.calledOnce).to.be.true;
            expect(res.status.calledWith(200)).to.be.true;
            expect(res.send.calledOnce).to.be.true;
        });

        it('should call res.status with 500 with an error message when an error occurs', async () => {
            // Arrange
            req.device = generateFakeDevice(faker.database.mongodbObjectId(), deviceState.DRAFT);

            req.device.save = sandbox.stub();
            req.device.save.rejects(new Error('An error occurred in save'));

            // Act
            await adminDevicesController.postDevicePromotion(req, res, next);

            // Assert
            expect(req.device.save.calledOnce).to.be.true;
            expect(res.status.calledOnce).to.be.true;
            expect(res.status.calledWith(500)).to.be.true;
            expect(res.send.calledOnce).to.be.true;
        });

        it('should call addHistory once if the device is moved to the REJECTED state', async () => {
            // Arrange
            req.device = generateFakeDevice(faker.database.mongodbObjectId(), deviceState.REJECTED);

            req.user = {
                id: faker.database.mongodbObjectId()
            }

            req.device.save = sandbox.stub();
            req.device.save.resolves();

            addHistory.resolves();

            // Act
            await adminDevicesController.postDevicePromotion(req, res, next);

            // Assert
            expect(req.device.save.calledOnce).to.be.true;
            expect(req.device.state).to.equal(deviceState.REJECTED);
            expect(addHistory.calledOnce).to.be.true;
        });

        describe('Test LISTED state', () => {
            it('should call addHistory once if the device is moved to the LISTED state, and does not have an open review', async () => {
                //Also check for item.visible=true
                // Arrange
                req.device = generateFakeDevice(faker.database.mongodbObjectId(), deviceState.IN_REVIEW);

                req.user = {
                    id: faker.database.mongodbObjectId()
                }

                req.device.save = sandbox.stub();
                req.device.save.resolves();

                addHistory.resolves();
                getReviewHistory.resolves([]);

                // Act
                await adminDevicesController.postDevicePromotion(req, res, next);

                // Assert
                expect(req.device.save.calledOnce).to.be.true;
                expect(req.device.state).to.equal(deviceState.LISTED);
                expect(req.device.visible).to.be.true;
                expect(addHistory.calledOnce).to.be.true;
            });

            it('should call addHistory twice if the device is moved to the LISTED state, and has an open review', async () => {
                //Also check for item.visible=true
                // Arrange
                req.device = generateFakeDevice(faker.database.mongodbObjectId(), deviceState.IN_REVIEW);

                req.user = {
                    id: faker.database.mongodbObjectId()
                }

                req.device.save = sandbox.stub();
                req.device.save.resolves();

                addHistory.resolves();
                getReviewHistory.resolves([{
                    history_type: historyType.REVIEW_REQUESTED,
                }]);

                // Act
                await adminDevicesController.postDevicePromotion(req, res, next);

                // Assert
                expect(req.device.save.calledOnce).to.be.true;
                expect(req.device.state).to.equal(deviceState.LISTED);
                expect(req.device.visible).to.be.true;
                expect(addHistory.calledTwice).to.be.true;
            });
        });

        describe('Test HIDDEN state', () => {
            it('should call addHistory once if the device is moved to the HIDDEN state', async () => {
                //Also check for item.visible=false
                // Arrange
                req.device = generateFakeDevice(faker.database.mongodbObjectId(), deviceState.HIDDEN);

                req.user = {
                    id: faker.database.mongodbObjectId()
                }

                req.device.save = sandbox.stub();
                req.device.save.resolves();

                addHistory.resolves();

                // Act
                await adminDevicesController.postDevicePromotion(req, res, next);

                // Assert
                expect(req.device.save.calledOnce).to.be.true;
                expect(req.device.state).to.equal(deviceState.HIDDEN);
                expect(req.device.visible).to.be.false;
                expect(addHistory.calledOnce).to.be.true;
            });
        });
    });

    describe('Test postDeviceDemotion', () => {
        beforeEach(() => {
            addHistory = sandbox.stub();
            getReviewHistory = sandbox.stub();

            adminDevicesController = proxyquire('../../../controllers/admin/adminDevicesController', {
                '../../model/mongodb': {
                    addHistory,
                    getReviewHistory
                }
            });
        });

        it('should return a 200 status code and the correct message when the device is successfully promoted', async () => {
            // Arrange
            req.device = generateFakeDevice(faker.database.mongodbObjectId(), deviceState.DRAFT);

            req.device.save = sandbox.stub();
            req.device.save.resolves();

            // Act
            await adminDevicesController.postDeviceDemotion(req, res, next);

            // Assert
            expect(req.device.save.calledOnce).to.be.true;
            expect(res.status.calledOnce).to.be.true;
            expect(res.status.calledWith(200)).to.be.true;
            expect(res.send.calledOnce).to.be.true;
            expect(res.send.calledWith('Device demoted successfully')).to.be.true;
        });

        it('should not change the state of the device if the new state is not a valid state', async () => {
            // Arrange
            req.device = generateFakeDevice(faker.database.mongodbObjectId(), -1);

            req.device.save = sandbox.stub();
            req.device.save.resolves();

            // Act
            await adminDevicesController.postDeviceDemotion(req, res, next);

            // Assert
            expect(req.device.save.calledOnce).to.be.true;
            expect(req.device.state).to.equal(-1);
            expect(res.status.calledOnce).to.be.true;
            expect(res.status.calledWith(200)).to.be.true;
            expect(res.send.calledOnce).to.be.true;
        });

        it('should call res.status with 500 with an error message when an error occurs', async () => {
            // Arrange
            req.device = generateFakeDevice(faker.database.mongodbObjectId(), deviceState.DRAFT);

            req.device.save = sandbox.stub();
            req.device.save.rejects(new Error('An error occurred in save'));

            // Act
            await adminDevicesController.postDeviceDemotion(req, res, next);

            // Assert
            expect(req.device.save.calledOnce).to.be.true;
            expect(res.status.calledOnce).to.be.true;
            expect(res.status.calledWith(500)).to.be.true;
            expect(res.send.calledOnce).to.be.true;
        });

        it('should call addHistory once if the device is moved to the REJECTED state', async () => {
            // Arrange
            req.device = generateFakeDevice(faker.database.mongodbObjectId(), deviceState.REJECTED);

            req.user = {
                id: faker.database.mongodbObjectId()
            }

            req.device.save = sandbox.stub();
            req.device.save.resolves();

            addHistory.resolves();

            // Act
            await adminDevicesController.postDeviceDemotion(req, res, next);

            // Assert
            expect(req.device.save.calledOnce).to.be.true;
            expect(req.device.state).to.equal(deviceState.REJECTED);
            expect(addHistory.calledOnce).to.be.true;
        });

        describe('Test HIDDEN state', () => {
            beforeEach(() => {
                addHistory = sandbox.stub();
                getReviewHistory = sandbox.stub();

                adminDevicesController = proxyquire('../../../controllers/admin/adminDevicesController', {
                    '../../model/mongodb': {
                        addHistory,
                        getReviewHistory
                    }
                });
            });

            it('should call addHistory once if the device is moved to the HIDDEN state', async () => {
                //Also check for item.visible=false
                // Arrange
                req.device = generateFakeDevice(faker.database.mongodbObjectId(), deviceState.HIDDEN);

                req.user = {
                    id: faker.database.mongodbObjectId()
                }

                req.device.save = sandbox.stub();
                req.device.save.resolves();

                addHistory.resolves();

                // Act
                await adminDevicesController.postDeviceDemotion(req, res, next);

                // Assert
                expect(req.device.save.calledOnce).to.be.true;
                expect(req.device.state).to.equal(deviceState.HIDDEN);
                expect(req.device.visible).to.be.false;
                expect(addHistory.calledOnce).to.be.true;
            });
        });
    });

    describe('Test postDeviceStateOverride', () => {
        beforeEach(() => {
            addHistory = sandbox.stub();
            getReviewHistory = sandbox.stub();

            adminDevicesController = proxyquire('../../../controllers/admin/adminDevicesController', {
                '../../model/mongodb': {
                    addHistory,
                    getReviewHistory
                }
            });
        });

        it('should return a 200 status code and the correct message when the device state is successfully overridden', async () => {
            // Arrange
            req.device = generateFakeDevice(faker.database.mongodbObjectId(), deviceState.DRAFT);

            req.body = {
                state: deviceState.IN_REVIEW
            }

            req.device.save = sandbox.stub();
            req.device.save.resolves();

            // Act
            await adminDevicesController.postDeviceStateOverride(req, res, next);

            // Assert
            expect(req.device.save.calledOnce).to.be.true;
            expect(res.status.calledOnce).to.be.true;
            expect(res.status.calledWith(200)).to.be.true;
            expect(res.send.calledOnce).to.be.true;
            expect(res.send.calledWith('Device state overridden successfully')).to.be.true;
        });

        it('should call res.status with 500 with an error message when an error occurs', async () => {
            // Arrange
            req.device = generateFakeDevice(faker.database.mongodbObjectId(), deviceState.DRAFT);

            req.body = {
                state: deviceState.IN_REVIEW
            }

            req.device.save = sandbox.stub();
            req.device.save.rejects(new Error('An error occurred in save'));

            // Act
            await adminDevicesController.postDeviceStateOverride(req, res, next);

            // Assert
            expect(req.device.save.calledOnce).to.be.true;
            expect(res.status.calledOnce).to.be.true;
            expect(res.status.calledWith(500)).to.be.true;
            expect(res.send.calledOnce).to.be.true;
        });

        it('should return a 400 status code when the body is empty', async () => {
            // Arrange
            req.body = {};

            // Act
            await adminDevicesController.postDeviceStateOverride(req, res, next);

            // Assert
            expect(res.status.calledOnce).to.be.true;
            expect(res.status.calledWith(400)).to.be.true;
            expect(res.send.calledOnce).to.be.true;
        });

        it('should return a 400 status code when the body is missing the state field', async () => {
            // Arrange
            req.body = {
                id: faker.database.mongodbObjectId()
            }

            // Act
            await adminDevicesController.postDeviceStateOverride(req, res, next);

            // Assert
            expect(res.status.calledOnce).to.be.true;
            expect(res.status.calledWith(400)).to.be.true;
            expect(res.send.calledOnce).to.be.true;
        });

        describe('Test LISTED state', () => {
            it('should call addHistory once if the device is moved to the LISTED state, and does not have an open review', async () => {
                //Also check for item.visible=true
                // Arrange
                req.device = generateFakeDevice(faker.database.mongodbObjectId(), deviceState.IN_REVIEW);

                req.user = {
                    id: faker.database.mongodbObjectId()
                }

                req.body = {
                    state: deviceState.LISTED
                }

                req.device.save = sandbox.stub();
                req.device.save.resolves();

                addHistory.resolves();
                getReviewHistory.resolves([]);

                // Act
                await adminDevicesController.postDeviceStateOverride(req, res, next);

                // Assert
                expect(req.device.save.calledOnce).to.be.true;
                expect(req.device.state).to.equal(deviceState.LISTED);
                expect(req.device.visible).to.be.true;
                expect(addHistory.calledOnce).to.be.true;
            });

            it('should call addHistory twice if the device is moved to the LISTED state, and has an open review', async () => {
                //Also check for item.visible=true
                // Arrange
                req.device = generateFakeDevice(faker.database.mongodbObjectId(), deviceState.IN_REVIEW);

                req.user = {
                    id: faker.database.mongodbObjectId()
                }

                req.body = {
                    state: deviceState.LISTED
                }

                req.device.save = sandbox.stub();
                req.device.save.resolves();

                addHistory.resolves();
                getReviewHistory.resolves([{
                    history_type: historyType.REVIEW_REQUESTED,
                }]);

                // Act
                await adminDevicesController.postDeviceStateOverride(req, res, next);

                // Assert
                expect(req.device.save.calledOnce).to.be.true;
                expect(req.device.state).to.equal(deviceState.LISTED);
                expect(req.device.visible).to.be.true;
                expect(addHistory.calledTwice).to.be.true;
            });
        });

        describe('Test HIDDEN state', () => {
            it('should call addHistory once if the device is moved to the HIDDEN state', async () => {
                //Also check for item.visible=false
                // Arrange
                req.device = generateFakeDevice(faker.database.mongodbObjectId(), deviceState.LISTED);

                req.user = {
                    id: faker.database.mongodbObjectId()
                }

                req.body = {
                    state: deviceState.HIDDEN
                }

                req.device.save = sandbox.stub();
                req.device.save.resolves();

                addHistory.resolves();

                // Act
                await adminDevicesController.postDeviceStateOverride(req, res, next);

                // Assert
                expect(req.device.save.calledOnce).to.be.true;
                expect(req.device.state).to.equal(deviceState.HIDDEN);
                expect(req.device.visible).to.be.false;
                expect(addHistory.calledOnce).to.be.true;
            });
        });

        describe('Test REJECTED state', () => {
            it('should call addHistory once if the device is moved to the REJECTED state', async () => {
                // Arrange
                req.device = generateFakeDevice(faker.database.mongodbObjectId(), deviceState.IN_REVIEW);

                req.user = {
                    id: faker.database.mongodbObjectId()
                }

                req.body = {
                    state: deviceState.REJECTED
                }

                req.device.save = sandbox.stub();
                req.device.save.resolves();

                addHistory.resolves();

                // Act
                await adminDevicesController.postDeviceStateOverride(req, res, next);

                // Assert
                expect(req.device.save.calledOnce).to.be.true;
                expect(req.device.state).to.equal(deviceState.REJECTED);
                expect(addHistory.calledOnce).to.be.true;
            });
        });
    });

    describe('Test postDeviceChangeRequest', () => {
        beforeEach(() => {
            addHistory = sandbox.stub();
            email = sandbox.stub();

            adminDevicesController = proxyquire('../../../controllers/admin/adminDevicesController', {
                '../../model/mongodb': {
                    addHistory
                },
                '../../public/javascripts/Emailing/emailing': {
                    email
                }
            });
        });

        it('should return a 200 status code and the correct message if the request is successful', async () => {
            // Arrange
            req.device = generateFakeDevice(faker.database.mongodbObjectId(), deviceState.LISTED);

            req.body = {
                reason: 'This is a test change request'
            }

            req.user = {
                id: faker.database.mongodbObjectId()
            }

            addHistory.resolves();
            email.resolves();

            // Act
            await adminDevicesController.postDeviceChangeRequest(req, res, next);

            // Assert
            expect(res.status.calledOnce).to.be.true;
            expect(res.status.calledWith(200)).to.be.true;
            expect(res.send.calledOnce).to.be.true;
            expect(addHistory.calledOnce).to.be.true;
            expect(email.calledOnce).to.be.true;
        });

        it('should call res.status with 500 with an error message when an error occurs', async () => {
            // Arrange
            req.device = generateFakeDevice(faker.database.mongodbObjectId(), deviceState.LISTED);

            req.body = {
                reason: 'This is a test change request'
            }

            req.user = {
                id: faker.database.mongodbObjectId()
            }

            addHistory.rejects(new Error('An error occurred in addHistory'));

            // Act
            await adminDevicesController.postDeviceChangeRequest(req, res, next);

            // Assert
            expect(res.status.calledOnce).to.be.true;
            expect(res.status.calledWith(500)).to.be.true;
            expect(res.send.calledOnce).to.be.true;
        });

        it('should return a 400 status code when the body is empty', async () => {
            // Arrange
            req.device = generateFakeDevice(faker.database.mongodbObjectId(), deviceState.LISTED);

            req.body = {};

            // Act
            await adminDevicesController.postDeviceChangeRequest(req, res, next);

            // Assert
            expect(res.status.calledOnce).to.be.true;
            expect(res.status.calledWith(400)).to.be.true;
            expect(res.send.calledOnce).to.be.true;
        });

        it('should return a 400 status code when the body is missing the reason field', async () => {
            // Arrange
            req.device = generateFakeDevice(faker.database.mongodbObjectId(), deviceState.LISTED);

            req.body = {};

            // Act
            await adminDevicesController.postDeviceChangeRequest(req, res, next);

            // Assert
            expect(res.status.calledOnce).to.be.true;
            expect(res.status.calledWith(400)).to.be.true;
            expect(res.send.calledOnce).to.be.true;
        });
    });

    describe('Test postDeviceVisibility', () => {
        beforeEach(() => {
            addHistory = sandbox.stub();

            adminDevicesController = proxyquire('../../../controllers/admin/adminDevicesController', {
                '../../model/mongodb': {
                    addHistory
                }
            });
        });

        it('should return a 200 status code and the correct message if the request is successful', async () => {
            // Arrange
            req.device = generateFakeDevice(faker.database.mongodbObjectId(), deviceState.LISTED);

            req.device.save = sandbox.stub();
            req.device.save.resolves();

            req.body = {
                visible: 'true'
            }

            req.user = {
                id: faker.database.mongodbObjectId()
            }

            addHistory.resolves();

            // Act
            await adminDevicesController.postDeviceVisibility(req, res, next);

            // Assert
            expect(res.status.calledOnce).to.be.true;
            expect(res.status.calledWith(200)).to.be.true;
            expect(res.send.calledOnce).to.be.true;
            expect(addHistory.calledOnce).to.be.true;
            expect(req.device.save.calledOnce).to.be.true;
            expect(req.device.visible).to.be.true;
            expect(addHistory.calledWith(match.any, match(historyType.ITEM_UNHIDDEN), match.any, match.any)).to.be.true;
        });

        it('should call res.status with 500 and next with an error message when an error occurs', async () => {
            // Arrange
            req.device = generateFakeDevice(faker.database.mongodbObjectId(), deviceState.LISTED);

            req.device.save = sandbox.stub();
            req.device.save.rejects(new Error('An error occurred in save'));

            req.body = {
                visible: 'true'
            }

            req.user = {
                id: faker.database.mongodbObjectId()
            }

            // Act
            await adminDevicesController.postDeviceVisibility(req, res, next);

            // Assert
            expect(res.status.calledOnce).to.be.true;
            expect(res.status.calledWith(500)).to.be.true;
            expect(res.send.calledOnce).to.be.true;
        });

        it('should return a 400 status code when the body is missing the visibility field', async () => {
            // Arrange
            req.device = generateFakeDevice(faker.database.mongodbObjectId(), deviceState.LISTED);

            req.body = {};

            req.user = {
                id: faker.database.mongodbObjectId()
            }

            // Act
            await adminDevicesController.postDeviceVisibility(req, res, next);

            // Assert
            expect(res.status.calledOnce).to.be.true;
            expect(res.status.calledWith(400)).to.be.true;
            expect(res.send.calledOnce).to.be.true;
        });

        it('should call addHistory once if the device is set to not visible', async () => {
            // Arrange
            req.device = generateFakeDevice(faker.database.mongodbObjectId(), deviceState.LISTED);

            req.device.save = sandbox.stub();
            req.device.save.resolves();

            req.body = {
                visible: 'false'
            }

            req.user = {
                id: faker.database.mongodbObjectId()
            }

            addHistory.resolves();

            // Act
            await adminDevicesController.postDeviceVisibility(req, res, next);

            // Assert
            expect(res.status.calledOnce).to.be.true;
            expect(res.status.calledWith(200)).to.be.true;
            expect(res.send.calledOnce).to.be.true;
            expect(addHistory.calledOnce).to.be.true;
            expect(req.device.save.calledOnce).to.be.true;
            expect(req.device.visible).to.be.false;
            expect(addHistory.calledWith(match.any, match(historyType.ITEM_HIDDEN), match.any, match.any)).to.be.true;
        });

        it('should call addHistory once if the device is set to visible', async () => {
            // Arrange
            req.device = generateFakeDevice(faker.database.mongodbObjectId(), deviceState.HIDDEN);

            req.device.save = sandbox.stub();
            req.device.save.resolves();

            req.body = {
                visible: 'true'
            }

            req.user = {
                id: faker.database.mongodbObjectId()
            }

            addHistory.resolves();

            // Act
            await adminDevicesController.postDeviceVisibility(req, res, next);

            // Assert
            expect(res.status.calledOnce).to.be.true;
            expect(res.status.calledWith(200)).to.be.true;
            expect(res.send.calledOnce).to.be.true;
            expect(addHistory.calledOnce).to.be.true;
            expect(req.device.save.calledOnce).to.be.true;
            expect(req.device.visible).to.be.true;
            expect(addHistory.calledWith(match.any, match(historyType.ITEM_UNHIDDEN), match.any, match.any)).to.be.true;
        });
    });
});