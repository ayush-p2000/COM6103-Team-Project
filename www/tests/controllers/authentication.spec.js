const {mock_user} = require("../mocks/user")
const expect = require('chai').expect;
const sandbox = require("sinon").createSandbox();
const {randomBytes, pbkdf2} = require("node:crypto")

const {
    verifyEmail,
    registerUser,
    logoutUser,
    getLoginPage,
    getRegisterPage,
    getForgotPassword,
    getResetPasswordPage,
    generateRandomToken,
    resetPasswordLink,
    resetPassword
} = require("../../controllers/auth/authenticationController");
const proxyquire = require('proxyquire');
const dotenv = require('dotenv')
const parse = require('dotenv-parse-variables')
const {mock} = require("sinon");

let env = dotenv.config({path: __dirname + '/../../.env.test'})
if (env.error) {
    throw env.error
}
env = parse(env, {assignToProcessEnv: true, overrideProcessEnv: true})


describe("Test Authentication Controller", () => {
    // describe("Register user", () => {
    //     let req, res, next,findOne, authController, save;
    //     beforeEach(() => {
    //         findOne = sandbox.stub();
    //         save = sandbox.stub();
    //         authController = proxyquire('../../controllers/auth/authenticationController',
    //             {
    //                 '../../model/models': {
    //                     User: {
    //                         findOne,
    //                         save
    //                     }
    //                 }
    //             });
    //         next = sandbox.spy()
    //         req = {
    //             login: sandbox.spy()
    //         }
    //         res = {
    //             render: sandbox.spy(),
    //             redirect: sandbox.spy()
    //         }
    //     })
    //     it('should register a new user', async () => {
    //         req = {
    //             ...req,
    //             body: {
    //                 ...mock_user
    //             },
    //             isLoggedIn: false
    //         };
    //
    //         findOne.withArgs(req.body.email).resolves({})
    //         save.resolves(mock_user)
    //         await authController.registerUser(req, res, next);
    //
    //         // Assertions
    //         expect(req.login.calledOnce).to.be.true;
    //         // Add more assertions as needed
    //     });
    //
    //     it('should render registration page with error message if email already exists', async () => {
    //         // Mock req, res, and next objects
    //         const req = {
    //             body: {
    //                 // Provide existing email for testing
    //             },
    //             session: {
    //                 messages: []
    //             },
    //             isLoggedIn: false // Assuming user is not logged in
    //         };
    //         const res = {
    //             render: sandbox.stub(),
    //             redirect: sandbox.stub()
    //         };
    //         const next = sinon.stub();
    //
    //         // Invoke the function
    //         await registerUser(req, res, next);
    //
    //         // Assertions
    //         expect(res.render.calledOnce).to.be.true;
    //         // Add more assertions as needed
    //     });
    //
    //     it('should handle error during registration', async () => {
    //         // Mock req, res, and next objects
    //         const req = {
    //             body: {
    //                 // Provide valid user data
    //             },
    //             session: {
    //                 messages: []
    //             },
    //             isLoggedIn: false // Assuming user is not logged in
    //         };
    //         const res = {
    //             render: sinon.stub(),
    //             redirect: sinon.stub(),
    //             send: sinon.stub()
    //         };
    //         const next = sinon.stub();
    //
    //         // Simulate error by passing invalid data to the function
    //         req.body = {}; // Invalid data
    //
    //         // Invoke the function
    //         await registerUser(req, res, next);
    //
    //         // Assertions
    //         expect(res.send.calledOnce).to.be.true;
    //         // Add more assertions as needed
    //     });
    // })

    describe("Logout user", () => {
        let req, res, next;
        beforeEach(() => {
            next = sandbox.stub()
        })
        afterEach(() => {
            sandbox.restore()
        });
        it('should log out the user and redirect to login page', () => {
            req = {
                logout: sandbox.stub().callsArg(0), // Simulate successful logout
                session: {
                    destroy: sandbox.stub().callsArg(0) // Simulate successful session destroy
                },
            };
            res = {

                redirect: sandbox.stub()
            };
            logoutUser(req, res, next);

            // Assertions
            expect(req.logout.calledOnce).to.be.true;
            expect(req.session.destroy.calledOnce).to.be.true;
            expect(res.redirect.calledWith('/login')).to.be.true;
        });

        it('should handle error during logout', async () => {
            req = {
                logout: sandbox.stub().callsArgWith(0, new Error('Logout error')), // Simulate logout error
                session: {
                    destroy: sandbox.stub().callsArg(0)
                },
            };
            res = {

                redirect: sandbox.stub()
            };

            await logoutUser(req, res, next);

            expect(next.calledOnce).to.be.true;
        });

        it('should handle error during session destroy', async () => {

            req = {
                logout: sandbox.stub().callsArg(0),
                session: {
                    destroy: sandbox.stub().callsArgWith(0, new Error('Session destroy error')) // Simulate session destroy error
                },
            };
            res = {

                redirect: sandbox.stub()
            };

            await logoutUser(req, res, next);

            expect(next.calledOnce).to.be.true;
        });
    })
    describe('getLoginPage', () => {
        it('should render login page', () => {
            const req = {
                isLoggedIn: true,
                user: {mock_user}
            };
            const res = {
                render: sandbox.stub()
            };
            const next = sandbox.stub();

            getLoginPage(req, res, next);

            expect(res.render.calledOnce).to.be.true;
            expect(res.render.calledWithExactly('authentication/login', {
                auth: req.isLoggedIn,
                user: req.user
            })).to.be.true;
        });
    });

    describe('getRegisterPage', () => {
        it('should render register page with', () => {
            const req = {
                isLoggedIn: true,
                user: {mock_user}
            };
            const res = {
                render: sandbox.stub()
            };
            const next = sandbox.stub();

            getRegisterPage(req, res, next);

            expect(res.render.calledOnce).to.be.true;
            expect(res.render.calledWithExactly('authentication/register', {
                auth: req.isLoggedIn,
                user: req.user
            })).to.be.true;
        });
    });

    describe('verifyEmail', () => {
        let updateOne, authController, res,req;


        beforeEach(() => {
            req = {
                query: {
                    id: 'user_id'
                }
            };
            updateOne = sandbox.stub();
            authController = proxyquire('../../controllers/auth/authenticationController',
                {
                    '../../model/models': {
                        User: {
                            updateOne,
                        }
                    }
                });
            res = {
                render: sandbox.stub()
            };
        })
        afterEach(() => {
            sandbox.restore()
        })
        it('should update user verification status and render verification page', async () => {
            updateOne.resolves({
                mock_user
            })
            await authController.verifyEmail(req, res);

            expect(updateOne.calledOnce).to.be.true;
            expect(updateOne.calledWithExactly(
                {_id: req.query.id},
                {$set: {verified: true}}
            )).to.be.true;
            expect(res.render.calledWith('authentication/verify')).to.be.true;
        });

        it('should handle error during verification', async () => {
            updateOne.rejects(new Error('Verification error'))

            await authController.verifyEmail(req, res);

            expect(updateOne.calledOnce).to.be.true;
            expect(res.render.calledOnce).to.be.false;
        });
    });

    describe('getForgotPassword', () => {
        let req,res,next;

        beforeEach(() => {
            req = {
                isLoggedIn: true,
                user: {...mock_user}
            };
            res = {
                render: sandbox.stub()
            };
        })
        afterEach(() => {
            sandbox.restore()
        })
        it('should render forgot password page with correct parameters', () => {
            getForgotPassword(req, res, next);

            expect(res.render.calledOnce).to.be.true;
            expect(res.render.calledWithExactly('authentication/forgot-password', { auth: req.isLoggedIn, user: req.user })).to.be.true;
        });
    });

    describe('getResetPasswordPage', () => {
        let req,res,next;

        beforeEach(() => {
            req = {
                isLoggedIn: true,
                user: {...mock_user}
            };
            res = {
                render: sandbox.stub()
            };
        })
        afterEach(() => {
            sandbox.restore()
        })
        it('should render reset password page with correct parameters', () => {

            getResetPasswordPage(req, res, next);

            expect(res.render.calledOnce).to.be.true;
            expect(res.render.calledWithExactly('authentication/reset-password', { auth: req.isLoggedIn, user: req.user })).to.be.true;
        });
    });


    describe('getForgotUser', () => {
        let req,res,next,findOneAndUpdate,authController;
        beforeEach(() => {
            findOneAndUpdate = sandbox.stub();
            authController = proxyquire('../../controllers/auth/authenticationController',
                {
                    '../../model/models': {
                        User: {
                            findOneAndUpdate
                        }
                    }
                });
            req = {
                body: {
                    resetEmail: 'test@example.com' // Mock reset email
                }
            };
            res = {
                send:sandbox.stub(),
                status: sandbox.stub()
            }
            next = sandbox.spy()
        })
        afterEach(() => {
            sandbox.restore()
        })
        it('should generate reset token, update user, and send email', async () => {

            findOneAndUpdate.returns(mock_user)

            // Invoke the function
            await authController.getForgotUser(req, res, next);

            // Assertions
            expect(findOneAndUpdate.calledOnce).to.be.true;
            expect(findOneAndUpdate.calledWithExactly(
                { email: req.body.resetEmail },
                { token: sandbox.match.string }
            )).to.be.true;
            expect(res.send.calledWith('Messsage has been sent to your email. Please follow the steps')).to.be.true;
        });

        it('should handle user not found', async () => {

            findOneAndUpdate.resolves(null);

            // Invoke the function
            await authController.getForgotUser(req, res, next);

            expect(findOneAndUpdate.calledOnce).to.be.true;
            expect(res.send.calledWith('User not found')).to.be.true;
        });
    });

    describe('should generate token with default number of bytes', () => {
        it('should generate a random token with default length', () => {
            const token = generateRandomToken();

            // Hexadecimal string length is twice the bytes
            expect(token.length).to.equal(32 * 2);
        });

        it('should generate a token with specified length', () => {
            const token = generateRandomToken(16);

            // Hexadecimal string length is twice the bytes
            expect(token).to.length(16 * 2);
        });
    });

    describe('resetPasswordLink', () => {
        it('should generate the reset password link with provided token', () => {
            // Mock process.env object
            const mockBaseUrl = 'http://localhost';
            const mockPort = '3000';
            const originalEnv = { ...process.env }; // Backup original process.env
            process.env.BASE_URL = mockBaseUrl;
            process.env.PORT = mockPort;

            const token = 'mocked_token';

            const link = resetPasswordLink(token);

            const expectedLink = `${mockBaseUrl}:${mockPort}/reset-password?token=${token}`;
            expect(link).to.equal(expectedLink);

            // Restore process.env to its original state
            process.env = originalEnv;
        });
    });

    describe('resetPassword', () => {
        let req,res,next,user;
        beforeEach(() => {
            user = mock_user
            req = {}
            res = {
                status: sandbox.stub().returnsThis(), // Chainable stub for status()
                send: sandbox.stub()
            };
            next = sandbox.stub()
        })
        afterEach(() => {
            sandbox.restore()
        })
        it('should reset password when user found and passwords match', async () => {

            const req = {
                body: {
                    password: 'new_password',
                    confirmPassword: 'new_password'
                }
            };
            const res = {
                status: sandbox.stub().returnsThis(),
                send: sandbox.stub(),
                redirect: sandbox.stub()
            };

            const token = "104i102phf"
            const findOneStub = sandbox.stub().resolves(user);

            // Mock User.findOneAndUpdate to resolve with updated user
            const updatedUser = { /* Updated user data */ };
            const findOneAndUpdateStub = sandbox.stub().resolves(updatedUser);

            // Mock randomBytes
            const randomBytesStub = sandbox.stub().returns('mocked_salt');

            // Mock pbkdf2Promise
            const hashedPassword = 'mocked_hashed_password';
            const pbkdf2PromiseStub = sandbox.stub().resolves(hashedPassword);

            // Invoke the function
            await resetPassword(req, res, next);

            // Assertions
            expect(findOneStub.calledWithExactly({ token })).to.be.true; // Ensure User.findOne is called with correct parameters
            expect(res.redirect.calledWithExactly('/login')).to.be.true; // Ensure redirect to login page
            // You may need more assertions based on your implementation
        });

        it('should handle user not found', async () => {
            // Mock req and res objects
            const req = { body: {} };
            const res = {
                status: sandbox.stub().returnsThis(), // Chainable stub for status()
                send: sandbox.stub()
            };
            const next = sandbox.stub();

            // Mock User.findOne to resolve with null (user not found)
            const findOneStub = sandbox.stub().resolves(null);

            // Invoke the function
            await resetPassword(req, res, next);

            // Assertions
            expect(findOneStub.calledOnceWithExactly({ token })).to.be.true; // Ensure User.findOne is called with correct parameters
            expect(res.status.calledOnceWithExactly(404)).to.be.true; // Ensure 404 status is sent
            expect(res.send.calledOnceWithExactly("User not found or invalid token")).to.be.true; // Ensure appropriate error message is sent
            // You may need more assertions based on your implementation
        });

        it('should handle passwords not matching', async () => {
            // Mock req and res objects
            const req = {
                body: {
                    password: 'new_password',
                    confirmPassword: 'different_password'
                }
            };
            // Invoke the function
            await resetPassword(req, res, next);

            // Assertions
            expect(res.status.calledOnceWithExactly(400)).to.be.true; // Ensure 400 status is sent
            expect(res.send.calledOnceWithExactly("Passwords do not match")).to.be.true; // Ensure appropriate error message is sent
            // You may need more assertions based on your implementation
        });

        it('should handle error during password hashing', async () => {
            // Mock req and res objects
            const req = {
                body: {
                    password: 'new_password',
                    confirmPassword: 'new_password'
                }
            };
            const res = {
                status: sandbox.stub().returnsThis(), // Chainable stub for status()
                send: sandbox.stub()
            };
            const next = sandbox.stub();

            // Mock User.findOne to resolve with a user
            const user = { _id: 'user_id' }; // Mock user data
            const findOneStub = sandbox.stub().resolves(user);

            // Mock randomBytes
            const randomBytesStub = sandbox.stub().returns('mocked_salt');

            // Mock pbkdf2Promise to reject with an error
            const errorMessage = 'Test error';
            const pbkdf2PromiseStub = sandbox.stub().rejects(new Error(errorMessage));

            // Invoke the function
            await resetPassword(req, res, next);

            // Assertions
            expect(res.status.calledOnceWithExactly(500)).to.be.true; // Ensure 500 status is sent
            expect(res.send.calledOnceWithExactly(`Error resetting password: ${errorMessage}`)).to.be.true; // Ensure appropriate error message is sent
            // You may need more assertions based on your implementation
        });

        it('should handle error during database operations', async () => {
            // Mock req and res objects
            const req = {
                body: {
                    password: 'new_password',
                    confirmPassword: 'new_password'
                }
            };
            const res = {
                status: sandbox.stub().returnsThis(), // Chainable stub for status()
                send: sandbox.stub()
            };
            const next = sandbox.stub();

            // Mock User.findOne to reject with an error
            const errorMessage = 'Test error';
            const findOneStub = sandbox.stub().rejects(new Error(errorMessage));

            // Invoke the function
            await resetPassword(req, res, next);

            // Assertions
            expect(res.status.calledOnceWithExactly(500)).to.be.true; // Ensure 500 status is sent
            expect(res.send.calledOnceWithExactly(`Error resetting password: ${errorMessage}`)).to.be.true; // Ensure appropriate error message is sent
            // You may need more assertions based on your implementation
        });
    });
})