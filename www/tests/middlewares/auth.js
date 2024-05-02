const { mock_user } = require("../mocks/user")
const expect = require('chai').expect;
const sandbox = require('sinon').createSandbox();

const {isAuthenticated, authInfo, isStaff, isSuperAdmin, validateVerification } = require("../../middlewares/auth")


describe("Test Authentication Middlewares", () => {
    afterEach(() => {
        sandbox.restore()
    });

    describe("AuthInfo Middleware", () => {
        const res = { redirect: sandbox.spy()}

        it("should set logged in flag to true if the user is authenticated", (done) => {
            const req = {
                isAuthenticated: () => true,
                user: mock_user
            }
            const res = {}
            const next = sandbox.spy()

            authInfo(req,res,next)
            expect(req.isLoggedIn).to.be.eql(true)
            expect(next.calledOnce).to.be.true
            done()
        })

        it("should set logged in flag to false if the user is not authenticated", done => {
            const req = {
                isAuthenticated: () => false,
            }
            const next = sandbox.spy()

            authInfo(req,res,next)
            expect(req.isLoggedIn).to.be.eql(false)
            expect(next.calledOnce).to.be.true
            done()
        })
    })

    describe("IsAuthenticated Middleware", () => {
        const res = { redirect: sandbox.spy()}

        it("should set the logged in flag and execute next if user is authenticated", (done) => {
            const req = {
                isAuthenticated: () => true,
                user: mock_user
            }
            const next = sandbox.spy()

            isAuthenticated(req,res,next);

            expect(next.calledOnce).to.be.true
            expect(req.isLoggedIn).to.be.eql(true)
            done()
        })

        it("should redirect to login when user is not in the session or not authenticated", (done) => {
            const req = {
                isAuthenticated: () => false,
            }
            const next = sandbox.spy()

            isAuthenticated(req,res,next)
            expect(req.isLoggedIn).to.be.eql(false)
            expect(res.redirect.calledWith("/login")).to.be.true
            done()
        })
    })

    describe("IsStaff Middleware", () => {
        const res = { redirect: sandbox.spy()}

        it("should redirect to the dashboard if the user has a user role", (done) => {
            const req = {
                user: {
                    role: 0
                }
            }
            const next = sandbox.spy()

            isStaff(req,res,next)
            expect(res.redirect.calledWith("/dashboard")).to.be.true
            expect(next.calledOnce).to.be.false
            done()
        })

        it("should let the user access the admin side if the user has a staff role", (done) => {
            const req = {
                user: {
                    role: 1
                }
            }
            const next = sandbox.spy()

            isStaff(req,res,next)
            expect(next.calledOnce).to.be.true
            done()
        })

        it("should let access the admin if the user has an admin role", (done) => {
            const req = {
                user: {
                    role: 2
                }
            }
            const next = sandbox.spy()


            isStaff(req,res,next)
            expect(next.calledOnce).to.be.true
            done()
        })
    })

    describe("IsSuperAdmin Middleware", () => {
        const res = { redirect: sandbox.spy()}

        it("should redirect to the dashboard is the user has a user role", (done) => {
            const req = {
                user: {
                    role: 0
                }
            }
            const next = sandbox.spy()

            isSuperAdmin(req,res,next)
            expect(res.redirect.calledWith("/dashboard")).to.be.true
            expect(next.calledOnce).to.be.false
            done()
        })

        it("should redirect to the dashboard is the user has a staff role", (done) => {
            const req = {
                user: {
                    role: 1
                }
            }
            const next = sandbox.spy()

            isSuperAdmin(req,res,next)
            expect(res.redirect.calledWith("/dashboard")).to.be.true
            done()
        })

        it("should let access the admin if the user has an admin role", (done) => {
            const req = {
                user: {
                    role: 2
                }
            }
            const next = sandbox.spy()


            isSuperAdmin(req,res,next)
            expect(next.calledOnce).to.be.true
            done()
        })
    })
})