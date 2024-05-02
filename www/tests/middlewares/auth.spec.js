const {mock_user} = require("../mocks/user")
const expect = require('chai').expect;
const sandbox = require("sinon").createSandbox();
const {isAuthenticated, authInfo, isStaff, isSuperAdmin, validateVerification} = require("../../middlewares/auth")

const proxyquire = require('proxyquire');
const dotenv = require('dotenv')
const parse = require('dotenv-parse-variables')

let env = dotenv.config({path: __dirname + '/../../.env.test'})
if (env.error) {
    throw env.error
}
env = parse(env, {assignToProcessEnv: true, overrideProcessEnv: true})

const findOne = sandbox.stub();

const authMiddleware = proxyquire('../../middlewares/auth',
    {
        '../model/models': {
            User: {
                findOne
            }
        }
    });

describe("Test Authentication Middlewares", () => {
    afterEach(() => {
        sandbox.restore()
    });

    describe("AuthInfo Middleware", () => {
        const res = {redirect: sandbox.spy()}

        it("should set logged in flag to true if the user is authenticated", (done) => {
            const req = {
                isAuthenticated: () => true,
                user: mock_user
            }
            const res = {}
            const next = sandbox.spy()

            authInfo(req, res, next)
            expect(req.isLoggedIn).to.be.eql(true)
            expect(next.calledOnce).to.be.true
            done()
        })

        it("should set logged in flag to false if the user is not authenticated", done => {
            const req = {
                isAuthenticated: () => false,
            }
            const next = sandbox.spy()

            authInfo(req, res, next)
            expect(req.isLoggedIn).to.be.eql(false)
            expect(next.calledOnce).to.be.true
            done()
        })
    })

    describe("IsAuthenticated Middleware", () => {
        const res = {redirect: sandbox.spy()}

        it("should set the logged in flag and execute next if user is authenticated", (done) => {
            const req = {
                isAuthenticated: () => true,
                user: mock_user
            }
            const next = sandbox.spy()

            isAuthenticated(req, res, next);

            expect(next.calledOnce).to.be.true
            expect(req.isLoggedIn).to.be.eql(true)
            done()
        })

        it("should redirect to login when user is not in the session or not authenticated", (done) => {
            const req = {
                isAuthenticated: () => false,
            }
            const next = sandbox.spy()

            isAuthenticated(req, res, next)
            expect(req.isLoggedIn).to.be.eql(false)
            expect(res.redirect.calledWith("/login")).to.be.true
            done()
        })
    })

    describe("IsStaff Middleware", () => {
        const res = {redirect: sandbox.spy()}

        it("should redirect to the dashboard if the user has a user role", (done) => {
            const req = {
                user: {
                    role: 0
                }
            }
            const next = sandbox.spy()

            isStaff(req, res, next)
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

            isStaff(req, res, next)
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


            isStaff(req, res, next)
            expect(next.calledOnce).to.be.true
            done()
        })
    })

    describe("IsSuperAdmin Middleware", () => {
        const res = {redirect: sandbox.spy()}

        it("should redirect to the dashboard is the user has a user role", (done) => {
            const req = {
                user: {
                    role: 0
                }
            }
            const next = sandbox.spy()

            isSuperAdmin(req, res, next)
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

            isSuperAdmin(req, res, next)
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


            isSuperAdmin(req, res, next)
            expect(next.calledOnce).to.be.true
            done()
        })
    })
    describe('validateVerification Middleware', () => {
        let req, res, next;
        beforeEach(() => {
            req = {
                body: {
                    email: 'test@example.com'
                },
                isLoggedIn: true,
                user: {} // Mock user object
            };
            res = {
                render: sandbox.spy()
            };
            next = sandbox.spy();
        });
        afterEach(() => {
            sandbox.restore()
        });

        it('should render login page with verification message if user exists but not verified and not using Google authentication', async () => {
            findOne.withArgs({email: req.body.email}).returns({
                google_id: null,
                verified: false
            });

            await authMiddleware.validateVerification(req, res, next);

            expect(res.render.calledOnce).to.be.true;
            expect(res.render.calledWithExactly("authentication/login", {
                auth: true,
                user: req.user,
                messages: ['Please verify your email'],
                hasMessages: true
            })).to.be.true;
            expect(next.notCalled).to.be.true;

        });

        it('should render login page with Google authentication message if user exists and registered with Google', async () => {
            findOne.withArgs({email: req.body.email}).returns({
                email: 'test@example.com',
                google_id: 'google123',
                verified: false
            });

            await authMiddleware.validateVerification(req, res, next);

            sandbox.assert.calledOnce(findOne);
            sandbox.assert.calledWith(res.render, 'authentication/login', {
                auth: true,
                user: req.user,
                messages: ['This account was registered using Google Authentication. Please log in with Google to continue'],
                hasMessages: true
            });
        });

        it('should render register page with message if user does not exist', async () => {
            findOne.withArgs({email: req.body.email}).resolves(null);

            await authMiddleware.validateVerification(req, res, next);

            sandbox.assert.calledOnce(findOne);
            sandbox.assert.calledWith(res.render, 'authentication/register', {
                auth: true,
                user: req.user,
                messages: ['User does not exist. Please register before you can access'],
                hasMessages: true
            });
        });
    })
})