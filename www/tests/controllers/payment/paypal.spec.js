const sinon = require('sinon');
const chai = require('chai');
const sinonChai = require('sinon-chai');
const proxyquire = require('proxyquire');
const paypal = require('paypal-rest-sdk');
const dotenv = require("dotenv");
const parse = require("dotenv-parse-variables");
chai.use(sinonChai);
const { expect } = chai;

let env = dotenv.config({path: __dirname + '/../../../.env.test'})
if (env.error) {
    throw env.error
}
env = parse(env, {assignToProcessEnv: true, overrideProcessEnv: true})

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
        let req, res, createStub;

        beforeEach(() => {
            createStub = sinon.stub(paypal.payment, 'create');
            req = {
                query: {
                    id: '123',
                    product: 'Test Product',
                    total: '10.00',
                    type: 'subscription',
                    extension: 3
                }
            };
            res = {
                redirect: sinon.spy(),
                send: sinon.spy(),
                status: sinon.stub().returnsThis() // Allows chaining .status().send()
            };
        });

        afterEach(() => {
            sinon.restore();
        });
        it('should create a PayPal payment and redirect to approval URL', async () => {
            const mockPayment = {
                links: [
                    { rel: 'approval_url', href: 'https://approval.url' }
                ]
            };
            createStub.callsFake((data, callback) => callback(null, mockPayment));

            await paypalController.payProduct(req, res);

            expect(createStub.calledOnce).to.be.true;
            expect(res.redirect.calledWith('https://approval.url')).to.be.true;
        });

        it('should handle errors from PayPal API gracefully', async () => {
            const error = new Error('Payment creation failed');
            createStub.callsFake((data, callback) => callback(error, null));

            await paypalController.payProduct(req, res);

            expect(createStub.calledOnce).to.be.true;
            expect(res.status.calledWith(500)).to.be.true;
            expect(res.send.calledWith('Error creating payment')).to.be.true; // Update your implementation to actually send this response
        });

        it('should handle different SKU based on extension', async () => {
            // Testing for different extensions
            const extensions = [0, 3, 6];
            const expectedSkus = [1, 2, 3];

            for (const extension of extensions) {
                const index = extensions.indexOf(extension);
                req.query.extension = extension;
                await paypalController.payProduct(req, res);
                const createArgs = createStub.args[index][0];
                expect(createArgs.transactions[0].item_list.items[0].sku).to.equal(`${expectedSkus[index]}`);
            }
        });

        it('should fail if required query parameters are missing', async () => {
            req.query = {}; // No query parameters

            await paypalController.payProduct(req, res);

            expect(createStub.notCalled).to.be.true;
            expect(res.status.calledWith(400)).to.be.true;
            expect(res.send.calledWith('Missing required parameters')).to.be.true; // Assume you update the actual implementation
        });

        it('should check for the absence of approval_url in payment links', async () => {
            const mockPayment = {
                links: [
                    { rel: 'self', href: 'https://self.url' }
                ]
            };
            createStub.callsFake((data, callback) => callback(null, mockPayment));

            await paypalController.payProduct(req, res);

            expect(createStub.calledOnce).to.be.true;
            expect(res.status.calledWith(500)).to.be.true;
            expect(res.send.calledWith('No approval URL found')).to.be.true; // Assume you update the actual implementation
        });

    });


    describe('paypalSuccess', () => {
        let req, res;

        beforeEach(function() {
            // Create request and response stubs
            req = {
                query: {}
            };
            res = {
                render: sinon.spy(),
                status: sinon.stub().returnsThis() // Allows chaining status().render()
            };
        });

        afterEach(function() {
            sinon.restore(); // Restore all mocks, stubs, and spies
        });

        it('should render an error page if required parameters are missing', async function() {
            // Call the function with empty query parameters
            await paypalController.paypalSuccess(req, res);

            // Check if status was set to 400
            expect(res.status.calledWith(400)).to.be.true;

            // Check if the correct error message was rendered
            expect(res.render.calledWith('error', { message: 'Missing required parameters.' })).to.be.true;
        });

        it('should return an error when PayerID is missing', async () => {
            req.query = {
                paymentId: 'PAYMENT123',
                total: '100.00'
            };
            await paypalController.paypalSuccess(req, res);

            expect(res.status.calledWith(400)).to.be.true;
            expect(res.render.calledWith('error', { message: 'Missing required parameters.' })).to.be.true;
        });

        it('should return an error when paymentId is missing', async () => {
            req.query = {
                PayerID: 'PAYER123',
                total: '100.00'
            };
            await paypalController.paypalSuccess(req, res);

            expect(res.status.calledWith(400)).to.be.true;
            expect(res.render.calledWith('error', { message: 'Missing required parameters.' })).to.be.true;
        });

        it('should return an error when total is missing', async () => {
            req.query = {
                PayerID: 'PAYER123',
                paymentId: 'PAYMENT123'
            };
            await paypalController.paypalSuccess(req, res);

            expect(res.status.calledWith(400)).to.be.true;
            expect(res.render.calledWith('error', { message: 'Missing required parameters.' })).to.be.true;
        });

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
        it('should use default extension value when not provided', () => {
            const req = {
                query: {
                    id: '123',
                    product: 'Test Product',
                    total: '10.00',
                    type: 'subscription'
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
                    extension: 0,
                }
            );
        });

        it('should handle missing critical query parameters gracefully', () => {
            const req = {
                query: {
                    id: '123',
                    type: 'subscription',
                    extension: 3
                },
            };
            const res = { render: sinon.spy() };

            paypalController.getPaypal(req, res, () => {});

            expect(renderUserLayoutStub).to.have.been.calledWithExactly(
                req,
                res,
                '../payment/paypalGateway',
                {
                    data: 'id=123&product=undefined&total=undefined&type=subscription',
                    extension: 3,
                }
            );
        });

        it('should encode URL components correctly', () => {
            const req = {
                query: {
                    id: '123',
                    product: 'Special Product & Co',
                    total: '10.20',
                    type: 'one-time',
                    extension: 2
                },
            };
            const res = { render: sinon.spy() };

            paypalController.getPaypal(req, res, () => {});

            expect(renderUserLayoutStub).to.have.been.calledWithExactly(
                req,
                res,
                '../payment/paypalGateway',
                {
                    data: 'id=123&product=Special%20Product%20%26%20Co&total=10.20&type=one-time',
                    extension: 2,
                }
            );
        });

        it('should function correctly without a callback', () => {
            const req = {
                query: {
                    id: '123',
                    product: 'Test Product',
                    total: '10.00',
                    type: 'subscription',
                    extension: 3
                },
            };
            const res = { render: sinon.spy() };

            paypalController.getPaypal(req, res);

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
        it('should handle missing parameters gracefully', async () => {
            const req = {
                query: {
                    // Missing some mandatory parameters like 'id' or 'total'
                    type: 'retrieval_extension',
                    extension: 3,
                },
            };
            const res = { render: sinon.spy() };

            await paypalController.cancelPayment(req, res);

            expect(updateTransactionStub).not.to.have.been.called;
            expect(renderUserLayoutStub).to.have.been.calledWith(req, res, '../payment/error', {
                message: 'Missing required parameters'
            });
        });

        it('should handle errors when transaction update fails', async () => {
            const req = {
                query: {
                    id: '123',
                    total: '10.00',
                    type: 'retrieval_extension',
                    extension: 3,
                },
            };
            const res = { render: sinon.spy() };
            const error = new Error('Database update failed');
            updateTransactionStub.rejects(error);

            await paypalController.cancelPayment(req, res);

            expect(updateTransactionStub).to.have.been.calledOnce;
            expect(renderUserLayoutStub).to.have.been.calledWith(req, res, '../payment/error', {
                message: 'Error processing your request'
            });
        });
    });
});