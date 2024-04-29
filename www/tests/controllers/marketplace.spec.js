const {expect} = require("chai");
const proxyquire = require('proxyquire');

const sandbox = require('sinon').createSandbox();

const dotenv = require('dotenv')
const parse = require('dotenv-parse-variables')

const {mock_user} = require("../mocks/user");
const {generateFakeDevices} = require("../mocks/device");
const {generateFakeDeviceTypes} = require("../mocks/deviceType");
const deviceCategory = require("../../model/enum/deviceCategory")


let env = dotenv.config({path: __dirname + '/../../.env.test'})
if (env.error) {
    throw env.error
}
env = parse(env, {assignToProcessEnv: true, overrideProcessEnv: true})


const getUserItems= sandbox.stub();
const getQuotes= sandbox.stub();
const getProviders= sandbox.stub();
const addQuote= sandbox.stub();
const deleteQuote= sandbox.stub();
const getAllDevices= sandbox.stub();
const getAllDeviceType = sandbox.stub();
const getUnknownDeviceHistoryByDevice = sandbox.stub();
const getPaginatedResults = sandbox.stub();
const renderUserLayout = sandbox.stub();

const marketplaceController = proxyquire('../../controllers/marketplace/marketplaceController',
    {
        '../../model/mongodb': {
            getUserItems,
            getQuotes,
            getProviders,
            addQuote,
            deleteQuote,
            getAllDevices,
            getAllDeviceType,
            getUnknownDeviceHistoryByDevice
        },
        "../../model/utils/utils":{
            getPaginatedResults
        },
        "../../util/layout/layoutUtils":{
            renderUserLayout
        }
    });

describe('Test Marketplace Page', () => {
    afterEach(() => {
        sandbox.restore()
    });

    describe('Invoke getMarketplace', () => {
        it('should call renderUserLayout with the correct parameters', async () => {
            // Arrange
            const req = {
                params: {
                    page: 1
                },
                isLoggedIn: true,
                user: { mock_user }
            };

            const res = {
                render: sandbox.spy()
            };

            const next = sandbox.spy();

            const fakeDeviceTypes = generateFakeDevices();
            const fakeDevices = generateFakeDevices();
            const fakePagination = {
                currentPage: 1,
                start: 1,
                end: 2,
                lastPage: false,
                emptyPage: false
            };

            getAllDeviceType.resolves(fakeDeviceTypes);
            getPaginatedResults.resolves({ items: fakeDevices, pagination: fakePagination });

            // Act
            await marketplaceController.getMarketplace(req, res, next);
            // Assert
            expect(getAllDeviceType.calledOnce).to.be.true;
            expect(getPaginatedResults.calledOnce).to.be.true;
            expect(getAllDeviceType.resolves(fakeDeviceTypes));
            expect(renderUserLayout.calledWith(req, res, '../marketplace/marketplace', {
                deviceTypes: fakeDeviceTypes,
                devices: fakeDevices,
                deviceCategory,
                auth: req.isLoggedIn,
                user: req.user,
                pagination: fakePagination
            })).to.be.true;
            expect(next.notCalled).to.be.true;
            // You can add more assertions based on your specific response logic
        });


        it("should call res.status with 500 and next with an error message", async () => {
            // Arrange
            // Arrange
            const req = {
                params: {
                    page: 1
                },
                isLoggedIn: true,
                user: { mock_user }
            };

            const res = {
                render: sandbox.spy(),
                status: sandbox.stub().returnsThis()
            };

            const next = sandbox.spy();

            const error = new Error("Internal Server Error");
            getPaginatedResults.throws(error);

            // Act
            await marketplaceController.getMarketplace(req, res, next);
            // Assert
            expect(res.status.calledOnce).to.be.true;
            expect(res.status.calledWith(500)).to.be.true;
            expect(next.calledOnce).to.be.true;
            expect(next.calledWith(error)).to.be.true;
        });
    });
});