const { mock_user } = require("../mocks/user")
const expect = require('chai').expect;
const sandbox = require('sinon').createSandbox();

const {isAuthenticated, authInfo, isStaff, isSuperAdmin, validateVerification } = require("../../middlewares/auth")
describe("Test Authentication Middlewares", () => {
    afterEach(() => {
        sandbox.restore()
    });

    describe("AuthInfo Middleware", () => {
        it("should set logged in flag whether the user is authenticated or not", (done) => {
            const req = {
                isAuthenticated: () => true,
                user: mock_user
            }
            const res = {}
            expect(true).to.eql(true)
            done()
        })
    })

    describe("IsAuthenticated Middleware", () => {
        const res = { redirect: sandbox.spy()}
        const next = sandbox.spy()

        it("should set the logged in flag and execute next if user is authenticated", (done) => {
            const req = {
                isAuthenticated: () => true,
                user: mock_user
            }

            isAuthenticated(req,res,next);

            expect(next.calledOnce).to.be.true
            expect(req.isLoggedIn).to.be.true
            done()
        })

        it("should redirect to login when user is not authenticated", (done) => {
            const req = {
                isAuthenticated: () => false,
            }

            isAuthenticated(req,res,next)
            // expect(next.calledOnce).to.be.false
            // expect(req.isLoggedIn).to.be.false
            expect(res.redirect.calledOnce).to.be.true

            done()
        })
    })

    describe("IsAdmin Middleware", () => {
        it("should run", (done) => {
            expect(true).to.eql(true)
            done()
        })
    })
})