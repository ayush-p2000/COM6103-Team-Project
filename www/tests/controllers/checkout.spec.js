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

const updateDeviceState =sandbox.stub()
const renderUserLayout = sandbox.stub()
const getTransactionByDevice = sandbox.stub()
const addTransaction = sandbox.stub()
const getTransactionById = sandbox.stub()
const updateTransaction = sandbox.stub()
const getItemDetail = sandbox.stub()
const getRetrieval = sandbox.stub()
const retrieveStub = sandbox.stub();
const stripeStub = sandbox.stub().returns({
    checkout: {
        sessions: {
            retrieve: retrieveStub
        }
    }
});


const checkoutController = proxyquire('../../controllers/payment/checkoutController', {
    '../../model/mongodb': {
        updateDeviceState,
        getTransactionByDevice,
        addTransaction,
        getTransactionById,
        updateTransaction,
        getItemDetail,
        getRetrieval
    },
    '../../util/layout/layoutUtils': {
        renderUserLayout
    },
    'stripe': stripeStub
})

describe('Checkout Controller', () => {
    afterEach(() => {
        sandbox.restore()
    });
    describe('Invoke getCheckout',() => {
        it('should recycle a device if the total is zero', async () => {
            const req = {
                isLoggedIn: true,
                user: mock_user,
                query: {
                    id: '74737382d23423d',
                    total: '0',
                    model: 'Apple Iphone 11',
                }
            }
            const res = {render:sandbox.spy()}

            await checkoutController.getCheckout(req, res)

            expect(updateDeviceState.calledOnce).to.be.true
            expect(renderUserLayout.calledWith(req, res, 'payment/checkout_complete', sinon.match.any)).to.be.true
        })

        it('should initiate a new transaction for data retrieval', async () => {

            const new_transaction = {
                _id: '4828437dds283h3u2b2'
            }
            const req = {
                isLoggedIn: true,
                user: mock_user,
                query: {
                    id: '3432hhfdsh293j2g23',
                    total: '8.99',
                    type: 'payment_retrieval'
                }
            }

            const res = {render: sandbox.spy()}

            getTransactionById.returns(null)

            addTransaction.returns(new_transaction)

            await checkoutController.getCheckout(req, res)

            expect(addTransaction.calledOnce).to.be.true
            expect(renderUserLayout.calledWith(req, res, '../payment/checkout', sinon.match.any)).to.be.true

        });

        it('should initiate a new transaction for retrieval extension', async () => {

            const new_transaction = {
                _id: '4828437dds283h3u2b2'
            }
            const transaction = {
                device : {
                    _id : '2394s9sh3s392'
                }
            }
            const req = {
                isLoggedIn: true,
                user: mock_user,
                query: {
                    id: '3432hhfdsh293j2g23',
                    total: '8.99',
                    type: 'retrieval_extension',
                    extension: '3'
                }
            }

            const res = {render: sandbox.spy()}

            getTransactionById.returns(transaction)

            updateTransaction.returns(null)

            await checkoutController.getCheckout(req, res)

            expect(addTransaction.calledOnce).to.be.true
            expect(renderUserLayout.calledWith(req, res, '../payment/checkout', sinon.match.any)).to.be.true

        });

        it('should not proceed to checkout gateway if essential parameters are missing', () => {

            const req = {
                body: {
                    paymentProvider : 'stripe'
                },
                query : {
                    type: 'retrieval_extension',
                    total: '4.99'
                }
            }

            const res = {
                status: sandbox.stub().returnsThis(),
                send: sandbox.spy()
            }
            const next = sandbox.spy()
            checkoutController.getCheckout(req, res, next);

            expect(res.status.calledWith(400)).to.be.true;
            expect(res.send.calledWith("Missing required parameters")).to.be.true;
        });
    })

    describe('Invoke checkoutToProvider', () =>{

        it('should redirect to the correct URL for payment', async () => {
            const req = {
                isLoggedIn: true,
                user: mock_user,
                body: {
                    paymentProvider: 'stripe',
                    transactionId: '02nsj202nsa08hdfha'
                },
                query: {
                    type: 'payment_retrieval',
                    total: '4.99',
                    extension: '3'
                }
            }

            const res = {redirect: sandbox.spy()}
            const next = sandbox.spy()
            checkoutController.checkoutToProvider(req, res, next);

            const expectedQueryString = "id=02nsj202nsa08hdfha&product=Data%20Retrieval&total=4.99&type=payment_retrieval";
            expect(res.redirect.calledOnce).to.be.true;
            expect(res.redirect.firstCall.args[0]).to.equal(`/checkout/stripe?${expectedQueryString}`);


        })

        it('should redirect with additional parameters for retrieval extension', () => {
            const req = {
                isLoggedIn: true,
                user: mock_user,
                body: {
                    paymentProvider: 'stripe',
                    transactionId: '02nsj202nsa08hdfha'
                },
                query: {
                    type: 'retrieval_extension',
                    total: '4.99',
                    extension: '3'
                }
            }

            const res = {redirect: sandbox.spy()}
            const next = sandbox.spy()
            checkoutController.checkoutToProvider(req, res, next);

            const expectedQueryString = "id=02nsj202nsa08hdfha&product=Data%20Retrieval%20Extension&total=4.99&type=retrieval_extension&extension=3";
            expect(res.redirect.calledOnce).to.be.true;
            expect(res.redirect.firstCall.args[0]).to.equal(`/checkout/stripe?${expectedQueryString}`);
        });

        it('should not proceed with redirect if essential parameters are missing', () => {

            const req = {
                body: {
                    paymentProvider : 'stripe'
                },
                query : {
                    type: 'retrieval_extension',
                    total: '4.99'
                }
            }

            const res = {
                redirect: sandbox.spy(),
                status: sandbox.stub().returnsThis(),
                send: sandbox.spy()
            }
            const next = sandbox.spy()
            checkoutController.checkoutToProvider(req, res, next);

            expect(res.status.calledWith(400)).to.be.true;
            expect(res.send.calledWith("Missing required parameters")).to.be.true;
        });

    });

    describe('invoke getCheckoutCompleted', () => {
        it('should be successful for stripe payment', async () => {
            const req = {
                isLoggedIn: true,
                user: mock_user,
                query: {
                    id: '123h421h1i211h2',
                    method: 'stripe',
                    sessionId: '88fs888shhdgh',
                    type: 'payment_retrieval',
                    extension: '3'
                }
            }
            const res = {render: sandbox.spy()}

            const next = sandbox.spy()

            const device = {
                _id: '482hb292h2g292ks'
            }
            const retrieval = {
                device: {
                    _id: '482hb292h2g292ks'
                }
            }
            retrieveStub.resolves({ amount_total: 499 });
            getRetrieval.resolves(retrieval)
            getItemDetail.resolves(device)


            await checkoutController.getCheckoutCompleted(req, res, next)

            expect(retrieveStub.calledOnce).to.be.true
            expect(getRetrieval.calledOnce).to.be.true
            expect(getItemDetail.calledWith('482hb292h2g292ks')).to.be.true;
            expect(renderUserLayout.calledWithExactly(req, res, '../payment/checkout_complete', sinon.match.any)).to.be.true

        })

        it('should be successful for paypal payment', async () => {
            const req = {
                isLoggedIn: true,
                user: mock_user,
                query: {
                    id: '123h421h1i211h2',
                    method: 'paypal',
                    paymentId: '88fs888shhdgh',
                    type: 'retrieval_extension',
                    extension: 3,
                }
            }
            const res = {render: sandbox.spy()}

            const next = sandbox.spy()

            const device = {
                _id: '482hb292h2g292ks'
            }
            const retrievalMock = {
                device: { _id: 'device2' },
                retrieval_state: '',
                save: sandbox.stub().resolves()
            };

            retrieveStub.resolves({ amount_total: 499 });
            getRetrieval.resolves(retrievalMock)
            getItemDetail.resolves({})


            await checkoutController.getCheckoutCompleted(req, res, next)

            expect(retrievalMock.save.calledOnce).to.be.true;
            expect(retrievalMock.retrieval_state).to.equal(5);
            // expect(getItemDetail.calledWith('482hb292h2g292ks')).to.be.true;
            expect(renderUserLayout.calledWithExactly(req, res, '../payment/checkout_complete', sinon.match.any)).to.be.true
        });


        it('should not proceed to checkout completed if essential parameters are missing', () => {

            const req = {

                query : {
                    type: 'retrieval_extension',
                    id: '124jfsj124',
                    method: 'stripe'
                }
            }

            const res = {
                status: sandbox.stub().returnsThis(),
                send: sandbox.spy()
            }
            const next = sandbox.spy()
            checkoutController.getCheckoutCompleted(req, res, next);

            expect(res.status.calledWith(400)).to.be.true;
            expect(res.send.calledWith("Missing required parameters")).to.be.true;
        });

    })


})