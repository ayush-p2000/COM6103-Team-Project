const {expect} = require("chai");
const proxyquire = require('proxyquire');
const {faker} = require("@faker-js/faker");
const {
    mockRequest,
    mockResponse
} = require("mock-req-res");
const {generateFakeDevice} = require("../../mocks/device");
const retrievalState = require("../../../model/enum/retrievalState");
const dataTypes = require("../../../model/enum/dataTypes");
const {generateFakeRetrieval,
    generateFakeFile,
    generateFakeFiles
} = require("../../mocks/retrieval");
const {generateFakeModel} = require("../../mocks/model");

const sandbox = require('sinon').createSandbox();

let getItemDetail = sandbox.stub();
let getRetrievalObjectByDeviceId = sandbox.stub();
let deleteRetrieval = sandbox.stub();

let renderAdminLayout = sandbox.spy();
let renderAdminLayoutPlaceholder = sandbox.spy();
let renderUserLayout = sandbox.spy();

let dataRetrievalController;

let req = {}, res = {}, next = sandbox.spy();

describe('Test Data Retrieval Controller', () => {
    /*
     * A lot of the retrieval validation in this controller is delegated to middleware, so that will be tested separately.
     */

    beforeEach(() => {
        req = mockRequest();
        res = mockResponse();

        req.session = {};

        next = sandbox.spy();
    })

    describe('Test getItemDataRetrieval', () => {
        beforeEach(() => {
            getItemDetail = sandbox.stub();
            getRetrievalObjectByDeviceId = sandbox.stub();

            dataRetrievalController = proxyquire("../../../controllers/retrieval/dataRetrievalController", {
                '../../model/mongodb': {
                    getItemDetail,
                    getRetrievalObjectByDeviceId
                },
                '../../util/layout/layoutUtils': {
                    renderAdminLayout,
                    renderAdminLayoutPlaceholder,
                    renderUserLayout
                }
            });
        });

        it('should render the user layout when a valid set of data is provided', async () => {
            // Arrange
            req.params = {
                device_id: "1234"
            }

            req.isLoggedIn = true;

            req.user = {
                id: "1234"
            }

            const device = generateFakeDevice();
            const retrievalObject = generateFakeRetrieval();

            getItemDetail.resolves(device);
            getRetrievalObjectByDeviceId.resolves(retrievalObject);

            // Act
            await dataRetrievalController.getItemDataRetrieval(req, res, next);

            // Assert
            expect(renderUserLayout.calledOnce).to.be.true;
            expect(renderUserLayout.calledWith(req, res, '../retrieval/data_retrieval_user', {
                device: device,
                retrieval: retrievalObject,
                auth: req.isLoggedIn,
                user: req.user,
                retrievalState,
                dataTypes
            })).to.be.true;
        });

        it('should return a 404 status and call next when the retrieval does not exist', async () => {
            // Arrange
            req.params = {
                device_id: "1234"
            }

            req.isLoggedIn = true;

            req.user = {
                id: "1234"
            }

            const device = generateFakeDevice();

            getItemDetail.resolves(device);
            getRetrievalObjectByDeviceId.resolves(null);

            // Act
            await dataRetrievalController.getItemDataRetrieval(req, res, next);

            // Assert
            expect(res.status.calledOnce).to.be.true;
            expect(res.status.calledWith(404)).to.be.true;
            expect(next.calledOnce).to.be.true;
        });

        it('should return a 500 status and call next when an error occurs', async () => {
            // Arrange
            req.params = {
                device_id: "1234"
            }

            req.isLoggedIn = true;

            req.user = {
                id: "1234"
            }

            const device = generateFakeDevice();

            getItemDetail.rejects(new Error("An error occurred"));

            // Act
            await dataRetrievalController.getItemDataRetrieval(req, res, next);

            // Assert
            expect(res.status.calledOnce).to.be.true;
            expect(res.status.calledWith(500)).to.be.true;
            expect(next.calledOnce).to.be.true;
        });
    });

    describe('Test getRetrievalDownload', () => {
        it('should return a zip file when a valid set of data is provided', async () => {
            // Arrange
            req.retrieval = generateFakeRetrieval(faker.database.mongodbObjectId(), retrievalState.AVAILABLE_FOR_RETREIVAL);
            req.retrieval.device.model = generateFakeModel();

            // Mock the pipe function
            res.on = sandbox.stub();
            res.once = sandbox.stub();
            res.emit = sandbox.stub();
            res.write = sandbox.stub();
            res.on.returns();
            res.once.returns();
            res.emit.returns();
            res.write.returns();

            // Act
            await dataRetrievalController.getRetrievalDownload(req, res, next);

            // Assert
            // The output is a zip file piped to the response so we can't really check the output
            // We can check that the correct headers are set
            //Expect the content-type to be set to application/zip
            expect(res.setHeader.calledWith('Content-type', 'application/zip')).to.be.true;
            //Expect the content-disposition to be set to attachment; filename=${retrievalObject.device?.model?.name}_${retrievalObject._id}.zip
            expect(res.setHeader.calledWith('Content-disposition', `attachment; filename=${req.retrieval.device.model.name}_${req.retrieval._id}.zip`)).to.be.true;
        });

        it('should return a 404 status and call next if the retrieval is expired, or there is no data to download', async () => {
            // Arrange
            req.retrieval = generateFakeRetrieval(faker.database.mongodbObjectId(), retrievalState.RETRIEVAL_EXPIRED);

            // Mock the pipe function
            res.on = sandbox.stub();
            res.once = sandbox.stub();
            res.emit = sandbox.stub();
            res.write = sandbox.stub();
            res.on.returns();
            res.once.returns();
            res.emit.returns();
            res.write.returns();

            // Act
            await dataRetrievalController.getRetrievalDownload(req, res, next);

            // Assert
            expect(res.status.calledWith(404)).to.be.true;
            expect(next.calledOnce).to.be.true;
        });

        it('should return a 500 status and call next when an error occurs', async () => {
            // Arrange
            req.retrieval = generateFakeRetrieval(faker.database.mongodbObjectId(), retrievalState.AVAILABLE_FOR_RETREIVAL);

            // Mock the pipe function
            // Mock the pipe function
            res.on = sandbox.stub();
            res.once = sandbox.stub();
            res.emit = sandbox.stub();
            res.write = sandbox.stub();
            res.on.returns();
            res.once.returns();
            res.emit.returns();
            res.write.returns();
            res.setHeader = sandbox.stub();
            res.setHeader.throws(new Error("An error occurred"));

            // Act
            await dataRetrievalController.getRetrievalDownload(req, res, next);

            // Assert
            expect(res.status.calledWith(500)).to.be.true;
            expect(next.calledOnce).to.be.true;
        });
    });

    describe('Test getFilePage', () => {
        it('should render the file view when a valid set of data is provided', async () => {
            // Arrange
            req.params = {
                file_id: "1234"
            }

            req.isLoggedIn = true;

            req.user = {
                id: "1234"
            }

            req.retrieval = generateFakeRetrieval(faker.database.mongodbObjectId(), retrievalState.AVAILABLE_FOR_RETREIVAL);
            req.retrieval.data[0]._id = "1234";

            // Act
            await dataRetrievalController.getFilePage(req, res, next);

            // Assert
            expect(res.render.calledOnce).to.be.true;
            expect(res.render.calledWith('retrieval/file_view', {
                file: req.retrieval.data[0],
                retrieval: req.retrieval,
                auth: req.isLoggedIn,
                user: req.user,
                dataTypes
            })).to.be.true;
        });

        it('should return a 404 status and call next when the file does not exist', async () => {
            // Arrange
            req.params = {
                file_id: "12345"
            }

            req.isLoggedIn = true;

            req.user = {
                id: "1234"
            }

            req.retrieval = generateFakeRetrieval(faker.database.mongodbObjectId(), retrievalState.AVAILABLE_FOR_RETREIVAL);
            req.retrieval.data[0]._id = "1234";

            // Act
            await dataRetrievalController.getFilePage(req, res, next);

            // Assert
            expect(res.status.calledOnce).to.be.true;
            expect(res.status.calledWith(404)).to.be.true;
            expect(next.calledOnce).to.be.true;
        });

        it('should return a 500 status and call next when an error occurs', async () => {
            // Arrange
            req.params = {
                file_id: "1234"
            }

            req.isLoggedIn = true;

            req.user = {
                id: "1234"
            }

            req.retrieval = generateFakeRetrieval(faker.database.mongodbObjectId(), retrievalState.AVAILABLE_FOR_RETREIVAL);
            req.retrieval.data[0]._id = "1234";
            req.retrieval.data.find = sandbox.stub();
            req.retrieval.data.find.throws(new Error("An error occurred"));

            // Act
            await dataRetrievalController.getFilePage(req, res, next);

            // Assert
            expect(res.status.calledOnce).to.be.true;
            expect(res.status.calledWith(500)).to.be.true;
            expect(next.calledOnce).to.be.true;
        });
    });

    describe('Test getFileDownload', () => {
        it('should return a file when a valid set of data is provided', async () => {
            // Arrange
            req.params = {
                file_id: "1234"
            }

            req.retrieval = generateFakeRetrieval(faker.database.mongodbObjectId(), retrievalState.AVAILABLE_FOR_RETREIVAL);

            req.retrieval.data[0] = generateFakeFile(dataTypes.IMAGE);
            req.retrieval.data[0]._id = "1234";

            // Act
            await dataRetrievalController.getFileDownload(req, res, next);

            // Assert
            expect(res.setHeader.calledWith('Content-disposition', `attachment; filename=${req.retrieval.data[0].name}`)).to.be.true;
            expect(res.setHeader.calledWith('Content-type', `${req.retrieval.data[0].value}`)).to.be.true;
            expect(res.send.calledOnce).to.be.true;
            expect(res.send.calledWith(req.retrieval.data[0].buffer)).to.be.true;
        });

        it('should return a 404 status and call next if the file does not exist', async () => {
            // Arrange
            req.params = {
                file_id: "12345"
            }

            req.retrieval = generateFakeRetrieval(faker.database.mongodbObjectId(), retrievalState.AVAILABLE_FOR_RETREIVAL);

            req.retrieval.data[0] = generateFakeFile(dataTypes.IMAGE);
            req.retrieval.data[0]._id = "1234";

            // Act
            await dataRetrievalController.getFileDownload(req, res, next);

            // Assert
            expect(res.status.calledWith(404)).to.be.true;
            expect(next.calledOnce).to.be.true;
        });

        it('should return a 500 status and call next when an error occurs', async () => {
            // Arrange
            req.params = {
                file_id: "1234"
            }

            req.retrieval = generateFakeRetrieval(faker.database.mongodbObjectId(), retrievalState.AVAILABLE_FOR_RETREIVAL);

            req.retrieval.data[0] = generateFakeFile(dataTypes.IMAGE);
            req.retrieval.data[0]._id = "1234";

            res.setHeader = sandbox.stub();
            res.setHeader.throws(new Error("An error occurred"));

            // Act
            await dataRetrievalController.getFileDownload(req, res, next);

            // Assert
            expect(res.status.calledWith(500)).to.be.true;
            expect(next.calledOnce).to.be.true;
        });
    });

    describe('Test deleteDataRetrieval', () => {
        beforeEach(() => {
            deleteRetrieval = sandbox.stub();

            dataRetrievalController = proxyquire("../../../controllers/retrieval/dataRetrievalController", {
                '../../model/mongodb': {
                    deleteRetrieval
                }
            });
        });

        it('should return a 200 status when a valid set of data is provided', async () => {
            // Arrange
            req.retrieval = generateFakeRetrieval(faker.database.mongodbObjectId(), retrievalState.AVAILABLE_FOR_RETREIVAL);

            deleteRetrieval.resolves();

            // Act
            await dataRetrievalController.deleteDataRetrieval(req, res, next);

            // Assert
            expect(res.status.calledOnce).to.be.true;
            expect(res.status.calledWith(200)).to.be.true;
            expect(res.send.calledOnce).to.be.true;

        });

        it('should return a 500 status when an error occurs', async () => {
            // Arrange
            req.retrieval = generateFakeRetrieval(faker.database.mongodbObjectId(), retrievalState.AVAILABLE_FOR_RETREIVAL);

            deleteRetrieval.rejects(new Error("An error occurred"));

            // Act
            await dataRetrievalController.deleteDataRetrieval(req, res, next);

            // Assert
            expect(res.status.calledOnce).to.be.true;
            expect(res.status.calledWith(500)).to.be.true;
            expect(res.send.calledOnce).to.be.true;
        });
    });

    describe('Test getRetrievalEditPage', () => {
        beforeEach(() => {
            getItemDetail = sandbox.stub();
            renderAdminLayout = sandbox.stub();

            dataRetrievalController = proxyquire("../../../controllers/retrieval/dataRetrievalController", {
                '../../model/mongodb': {
                    getItemDetail
                },
                '../../util/layout/layoutUtils': {
                    renderAdminLayout
                }
            });
        });

        it('should render the user layout when a valid set of data is provided', async () => {
            // Arrange
            req.params = {
                id : "1234"
            }
            req.isLoggedIn = true;
            req.user = {
                id: "1234"
            }
            req.retrieval = generateFakeRetrieval(faker.database.mongodbObjectId(), retrievalState.AVAILABLE_FOR_RETREIVAL);

            const device = generateFakeDevice();
            getItemDetail.resolves(device);

            // Act
            await dataRetrievalController.getRetrievalEditPage(req, res, next);

            // Assert
            expect(renderAdminLayout.calledOnce).to.be.true;
            expect(renderAdminLayout.calledWith(req, res, '../retrieval/data_retrieval_staff', {
                device: device,
                retrieval: req.retrieval,
                auth: req.isLoggedIn,
                user: req.user,
                retrievalState,
                dataTypes
            })).to.be.true;
        });

        it('should return a 500 status and call next when an error occurs', async () => {
            // Arrange
            req.params = {
                id : "1234"
            }
            req.isLoggedIn = true;
            req.user = {
                id: "1234"
            }
            req.retrieval = generateFakeRetrieval(faker.database.mongodbObjectId(), retrievalState.AVAILABLE_FOR_RETREIVAL);

            getItemDetail.rejects(new Error("An error occurred"));

            // Act
            await dataRetrievalController.getRetrievalEditPage(req, res, next);

            // Assert
            expect(res.status.calledOnce).to.be.true;
            expect(res.status.calledWith(500)).to.be.true;
            expect(next.calledOnce).to.be.true;
        });
    });

    describe('Test promoteRetrieval', () => {
        it('should return a 200 status when a valid set of data is provided', async () => {
            // Arrange
            req.retrieval = generateFakeRetrieval(faker.database.mongodbObjectId(), retrievalState.AVAILABLE_FOR_RETREIVAL);
            req.retrieval.save = sandbox.stub();
            req.retrieval.save.resolves();

            // Act
            await dataRetrievalController.promoteRetrieval(req, res, next);

            // Assert
            expect(res.status.calledWith(200)).to.be.true;
            expect(res.send.calledOnce).to.be.true;
            expect(req.retrieval.retrieval_state).to.equal(retrievalState.EXPIRING_SOON);
        });

        it('should return a 500 status when an error occurs', async () => {
            // Arrange
            req.retrieval = generateFakeRetrieval(faker.database.mongodbObjectId(), retrievalState.AVAILABLE_FOR_RETREIVAL);
            req.retrieval.save = sandbox.stub();
            req.retrieval.save.rejects(new Error("An error occurred"));

            // Act
            await dataRetrievalController.promoteRetrieval(req, res, next);

            // Assert
            expect(res.status.calledWith(500)).to.be.true;
            expect(res.send.calledOnce).to.be.true;
        });

        it('should not promote the retrieval if the new state is invalid', async () => {
            // Arrange
            req.retrieval = generateFakeRetrieval(faker.database.mongodbObjectId(), 185);
            req.retrieval.save = sandbox.stub();
            req.retrieval.save.resolves();

            // Act
            await dataRetrievalController.promoteRetrieval(req, res, next);

            // Assert
            expect(res.status.calledWith(200)).to.be.true;
            expect(res.send.calledOnce).to.be.true;
            expect(req.retrieval.retrieval_state).to.equal(185);
        });
    });

    describe('Test demoteRetrieval', () => {
        it('should return a 200 status when a valid set of data is provided', async () => {
            // Arrange
            req.retrieval = generateFakeRetrieval(faker.database.mongodbObjectId(), retrievalState.DEVICE_RECEIVED);
            req.retrieval.save = sandbox.stub();
            req.retrieval.save.resolves();

            // Act
            await dataRetrievalController.demoteRetrieval(req, res, next);

            // Assert
            expect(res.status.calledWith(200)).to.be.true;
            expect(res.send.calledOnce).to.be.true;
            expect(req.retrieval.retrieval_state).to.equal(retrievalState.AWAITING_DEVICE);
        });

        it('should return a 500 status when an error occurs', async () => {
            // Arrange
            req.retrieval = generateFakeRetrieval(faker.database.mongodbObjectId(), retrievalState.EXPIRING_SOON);
            req.retrieval.save = sandbox.stub();
            req.retrieval.save.rejects(new Error("An error occurred"));

            // Act
            await dataRetrievalController.demoteRetrieval(req, res, next);

            // Assert
            expect(res.status.calledWith(500)).to.be.true;
            expect(res.send.calledOnce).to.be.true;
        });

        it('should not demote the retrieval if the new state is invalid', async () => {
            // Arrange
            req.retrieval = generateFakeRetrieval(faker.database.mongodbObjectId(), 185);
            req.retrieval.save = sandbox.stub();
            req.retrieval.save.resolves();

            // Act
            await dataRetrievalController.demoteRetrieval(req, res, next);

            // Assert
            expect(res.status.calledWith(200)).to.be.true;
            expect(res.send.calledOnce).to.be.true;
            expect(req.retrieval.retrieval_state).to.equal(185);
        });
    });

    describe('Test errorStateHandler', () => {
        it('should return a 200 status when a valid set of data is provided', async () => {
            // Arrange
            req.body = {
                state: retrievalState.DATA_RECOVERY_CANCELLED
            }

            req.retrieval = generateFakeRetrieval(faker.database.mongodbObjectId(), retrievalState.AVAILABLE_FOR_RETREIVAL);
            req.retrieval.save = sandbox.stub();
            req.retrieval.save.resolves();

            // Act
            await dataRetrievalController.errorStateHandler(req, res, next);

            // Assert
            expect(res.status.calledWith(200)).to.be.true;
            expect(res.send.calledOnce).to.be.true;
            expect(req.retrieval.retrieval_state).to.equal(retrievalState.DATA_RECOVERY_CANCELLED);
        });

        it('should return a 500 status when an error occurs', async () => {
            // Arrange
            req.body = {
                state: retrievalState.DATA_RECOVERY_CANCELLED
            }

            req.retrieval = generateFakeRetrieval(faker.database.mongodbObjectId(), retrievalState.AVAILABLE_FOR_RETREIVAL);
            req.retrieval.save = sandbox.stub();
            req.retrieval.save.rejects(new Error("An error occurred"));

            // Act
            await dataRetrievalController.errorStateHandler(req, res, next);

            // Assert
            expect(res.status.calledWith(500)).to.be.true;
            expect(res.send.calledOnce).to.be.true;
        });

        it('should return a 400 status when the state is not provided', async () => {
            // Arrange
            req.body = {};

            // Act
            await dataRetrievalController.errorStateHandler(req, res, next);

            // Assert
            expect(res.status.calledWith(400)).to.be.true;
            expect(res.send.calledOnce).to.be.true;
        });

        it('should return a 400 status when the state is invalid', async () => {
            // Arrange
            req.body = {
                state: 185
            }

            req.retrieval = generateFakeRetrieval(faker.database.mongodbObjectId(), retrievalState.AVAILABLE_FOR_RETREIVAL);

            // Act
            await dataRetrievalController.errorStateHandler(req, res, next);

            // Assert
            expect(res.status.calledWith(400)).to.be.true;
            expect(res.send.calledOnce).to.be.true;
        });
    });

    describe('Test postURL', () => {
        it('should return a 200 status when a valid set of data is provided', async () => {
            // Arrange
            req.body = {
                url: "https://www.google.com",
                name: "Google"
            }

            req.retrieval = generateFakeRetrieval(faker.database.mongodbObjectId(), retrievalState.AVAILABLE_FOR_RETREIVAL);
            req.retrieval.data = [];

            req.retrieval.save = sandbox.stub();
            req.retrieval.save.resolves();

            // Act
            await dataRetrievalController.postURL(req, res, next);

            // Assert
            expect(res.status.calledWith(200)).to.be.true;
            expect(res.send.calledOnce).to.be.true;
            expect(req.retrieval.data.length).to.equal(1);
            expect(req.retrieval.data[0].value).to.equal(req.body.url);
            expect(req.retrieval.data[0].name).to.equal(req.body.name);
            expect(req.retrieval.data[0].data_type).to.equal(dataTypes.URL);
            expect(req.retrieval.data[0].use_buffer).to.be.false;
        });

        it('should return a 500 status when an error occurs', async () => {
            // Arrange
            req.body = {
                url: "https://www.google.com",
                name: "Google"
            }

            req.retrieval = generateFakeRetrieval(faker.database.mongodbObjectId(), retrievalState.AVAILABLE_FOR_RETREIVAL);
            req.retrieval.data = [];

            req.retrieval.save = sandbox.stub();
            req.retrieval.save.rejects(new Error("An error occurred"));

            // Act
            await dataRetrievalController.postURL(req, res, next);

            // Assert
            expect(res.status.calledWith(500)).to.be.true;
            expect(res.send.calledOnce).to.be.true;
        });

        it('should return a 400 status when the URL is not provided', async () => {
            // Arrange
            req.body = {
                name: "Google"
            }

            // Act
            await dataRetrievalController.postURL(req, res, next);

            // Assert
            expect(res.status.calledWith(400)).to.be.true;
            expect(res.send.calledOnce).to.be.true;
        });

        it('should return a 400 status when the name is not provided', async () => {
            // Arrange
            req.body = {
                url: "https://www.google.com"
            }

            // Act
            await dataRetrievalController.postURL(req, res, next);

            // Assert
            expect(res.status.calledWith(400)).to.be.true;
            expect(res.send.calledOnce).to.be.true;
        });

        it('should return a 403 status if the retrieval is expired', async () => {
            // Arrange
            req.body = {
                url: "https://www.google.com",
                name: "Google"
            }

            req.retrieval = generateFakeRetrieval(faker.database.mongodbObjectId(), retrievalState.RETRIEVAL_EXPIRED);

            // Act
            await dataRetrievalController.postURL(req, res, next);

            // Assert
            expect(res.status.calledWith(403)).to.be.true;
            expect(res.send.calledOnce).to.be.true;
        });
    });

    describe('Test postFiles', () => {
        it('should return a 200 status when a valid set of data is provided', async () => {
            // Arrange
            req.files = generateFakeFiles(3, [dataTypes.FILE, dataTypes.IMAGE, dataTypes.FILE]).map((file) => {
                return {
                    originalname : file.name,
                    mimetype : file.value,
                    buffer : file.buffer,
                    d_file_type : file.data_type
                }
            });

            req.retrieval = generateFakeRetrieval(faker.database.mongodbObjectId(), retrievalState.AVAILABLE_FOR_RETREIVAL);
            req.retrieval.data = [];

            req.retrieval.save = sandbox.stub();
            req.retrieval.save.resolves();

            // Act
            await dataRetrievalController.postFiles(req, res, next);

            // Assert
            expect(res.status.calledWith(200)).to.be.true;
            expect(res.send.calledOnce).to.be.true;
            expect(req.retrieval.data.length).to.equal(3);
            req.retrieval.data.forEach((file, index) => {
                expect(file.value).to.equal(req.files[index].mimetype);
                expect(file.buffer).to.equal(req.files[index].buffer);
                expect(file.use_buffer).to.be.true;
            });
        });

        it('should return a 500 status when an error occurs', async () => {
            // Arrange
            req.files = generateFakeFiles(3).map((file) => {
                return {
                    originalname : file.name,
                    mimetype : file.value,
                    buffer : file.buffer,
                    d_file_type : file.data_type
                }
            });

            req.retrieval = generateFakeRetrieval(faker.database.mongodbObjectId(), retrievalState.AVAILABLE_FOR_RETREIVAL);
            req.retrieval.data = [];

            req.retrieval.save = sandbox.stub();
            req.retrieval.save.rejects(new Error("An error occurred"));

            // Act
            await dataRetrievalController.postFiles(req, res, next);

            // Assert
            expect(res.status.calledWith(500)).to.be.true;
            expect(res.send.calledOnce).to.be.true;
        });

        it('should return a 400 status when files are not provided', async () => {
            // Arrange


            // Act
            await dataRetrievalController.postFiles(req, res, next);

            // Assert
            expect(res.status.calledWith(400)).to.be.true;
            expect(res.send.calledOnce).to.be.true;
        });

        it('should return a 403 status if the retrieval is expired', async () => {
            // Arrange
            req.files = generateFakeFiles(3).map((file) => {
                return {
                    originalname : file.name,
                    mimetype : file.value,
                    buffer : file.buffer,
                    d_file_type : file.data_type
                }
            });

            req.retrieval = generateFakeRetrieval(faker.database.mongodbObjectId(), retrievalState.RETRIEVAL_EXPIRED);

            // Act
            await dataRetrievalController.postFiles(req, res, next);

            // Assert
            expect(res.status.calledWith(403)).to.be.true;
            expect(res.send.calledOnce).to.be.true;
        });
    });

    describe('Test deleteFile', () => {
        it('should return a 200 status when a valid set of data is provided', async () => {
            // Arrange
            req.params = {
                file_id: "1234"
            }

            req.retrieval = generateFakeRetrieval(faker.database.mongodbObjectId(), retrievalState.AVAILABLE_FOR_RETREIVAL);
            req.retrieval.data = [generateFakeFile()];
            req.retrieval.data[0]._id = "1234";

            req.retrieval.save = sandbox.stub();
            req.retrieval.save.resolves();

            // Act
            await dataRetrievalController.deleteFile(req, res, next);

            // Assert
            expect(res.status.calledWith(200)).to.be.true;
            expect(res.send.calledOnce).to.be.true;
            expect(req.retrieval.data.length).to.equal(0);
        });

        it('should return a 500 status when an error occurs', async () => {
            // Arrange
            req.params = {
                file_id: "1234"
            }

            req.retrieval = generateFakeRetrieval(faker.database.mongodbObjectId(), retrievalState.AVAILABLE_FOR_RETREIVAL);
            req.retrieval.data = generateFakeFiles(2);
            req.retrieval.data[0]._id = "1234";

            req.retrieval.save = sandbox.stub();
            req.retrieval.save.rejects(new Error("An error occurred"));

            // Act
            await dataRetrievalController.deleteFile(req, res, next);

            // Assert
            expect(res.status.calledWith(500)).to.be.true;
            expect(res.send.calledOnce).to.be.true;
        });

        it('should return a 400 status when the file ID is not provided', async () => {
            // Arrange
            req.params = {}

            // Act
            await dataRetrievalController.deleteFile(req, res, next);

            // Assert
            expect(res.status.calledWith(400)).to.be.true;
            expect(res.send.calledOnce).to.be.true;
        });

        it('should return a 404 status when the file does not exist', async () => {
            // Arrange
            req.params = {
                file_id: "12345"
            }

            req.retrieval = generateFakeRetrieval(faker.database.mongodbObjectId(), retrievalState.AVAILABLE_FOR_RETREIVAL);
            req.retrieval.data = [generateFakeFile()];
            req.retrieval.data[0]._id = "1234";

            // Act
            await dataRetrievalController.deleteFile(req, res, next);

            // Assert
            expect(res.status.calledWith(404)).to.be.true;
            expect(res.send.calledOnce).to.be.true;
        });
    });
});