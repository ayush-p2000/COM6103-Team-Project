const sinon = require('sinon');
const { expect } = require('chai');
const sinonChai = require('sinon-chai');
const chai = require('chai');
chai.use(sinonChai);
const proxyquire = require('proxyquire');

const {faker} = require('@faker-js/faker')

const dotenv = require("dotenv");
const parse = require("dotenv-parse-variables");
const {mockRequest,
    mockResponse
} = require("mock-req-res");

const {generateFakeDevice} = require("../mocks/device");
const {generateFakeRetrieval} = require("../mocks/retrieval");
const {mock_user} = require("../mocks/user");
const {generateFakeBrands,
    generateFakeBrand
} = require("../mocks/brand");

const {generateFakeModel} = require("../mocks/model");
const retrievalState = require("../../model/enum/retrievalState");
const roleTypes = require("../../model/enum/roleTypes");

let env = dotenv.config({path: __dirname + '/../../.env.test'})
if (env.error) {
    throw env.error
}
env = parse(env, {assignToProcessEnv: true, overrideProcessEnv: true})

let email = sinon.stub();
let deleteRetrieval = sinon.stub();
let getRetrieval = sinon.stub();
let getRetrievalObjectByDeviceId = sinon.stub();

let retrievalMiddleware;

let req, res, next;

