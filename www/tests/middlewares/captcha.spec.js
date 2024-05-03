const {mock_user} = require("../mocks/user")
const expect = require('chai').expect;
const sandbox = require("sinon").createSandbox();
const {validateCaptcha} = require("../../middlewares/captcha")
const axios = require('axios');

const proxyquire = require('proxyquire');
const dotenv = require('dotenv')
const parse = require('dotenv-parse-variables')

let env = dotenv.config({path: __dirname + '/../../.env.test'})
if (env.error) {
    throw env.error
}
env = parse(env, {assignToProcessEnv: true, overrideProcessEnv: true})

describe("Test Captcha Middleware", () => {

    describe("Validate Captcha", () => {
        let res,req,next;
        beforeEach(() => {
            req = {
                body: {
                    token: "test-token"
                },
                connection: {
                    remoteAddress: '127.0.0.1'
                },
                session : {
                    messages: []
                }
            }
            res = {
                redirect: sandbox.stub()
            }
            next = sandbox.stub()
        })
        afterEach(() => {
            sandbox.restore()
        })
        it("should call next if captcha validation has been successful", async () => {
            sandbox.stub(axios, 'post').resolves({ data: { success: true } });

            await validateCaptcha(req,res,next)

            expect(next.calledOnce).to.be.true;
            expect(res.redirect.called).to.be.false;
        })
        it('should redirect and set session messages when captcha check fails', async () => {
            sandbox.stub(axios, 'post').resolves({ data: { success: false } });

            await validateCaptcha(req, res, next);

            expect(next.called).to.be.false;
            expect(res.redirect.calledOnce).to.be.true;
            expect(res.redirect.calledWith(req.path)).to.be.true;
            expect(req.session.messages).to.deep.equal(["Google ReCaptchaV3 Check Failed!","Please restart your browser or your computer."]);
        });

    })
})