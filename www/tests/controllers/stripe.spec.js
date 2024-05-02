const {expect} = require("chai");
const proxyquire = require('proxyquire');
const sinon = require('sinon')
const sandbox = sinon.createSandbox();

const dotenv = require('dotenv')
const parse = require('dotenv-parse-variables')
const {mock_user} = require("../mocks/user");


let env = dotenv.config({path: __dirname + '/../../.env.test'})
if (env.error) {
    throw env.error
}

env = parse(env, {assignToProcessEnv: true, overrideProcessEnv: true})

const renderUserLayout = sandbox.stub()
const stripeSessionsCreate = sandbox.stub()
const resRedirect = sandbox.stub()

const stripeController = proxyquire('../../controllers/payment/stripeController', {
    '../../util/layout/layoutUtils': {renderUserLayout},
    'stripe': () => ({
        checkout: {
            sessions: {
                create: stripeSessionsCreate
            }
        }
    })
})

describe('Stripe controller tests', () => {
    afterEach(() => {
        sandbox.restore()
    });

    it('should handle getStripe function correctly', async () => {
        const req = {
            isLoggedIn: true,
            user: mock_user,
            query: {
                id: '3423j2g293j2292',
                product: 'Data Retrieval',
                total: '4.99',
                type: 'payment_retrieval',
                extension: '3'
            }
        }
        const res = {}

        await stripeController.getStripe(req, res)

        expect(renderUserLayout.calledOnce).to.be.true;
        expect(renderUserLayout.calledWith(req, res, '../payment/StripeGateway', sinon.match.object)).to.be.true;
    });

    it('should create stripe payment session and redirect', async () => {
        const req = {
            query: {
                id: '12r1fs5afa14da3',
                product: 'Data Retrieval',
                total: '8.99',
                extension: '3',
                type: 'payment_retrieval'
            }
        };
        const res = {
            redirect: resRedirect
        };

        stripeSessionsCreate.resolves({ url: 'http://mock-session-url.com' });

        await stripeController.stripePayment(req, res);

        expect(stripeSessionsCreate.calledOnce).to.be.true;
        expect(resRedirect.calledWith(303, 'http://mock-session-url.com')).to.be.true;
        sinon.assert.calledWithMatch(stripeSessionsCreate, {
            line_items: [{
                price_data: {
                    currency: 'gbp',
                    product_data: {
                        name: 'Data Retrieval',
                    },
                    unit_amount: 899,
                },
                quantity: 1,
            }]
        });
    });
})