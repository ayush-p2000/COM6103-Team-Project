const sinon = require('sinon');
const chai = require('chai');
const sinonChai = require('sinon-chai');
const proxyquire = require('proxyquire');
const paypal = require('paypal-rest-sdk');
chai.use(sinonChai);
const { expect } = chai;

describe('PayPal Controller', () => {
    let sandbox;
    let paypalController;
    let renderUserLayoutStub;
    let updateTransactionStub;
    let paypalStub;

    before(() => {
        process.env.PAYPAL_MODE = 'sandbox'; // Set the PAYPAL_MODE environment variable
    });

    beforeEach(() => {
        sandbox = sinon.createSandbox();
        renderUserLayoutStub = sandbox.stub();
        updateTransactionStub = sandbox.stub();
        paypalStub = sandbox.stub(paypal, 'payment');

        paypalController = proxyquire('../../../controllers/payment/PaypalController', {
            '../../model/mongodb': { updateTransaction: updateTransactionStub },
            '../../util/layout/layoutUtils': { renderUserLayout: renderUserLayoutStub },
        });
    });

    afterEach(() => {
        sandbox.restore();
    });


    describe('payProduct', () => {
        let createStub, req, res;

        beforeEach(() => {
            // Stubbing the paypal.payment.create method
            createStub = sinon.stub(paypal.payment, 'create');

            // Setup request and response objects
            req = {
                query: {
                    id: '123',
                    product: 'Test Product',
                    total: '10.00',
                    type: 'subscription',
                    extension: 3
                }
            };

            res = { redirect: sinon.spy() };
        });

        afterEach(() => {
            // Restore the stubbed method
            createStub.restore();
        });

        it('should redirect to the PayPal approval URL', async () => {
            // Set up the stub to simulate the API response
            createStub.callsFake((paymentDetails, callback) => {
                callback(null, {
                    links: [
                        { rel: 'approval_url', href: 'https://approval.url' }
                    ]
                });
            });

            await paypalController.payProduct(req, res);

            // Assertions
            sinon.assert.calledOnce(createStub);
            sinon.assert.calledWithExactly(res.redirect, 'https://approval.url');
        });
    });

    describe('paypalSuccess', () => {
        it('should execute the PayPal payment', async () => {
            const req = {
                query: {
                    PayerID: 'PAYER_ID',
                    paymentId: 'PAYMENT_ID',
                    total: '10.00',
                },
            };
            const res = { render: sinon.spy() };

            // Create a stub for paypal.payment.execute
            const executeStub = sinon.stub(paypal.payment, 'execute').callsFake((paymentId, executePaymentJson, callback) => {
                callback(null, {});  // Simulating a successful PayPal payment execution
            });

            await paypalController.paypalSuccess(req, res);

            // Assertions
            sinon.assert.calledOnce(executeStub);
            executeStub.restore();
        });
    });

    describe('getPaypal', () => {
        it('should render the paypalGateway view with the correct data', () => {
            const req = {
                query: {
                    id: '123',
                    product: 'Test Product',
                    total: '10.00',
                    type: 'subscription',
                    extension: 3,
                },
            };
            const res = { render: sinon.spy() };

            paypalController.getPaypal(req, res, () => {});

            expect(renderUserLayoutStub).to.have.been.calledWithExactly(
                req,
                res,
                '../payment/paypalGateway',
                {
                    data: 'id=123&product=Test%20Product&total=10.00&type=subscription',
                    extension: 3,
                }
            );
        });
    });


    describe('cancelPayment', () => {
        it('should update the transaction and render the cancel view', async () => {
            const req = {
                query: {
                    id: '123',
                    total: '10.00',
                    state: 'PAYMENT_CANCELLED',
                    type: 'retrieval_extension',
                    extension: 3,
                },
            };
            const res = { render: sinon.spy() };

            await paypalController.cancelPayment(req, res);

            expect(updateTransactionStub).to.have.been.calledWithExactly({
                deviceId: '123',
                value: '10.00',
                state: 2,
                paymentMethod: 'retrieval_extension',
                extension: 3,
            });
            expect(renderUserLayoutStub).to.have.been.calledWithExactly(
                req,
                res,
                '../payment/cancel'
            );
        });
    });
});