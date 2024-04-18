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

            getCarouselDevices.returns(items)

            const req = {
                isLoggedIn: true,
                user: user
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
            expect(res.render.calledWith('index', {title: 'Express', auth: req.isLoggedIn, user: req.user, items, imgPerCarousel})).to.be.true;
            expect(next.calledOnce).to.be.false;
        });
    });
});