describe('Test Retrieval Middleware', () => {
    beforeEach(() => {
        req = mockRequest();
        res = mockResponse();

        req.session = {};

        next = sinon.spy();
    });

    describe('Test verifyRetrievalExpiry', () => {
        beforeEach(() => {
            email = sinon.stub();
            deleteRetrieval = sinon.stub();

            retrievalMiddleware = proxyquire('../../middlewares/retrieval', {
                '../public/javascripts/Emailing/emailing': {
                    email
                },
                '../model/mongodb': {
                    deleteRetrieval
                }
            });
        });

        it('should call next if no retrieval object is provided', async () => {
            // Arrange
            req.retrieval = null;

            // Act
            await retrievalMiddleware.verifyRetrievalExpiry(req, res, next);

            // Assert
            expect(next).to.have.been.called;
        });

        it('should call next if no expiry date is present on the retrieval object', async () => {
            // Arrange
            req.retrieval = {
                expiry: null
            };

            // Act
            await retrievalMiddleware.verifyRetrievalExpiry(req, res, next);

            // Assert
            expect(next).to.have.been.called;
        });

        it('should call next if the expiry date is in the future', async () => {
            // Arrange
            //The expiry needs to be at least 7 days in the future
            const expiry = new Date();
            expiry.setDate(expiry.getDate() + 8);
            req.retrieval = {
                expiry: expiry,
                emails_sent: {
                    expired: false,
                    near_expiry: false
                }
            };


            // Act
            await retrievalMiddleware.verifyRetrievalExpiry(req, res, next);

            // Assert
            expect(next).to.have.been.called;
        });

        it('should call deleteRetrieval and send an email if the expiry date is in the past', async () => {
            // Arrange
            const expiry = new Date();
            expiry.setDate(expiry.getDate() - 1);

            req.retrieval = {
                expiry: expiry,
                emails_sent: {
                    expired: false,
                    near_expiry: false
                }
            }

            email.returns();
            deleteRetrieval.returns();

            // Act
            await retrievalMiddleware.verifyRetrievalExpiry(req, res, next);

            // Assert
            expect(deleteRetrieval).to.have.been.called;
            expect(email).to.have.been.called;
            expect(next).to.have.been.called;
        });

        it('should set the retrieval state to "EXPIRING_SOON", send an email, and call next if the expiry date is within 7 days', async () => {
            // Arrange
            req.retrieval = {
                expiry: new Date(),
                emails_sent: {
                    expired: false,
                    near_expiry: false
                }
            }
            req.retrieval.listing_user = mock_user;
            req.retrieval.device = generateFakeDevice();
            req.retrieval.device.brand = generateFakeBrand();
            req.retrieval.device.model = generateFakeModel();

            req.retrieval.save = sinon.stub();
            req.retrieval.save.resolves();

            email.returns();

            req.retrieval.expiry = new Date();
            //Add 5 days to the expiry date
            req.retrieval.expiry.setDate(req.retrieval.expiry.getDate() + 5);

            req.emails_sent = {
                expired: false,
                near_expiry: false
            }

            // Act
            await retrievalMiddleware.verifyRetrievalExpiry(req, res, next);

            // Assert
            expect(req.retrieval.retrieval_state).to.equal(retrievalState.EXPIRING_SOON);
            expect(req.retrieval.save).to.have.been.called;
            expect(email).to.have.been.called;
            expect(next).to.have.been.called;
        });

        it('should return 500 if there is an error', async () => {
            // Arrange
            req.retrieval = {
                expiry: new Date(),
                emails_sent: {
                    expired: false,
                    near_expiry: false
                }
            }
            req.retrieval.listing_user = mock_user;
            req.retrieval.device = generateFakeDevice();
            req.retrieval.device.brand = generateFakeBrand();
            req.retrieval.device.model = generateFakeModel();

            req.retrieval.save = sinon.stub();
            req.retrieval.save.rejects(new Error('Test error'));

            req.retrieval.expiry = (new Date()) + 1000 * 60 * 60 * 24 * 5;

            req.emails_sent = {
                expired: false,
                near_expiry: false
            }

            // Act
            await retrievalMiddleware.verifyRetrievalExpiry(req, res, next);

            // Assert
            expect(res.status).to.have.been.calledWith(500);
            expect(res.render).to.have.been.calledOnce;
        });
    });

    describe('Test isValidRetrievalUser', () => {
        beforeEach(() => {
            retrievalMiddleware = require('../../middlewares/retrieval');
        });

        it('should call next if the user is the listing user', async () => {
            //Arrange
            const retrieval = generateFakeRetrieval();
            req.retrieval = retrieval;

            const user = mock_user;
            req.retrieval.device.listing_user = user;

            req.user = {
                id: user._id,
                role: user.role
            }

            //Act
            await retrievalMiddleware.isValidRetrievalUser(req, res, next);

            //Assert
            expect(next).to.have.been.called;
        });

        it('should call next if the users role is staff or greater', async () => {
            //Arrange
            const retrieval = generateFakeRetrieval();
            req.retrieval = retrieval;

            const retrieval_user = mock_user;
            req.retrieval.device.listing_user = retrieval_user;

            const admin_user = mock_user;
            admin_user.role = roleTypes.STAFF;
            req.user = {
                id: admin_user._id,
                role: admin_user.role
            }

            //Act
            await retrievalMiddleware.isValidRetrievalUser(req, res, next);

            //Assert
            expect(next).to.have.been.called;
        });

        it('should return 403 if the user is not the listing user and is not staff or greater', async () => {
            //Arrange
            const retrieval = generateFakeRetrieval();
            req.retrieval = retrieval;

            const retrieval_user = mock_user;
            req.retrieval.device.listing_user = retrieval_user;

            req.user = {
                id: faker.database.mongodbObjectId(),
                role: roleTypes.USER
            }

            //Act
            await retrievalMiddleware.isValidRetrievalUser(req, res, next);

            //Assert
            expect(res.render).to.have.been.calledOnce;
        });

        it('should return 401 if the user is null', async () => {
            //Arrange
            const retrieval = generateFakeRetrieval();
            req.retrieval = retrieval;

            const retrieval_user = mock_user;
            req.retrieval.device.listing_user = retrieval_user;

            req.user = null;

            //Act
            await retrievalMiddleware.isValidRetrievalUser(req, res, next);

            //Assert
            expect(res.render).to.have.been.calledOnce;
        });

        it('should return 401 if the user is undefined', async () => {
            //Arrange
            const retrieval = generateFakeRetrieval();
            req.retrieval = retrieval;

            const retrieval_user = mock_user;
            req.retrieval.device.listing_user = retrieval_user;

            req.user = undefined;

            //Act
            await retrievalMiddleware.isValidRetrievalUser(req, res, next);

            //Assert
            expect(res.render).to.have.been.calledOnce;
        });

        it('should call next if the retrieval is null', async () => {
            //Arrange
            req.retrieval = null;

            const user = mock_user;
            req.user = {
                id: user._id,
                role: user.role
            }

            //Act
            await retrievalMiddleware.isValidRetrievalUser(req, res, next);

            //Assert
            expect(next).to.have.been.called;
        });

        it('should call next if the retrieval is undefined', async () => {
            //Arrange
            req.retrieval = undefined;

            const user = mock_user;
            req.user = {
                id: user._id,
                role: user.role
            }

            //Act
            await retrievalMiddleware.isValidRetrievalUser(req, res, next);

            //Assert
            expect(next).to.have.been.called;
        });
    });

    describe('Test populateRetrievalObject', () => {
        beforeEach(() => {
            getRetrieval = sinon.stub();
            getRetrievalObjectByDeviceId = sinon.stub();

            retrievalMiddleware = proxyquire('../../middlewares/retrieval', {
                '../model/mongodb': {
                    getRetrieval,
                    getRetrievalObjectByDeviceId
                }
            });
        });
        it('should call next if id, retrieval_id, body.retrieval_id and device_id are all undefined', async () => {
            // Arrange
            req.params = {}
            req.body = {}

            // Act
            await retrievalMiddleware.populateRetrievalObject(req, res, next);

            // Assert
            expect(next).to.have.been.called;
        });

        it('should call next if id, retrieval_id, body.retrieval_id and device_id are all null', async () => {
            // Arrange
            req.params = {
                id: null,
                retrieval_id: null,
                device_id: null
            }
            req.body = {
                retrieval_id: null
            }

            // Act
            await retrievalMiddleware.populateRetrievalObject(req, res, next);

            // Assert
            expect(next).to.have.been.called;
        });

        it('should add the retrieval object to the request if the id is provided', async () => {
            // Arrange
            const retrieval = generateFakeRetrieval();
            getRetrieval.resolves(retrieval);

            req.params = {
                id: retrieval._id
            }

            // Act
            await retrievalMiddleware.populateRetrievalObject(req, res, next);

            // Assert
            expect(getRetrieval).to.have.been.calledWith(retrieval._id);
            expect(req.retrieval).to.deep.equal(retrieval);
            expect(next).to.have.been.called;
        });

        it('should add the retrieval object to the request if the retrieval_id is provided', async () => {
            // Arrange
            const retrieval = generateFakeRetrieval();
            getRetrieval.resolves(retrieval);

            req.params = {
                retrieval_id: retrieval._id
            }

            // Act
            await retrievalMiddleware.populateRetrievalObject(req, res, next);

            // Assert
            expect(getRetrieval).to.have.been.calledWith(retrieval._id);
            expect(req.retrieval).to.deep.equal(retrieval);
            expect(next).to.have.been.called;
        });

        it('should add the retrieval object to the request if the body.retrieval_id is provided', async () => {
            // Arrange
            const retrieval = generateFakeRetrieval();
            getRetrieval.resolves(retrieval);

            req.body = {
                retrieval_id: retrieval._id
            }

            // Act
            await retrievalMiddleware.populateRetrievalObject(req, res, next);

            // Assert
            expect(getRetrieval).to.have.been.calledWith(retrieval._id);
            expect(req.retrieval).to.deep.equal(retrieval);
            expect(next).to.have.been.called;
        });

        it('should add the retrieval object to the request if the device_id is provided', async () => {
            // Arrange
            const retrieval = generateFakeRetrieval();
            getRetrievalObjectByDeviceId.resolves(retrieval);
            getRetrieval.resolves(retrieval);

            req.params = {
                device_id: retrieval.device._id
            }

            // Act
            await retrievalMiddleware.populateRetrievalObject(req, res, next);

            // Assert
            expect(getRetrievalObjectByDeviceId).to.have.been.calledWith(retrieval.device._id);
            expect(req.retrieval).to.deep.equal(retrieval);
            expect(next).to.have.been.called;
        });

        it('should call next if the retrieval object is already in the request', async () => {
            // Arrange
            const retrieval = generateFakeRetrieval();
            req.retrieval = retrieval;

            // Act
            await retrievalMiddleware.populateRetrievalObject(req, res, next);

            // Assert
            expect(getRetrieval).not.to.have.been.called;
            expect(getRetrievalObjectByDeviceId).not.to.have.been.called;
            expect(next).to.have.been.called;
        });

        it('should render a 404 page if the retrieval object is not found', async () => {
            // Arrange
            getRetrieval.resolves(null);

            req.params = {
                id: faker.database.mongodbObjectId()
            }

            // Act
            await retrievalMiddleware.populateRetrievalObject(req, res, next);

            // Assert
            expect(getRetrieval).to.have.been.called;
            expect(res.status).to.have.been.calledWith(404);
            expect(res.render).to.have.been.calledWith('error/404');
            expect(next).not.to.have.been.called;
        });

        it('should return 500 if there is an error', async () => {
            // Arrange
            getRetrieval.rejects(new Error('Test error'));

            req.params = {
                id: faker.database.mongodbObjectId()
            }

            // Act
            await retrievalMiddleware.populateRetrievalObject(req, res, next);

            // Assert
            expect(res.status).to.have.been.calledWith(500);
            expect(res.render).to.have.been.calledWith('error/500');
            expect(next).not.to.have.been.called;
        });
    });
});