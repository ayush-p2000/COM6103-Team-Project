const {mock_user} = require("../mocks/user")
const expect = require('chai').expect;
const sandbox = require("sinon").createSandbox();

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
    checkAgeGoogle
} = require("../../controllers/auth/authenticationController");
const proxyquire = require('proxyquire');
const dotenv = require('dotenv')
const parse = require('dotenv-parse-variables')
const {faker} = require("@faker-js/faker");

let env = dotenv.config({path: __dirname + '/../../.env.test'})
if (env.error) {
    throw env.error
}
env = parse(env, {assignToProcessEnv: true, overrideProcessEnv: true})


describe("Test Authentication Controller", () => {
    describe("Register user", () => {
        let req, res, next, findOne, authController, create;
        beforeEach(() => {
            findOne = sandbox.stub();
            create = sandbox.stub();
            authController = proxyquire('../../controllers/auth/authenticationController',
                {
                    '../../model/models': {
                        User: {
                            findOne,
                            create,
                        }
                    }
                });
            next = sandbox.spy()
            req = {
                login: sandbox.spy(),
                body: {
                    firstName: faker.person.firstName(),
                    lastName: faker.person.lastName(),
                    dateOfBirth: faker.date.past(),
                    email: faker.internet.email(),
                    phone: faker.phone.number(),
                    address_1: faker.location.streetAddress(),
                    address_2: faker.location.secondaryAddress(),
                    postcode: faker.location.zipCode(),
                    city: faker.location.city(),
                    county: faker.location.county(),
                    country: faker.location.country(),
                    password: 'passwordpassword'
                },
                session: {
                    messages: []
                }
            }
            res = {
                render: sandbox.spy(),
                redirect: sandbox.spy(),
                send: sandbox.spy()
            }
        })
        it('should register a new user', async () => {
            req = {
                ...req,
                isLoggedIn: false
            };
            findOne.withArgs(req.body.email).resolves(null)
            create.resolves(mock_user)
            await authController.registerUser(req, res, next);

            // Assertions
            expect(req.login.calledOnce).to.be.true;
        });
        //
        it('should render registration page with error message if email already exists', async () => {
            req = {
                ...req,
                isLoggedIn: false
            }
            findOne.resolves(mock_user)

            // Invoke the function
            await authController.registerUser(req, res, next);

            // Assertions
            expect(res.render.calledWith("authentication/register")).to.be.true;
            expect(req.isLoggedIn).to.be.false
        });

        it('should handle error during registration', async () => {

            // Simulate error by passing invalid data to the function
            req.body = {}; // Invalid data

            // Invoke the function
            await authController.registerUser(req, res, next);

            // Assertions
            expect(next.calledOnce).to.be.true;
        });
    })

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
        let updateOne, authController, res, req;


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
        let req, res, next;

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
            expect(res.render.calledWithExactly('authentication/forgot-password', {
                auth: req.isLoggedIn,
                user: req.user
            })).to.be.true;
        });
    });

    describe('getResetPasswordPage', () => {
        let req, res, next;

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
            expect(res.render.calledWithExactly('authentication/reset-password', {
                auth: req.isLoggedIn,
                user: req.user
            })).to.be.true;
        });
    });


    describe('getForgotUser', () => {
        let req, res, next, findOneAndUpdate, authController;
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
                send: sandbox.stub(),
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
                {email: req.body.resetEmail},
                {token: sandbox.match.string}
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

    describe('Generate Random Token', () => {
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
            const originalEnv = {...process.env}; // Backup original process.env
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
        let req, res, next, user, updateOne, authController, findOneAndUpdate, findOne, token, pbkdf2Promise;
        beforeEach(() => {
            token = "104i102phf"
            user = mock_user
            req = {
                body: {
                    password: 'new_password',
                    confirmPassword: 'new_password'
                }
            }
            updateOne = sandbox.stub();
            findOne = sandbox.stub();
            findOneAndUpdate = sandbox.stub()
            pbkdf2Promise = sandbox.stub()
            authController = proxyquire('../../controllers/auth/authenticationController',
                {
                    '../../model/models': {
                        User: {
                            updateOne,
                            findOneAndUpdate,
                            findOne,
                        }
                    },
                });
            res = {
                status: sandbox.stub().returnsThis(), // Chainable stub for status()
                send: sandbox.stub(),
                redirect: sandbox.stub()
            };
            next = sandbox.stub()
        })
        afterEach(() => {
            sandbox.restore()
        })
        it('should reset password when user found and passwords match', async () => {

            findOne.resolves(mock_user)
            findOneAndUpdate.resolves(mock_user);

            // Mock randomBytes
            const salt = "salt"
            // Mock pbkdf2Promise
            const hashedPassword = 'mocked_hashed_password';
            pbkdf2Promise.resolves(hashedPassword);

            // Invoke the function
            await authController.resetPassword(req, res, next);

            // Assertions
            expect(findOne.calledOnce).to.be.true;
            expect(res.redirect.calledWith("/login")).to.be.true
        });

        it('should handle user not found', async () => {
            findOne.resolves(null)

            await authController.resetPassword(req, res, next);

            // Assertions
            expect(findOne.calledOnce).to.be.true;
            expect(res.status.calledWithExactly(404)).to.be.true;
            expect(res.send.calledWithExactly("User not found or invalid token")).to.be.true;
        });

        it('should handle passwords not matching', async () => {
            req = {
                body: {
                    password: 'new_password',
                    confirmPassword: 'different_password'
                }
            };
            findOne.resolves(mock_user)
            // Invoke the function
            await authController.resetPassword(req, res, next)

            // Assertions
            expect(res.status.calledWith(400)).to.be.true;
            expect(res.send.calledWithExactly("Passwords do not match")).to.be.true; // Ensure appropriate error message is sent
        });

        it('should handle error during database operations', async () => {

            findOne.rejects()

            // Invoke the function
            await authController.resetPassword(req, res, next);

            // Assertions
            expect(res.status.calledWithExactly(500)).to.be.true; // Ensure 500 status is sent
            expect(res.send.calledWithExactly(`Error resetting password`)).to.be.true; // Ensure appropriate error message is sent
        });
    });


    describe('getAgeGoogle', () => {
        let req, res, next, getUserById, authController;
        beforeEach(() => {

            req = {
                user: {
                    _id: 1254354
                }
            };
            getUserById = sandbox.stub();

            authController = proxyquire('../../controllers/auth/authenticationController',
                {
                    '../../model/mongodb': {
                        getUserById,
                    },
                });
            res = {
                render: sandbox.stub()
            };
            next = sandbox.stub()
        })
        afterEach(() => {
            sandbox.restore()
        })
        it('should render dateOfBirth view when user.date_of_birth is null', async () => {
            getUserById.withArgs(req.user._id).resolves({date_of_birth: null});

            await authController.getAgeGoogle(req, res, next);

            // Assertions
            expect(getUserById.calledOnce).to.be.true;
            expect(res.render.calledOnce).to.be.true;
            expect(res.render.calledWithExactly('authentication/dateOfBirth', {userId: req.user._id})).to.be.true; // Ensure render is called with correct parameters
            expect(next.notCalled).to.be.true;
        });

        it('should call next when user.date_of_birth is not null', async () => {
            getUserById.withArgs(req.user._id).resolves({mock_user});

            await authController.getAgeGoogle(req, res, next);

            // Assertions
            expect(getUserById.calledOnce).to.be.true;
            expect(next.calledOnce).to.be.true;
            expect(next.calledWithExactly()).to.be.true;
        });
    });


    describe('checkAgeGoogle', () => {
        let req, res, next, authController, updateUserDob;
        beforeEach(() => {
            // Mock req.session.messages as empty
            req = {
                session: {
                    messages: [] // Simulating no messages
                },
                body: {
                    birthday: '2024-05-04',
                    id: 'user_id_here'
                }
            };
            res = {
                redirect: sandbox.stub()
            };
            next = sandbox.stub();
            updateUserDob = sandbox.stub()
            authController = proxyquire('../../controllers/auth/authenticationController',
                {
                    '../../model/mongodb': {
                        updateUserDob,
                    },
                });
        })
        afterEach(() => {
            sandbox.restore()
        })
        it('should redirect to /login when req.session.messages has a length greater than 0', async () => {
            req = {
                ...req,
                session: {
                    messages: ['message1', 'message2'] // Simulating messages being present
                }
            };

            // Call the function
            await checkAgeGoogle(req, res, next);

            // Assertions
            expect(res.redirect.calledOnce).to.be.true;
            expect(res.redirect.calledWithExactly('/login')).to.be.true;
            expect(next.notCalled).to.be.true;
        });

        it('should call updateUserDob and redirect to /auth/google when req.session.messages is empty', async () => {

            updateUserDob.resolves();

            // Call the function
            await authController.checkAgeGoogle(req, res, next);

            // Assertions
            expect(updateUserDob.calledWith(req.body.id, req.body.birthday)).to.be.true;
            expect(res.redirect.calledOnce).to.be.true;
            expect(res.redirect.calledWithExactly('/auth/google')).to.be.true;
            expect(next.notCalled).to.be.true;
        });
    });
})