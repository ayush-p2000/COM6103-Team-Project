const {expect} = require("chai");
const proxyquire = require('proxyquire');

const sandbox = require('sinon').createSandbox();

const dotenv = require('dotenv')
const parse = require('dotenv-parse-variables')

const {mock_user} = require("../mocks/user");

let env = dotenv.config({path: __dirname + '/../../.env.test'})
if (env.error) {
    throw env.error
}
env = parse(env, {assignToProcessEnv: true, overrideProcessEnv: true})

const getCarouselDevices = sandbox.stub();

const landingController = proxyquire('../../controllers/landingController',
    {
        '../model/mongodb': {
            getCarouselDevices
        }
    });

describe('Test Landing Page', () => {
    afterEach(() => {
        sandbox.restore()
    });

    describe('Invoke getLandingPage', () => {
        it('should call res.render with the correct parameters', async () => {
            // Arrange
            const imgPerCarousel = 6;
            const items = [

            ]
            const user = mock_user;
            const messages = [];

            getCarouselDevices.returns(items)

            const req = {
                isLoggedIn: true,
                user: user,
                query: {}
            };

            const res = {
                render: sandbox.spy()
            };

            const next = sandbox.spy();

            // Act
            await landingController.getLandingPage(req, res, next);

            // Assert
            expect(getCarouselDevices.calledOnce).to.be.true;
            expect(getCarouselDevices.returns(items));
            expect(res.render.calledOnce).to.be.true;
            expect(res.render.calledWith('index', {title: 'Express', auth: req.isLoggedIn, user: req.user, items, imgPerCarousel, messages})).to.be.true;
            expect(next.calledOnce).to.be.false;
        });

        it("should call res.status with 500 and next with an error message", async () => {
            // Arrange
            const items = [

            ]
            const user = mock_user;

            const req = {
                isLoggedIn: true,
                user: user,
                query: {}
            };

            const res = {
                render: sandbox.spy(),
                status: sandbox.stub().returnsThis()
            };

            const next = sandbox.spy();

            const error = new Error("Internal Server Error");

            getCarouselDevices.throws(error);

            // Act
            await landingController.getLandingPage(req, res, next);

            // Assert

            expect(res.status.calledOnce).to.be.true;
            expect(res.status.calledWith(500)).to.be.true;
            expect(next.calledOnce).to.be.true;
            expect(next.calledWith({message: "Internal Server Error", state: 500})).to.be.true;
        });

        it("should forward and session messages to the view", async () => {
            // Arrange
            const items = [

            ]
            const user = mock_user;
            const messages = ["Test Message"];

            getCarouselDevices.returns(items)

            const req = {
                isLoggedIn: true,
                user: user,
                query: {
                    messages: encodeURIComponent(JSON.stringify(messages))
                }
            };

            const res = {
                render: sandbox.spy()
            };

            const next = sandbox.spy();

            // Act
            await landingController.getLandingPage(req, res, next);

            // Assert
            expect(res.render.calledOnce).to.be.true;
            expect(res.render.calledWith('index', {title: 'Express', auth: req.isLoggedIn, user: req.user, items, imgPerCarousel: 6, messages})).to.be.true;
        });
    });
});