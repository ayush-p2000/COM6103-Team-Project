const sinon = require('sinon');
const chai = require('chai');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);
const { expect } = chai;

const nodemailer = require('nodemailer');
const proxyquire = require('proxyquire');

describe('contactUs', () => {
    let contactUs;
    let sendMailStub;
    let emailStub;
    let req;
    let res;

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

        req = {
            body: {
                name: 'John Doe',
                email: 'johndoe@example.com',
                message: 'This is a test message.'
            }
        };

        res = {
            redirect: sinon.spy()
        };
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should send an email to the recipient and a confirmation email to the sender', async () => {
        await contactUs(req, res, () => {});

        expect(sendMailStub).to.have.been.calledOnce;
        expect(emailStub).to.have.been.calledOnce;
        expect(res.redirect).to.have.been.calledWith('/?messages=' + encodeURIComponent(JSON.stringify(['Message has been sent. Check your email to find the confirmation email'])));
    });

    it('should handle errors when sending the email', async () => {
        const error = new Error('Failed to send email');
        sendMailStub.rejects(error);

        const consoleErrorStub = sinon.stub(console, 'error');

        await contactUs(req, res, () => {});

        expect(sendMailStub).to.have.been.calledOnce;
        expect(emailStub).to.have.been.calledOnce;
        expect(consoleErrorStub).to.have.been.calledWith(error);
        expect(res.redirect).to.have.been.calledWith('/?messages=' + encodeURIComponent(JSON.stringify(['Message has been sent. Check your email to find the confirmation email'])));

        consoleErrorStub.restore();
    });
});