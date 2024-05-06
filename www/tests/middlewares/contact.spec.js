const sinon = require('sinon');
const chai = require('chai');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);
const { expect } = chai;

const nodemailer = require('nodemailer');
const proxyquire = require('proxyquire');

describe('contactUs', () => {
    let contactUs, sendMailStub, emailStub, req, res;

    beforeEach(() => {
        sendMailStub = sinon.stub();
        emailStub = sinon.stub();

        contactUs = proxyquire('../../middlewares/Contact', {
            nodemailer: {
                createTransport: sinon.stub().returns({
                    sendMail: sendMailStub
                })
            },
            '../public/javascripts/Emailing/emailing': {
                email: emailStub
            }
        });

        res = {
            redirect: sinon.spy()
        };
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should redirect with error message when required parameters are missing', async () => {
        req = {
            body: {
                email: 'johndoe@example.com', // Missing 'name' and 'message'
            }
        };

        await contactUs(req, res, () => {});

        const expectedMessages = encodeURIComponent(JSON.stringify(['Missing required parameters']));
        expect(res.redirect).to.have.been.calledWith('/?messages=' + expectedMessages);
        expect(sendMailStub).not.to.have.been.called;
        expect(emailStub).not.to.have.been.called;
    });

    it('should send an email and a confirmation email when all parameters are provided', async () => {
        req = {
            body: {
                name: 'John Doe',
                email: 'johndoe@example.com',
                message: 'This is a test message.'
            }
        };

        await contactUs(req, res, () => {});

        expect(sendMailStub).to.have.been.calledOnce;
        expect(emailStub).to.have.been.calledOnceWith(
            'johndoe@example.com',
            'Thanks for contacting us!',
            sinon.match.string // Matches any string for the message
        );
        const successMessage = encodeURIComponent(JSON.stringify(['Message has been sent. Check your email to find the confirmation email']));
        expect(res.redirect).to.have.been.calledWith('/?messages=' + successMessage);
    });

    it('should handle errors when sending the email (nodemailer error)', async () => {
        req = {
            body: {
                name: 'John Doe',
                email: 'johndoe@example.com',
                message: 'This is a test message.'
            }
        };
        const error = new Error('Failed to send email');
        sendMailStub.rejects(error);

        const consoleErrorStub = sinon.stub(console, 'error');

        await contactUs(req, res, () => {});

        expect(sendMailStub).to.have.been.calledOnce;
        expect(emailStub).not.to.have.been.called; // Email confirmation should not be sent if initial send fails
        expect(consoleErrorStub).to.have.been.calledWith('Failed to send email:', error);
        const errorMessage = encodeURIComponent(JSON.stringify(['Error sending message']));
        expect(res.redirect).to.have.been.calledWith('/?messages=' + errorMessage);

        consoleErrorStub.restore();
    });
});