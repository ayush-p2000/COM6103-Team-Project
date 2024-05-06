const { expect } = require("chai");
const proxyquire = require('proxyquire');
const sinon = require('sinon');

const { mock_user } = require("../mocks/user");
const dotenv = require("dotenv");
const parse = require("dotenv-parse-variables");

let env = dotenv.config({path: __dirname + '/../../.env.test'})
if (env.error) {
    throw env.error
}
env = parse(env, {assignToProcessEnv: true, overrideProcessEnv: true})
describe('UserController', () => {
    let sandbox;
    let UserController;
    let getUserItemsStub, getUnknownDevicesStub, getAllDevicesStub, emailStub;
    let UserStub, renderUserLayoutStub;

    beforeEach(() => {
        sandbox = sinon.createSandbox();

        // Stubs for dependencies
        getUserItemsStub = sandbox.stub();
        getUnknownDevicesStub = sandbox.stub();
        getAllDevicesStub = sandbox.stub();
        emailStub = sandbox.stub();

        UserStub = {
            findById: sandbox.stub(),
            findByIdAndUpdate: sandbox.stub(),
            findOne: sandbox.stub()
        };

        renderUserLayoutStub = sandbox.stub();

        // UserController with stubbed dependencies
        UserController = proxyquire('../../controllers/user/UserController', {
            '../../model/mongodb': {
                getUserItems: getUserItemsStub,
                getAllDevices: getAllDevicesStub
            },
            '../../model/models': { User: UserStub },
            '../../util/layout/layoutUtils': { renderUserLayout: renderUserLayoutStub },
            '../../public/javascripts/Emailing/emailing': { email: emailStub }
        });
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('getUserDashboard', () => {
        it('should handle errors if user data is not found', async () => {
            const req = { user: { id: '123' }, isLoggedIn: true };
            const res = { status: sandbox.stub().returnsThis(), send: sandbox.spy() };
            const next = sandbox.spy();

            UserStub.findById.resolves({ first_name: 'John', id: '123' });
            getUserItemsStub.rejects(new Error("Error fetching items"));

            await UserController.getUserDashboard(req, res, next);

            expect(res.status.calledWith(500)).to.be.true;
            expect(res.send.calledWith("An internal server error occurred.")).to.be.true;
        });
    });

    describe('updateUserDetails', () => {
        it('should update user details and send a confirmation email', async () => {
            const req = {
                user: { id: '123' },
                body: {
                    firstName: 'John',
                    lastName: 'Doe',
                    phone: '1234567890',
                    addressFirst: '123 Main St',
                    addressSecond: 'Apt 4B',
                    postCode: '12345',
                    city: 'Anytown',
                    county: 'Anycounty',
                    country: 'USA'
                },
                session: {}
            };
            const res = {
                status: sandbox.stub().returnsThis(),
                send: sandbox.spy(),
                redirect: sandbox.spy(),
                render: sandbox.spy()
            };
            const next = sandbox.spy();
            // Mock user data with undefined email
            const mockUserData = { ...mock_user, _id: '123', google_id: null, facebook_id: null, first_name: 'John', last_name: 'Doe', email: undefined };
            UserStub.findOne.resolves(mockUserData);
            UserStub.findByIdAndUpdate.resolves(mockUserData);

            const emailPromise = new Promise((resolve) => {
                emailStub.callsFake((...args) => {
                    resolve(args);
                });
            });

            await UserController.updateUserDetails(req, res, next);

            expect(UserStub.findOne.calledWith({ _id: '123' })).to.be.true;
            expect(UserStub.findByIdAndUpdate.calledWith('123', sinon.match.object, { new: true })).to.be.true;

            const emailArgs = await emailPromise;

            // Check if the email is expected to be undefined or null
            if (mockUserData.email === undefined || mockUserData.email === null) {
                expect(emailArgs[0]).to.be.undefined; // Assert that the first argument (emailid) is undefined
            } else {
                expect(emailArgs[0]).to.equal(mockUserData.email); // Assert that the first argument (emailid) is the email from mock data
            }

            expect(emailArgs[1]).to.equal('Update Profile Successful'); // Assert the second argument (subject)
            expect(emailArgs[2]).to.match(/Dear John/); // Assert that the third argument (textmsg) starts with "Dear John"

            expect(renderUserLayoutStub.calledWith(req, res, 'user_profile', sinon.match.object)).to.be.true;
            expect(res.status.notCalled).to.be.true;
            expect(res.send.notCalled).to.be.true;
            expect(next.notCalled).to.be.true;
        });

        it('should handle errors (Server error or Connection issues) during the update process', async () => {
            const req = {
                user: { id: '123' },
                body: {
                    firstName: 'John',
                    lastName: 'Doe'
                },
                session: {}
            };
            const res = {
                status: sandbox.stub().returnsThis(),
                send: sandbox.spy(),
                redirect: sandbox.spy(),
                render: sandbox.spy()
            };
            const next = sandbox.spy();

            const mockUserData = { ...mock_user, _id: '123', google_id: null, facebook_id: null, first_name: 'Jane', last_name: 'Doe', email: 'jane@example.com' };
            UserStub.findOne.resolves(mockUserData);
            UserStub.findByIdAndUpdate.rejects(new Error('Database error'));

            await UserController.updateUserDetails(req, res, next);

            expect(UserStub.findByIdAndUpdate.called).to.be.true;
            expect(emailStub.notCalled).to.be.true;
            expect(renderUserLayoutStub.notCalled).to.be.true;
            expect(res.status.calledWith(500)).to.be.true;
            expect(res.send.calledWith('Server error during profile update.')).to.be.true;
            expect(next.notCalled).to.be.true;
        });

        it('should redirect to /profile if no fields are updated', async () => {
            const req = {
                user: { id: '123' },
                body: {},
                session: {}
            };
            const res = {
                status: sandbox.stub().returnsThis(),
                send: sandbox.spy(),
                redirect: sandbox.spy(),
                render: sandbox.spy()
            };
            const next = sandbox.spy();

            const mockUserData = { ...mock_user, _id: '123', google_id: null, facebook_id: null, first_name: 'John', last_name: 'Doe', email: 'john@example.com' };
            UserStub.findOne.resolves(mockUserData);

            await UserController.updateUserDetails(req, res, next);

            expect(UserStub.findByIdAndUpdate.notCalled).to.be.true;
            expect(emailStub.notCalled).to.be.true;
            expect(renderUserLayoutStub.notCalled).to.be.true;
            expect(res.redirect.calledWith('/profile')).to.be.true;
            expect(res.status.notCalled).to.be.true;
            expect(res.send.notCalled).to.be.true;
            expect(next.notCalled).to.be.true;
        });

        it('should return 404 if user not found', async () => {
            const req = {
                user: { id: '123' },
                body: {
                    firstName: 'John',
                    lastName: 'Doe'
                },
                session: {}
            };
            const res = {
                status: sandbox.stub().returnsThis(),
                send: sandbox.spy(),
                redirect: sandbox.spy()
            };
            const next = sandbox.spy();

            UserStub.findOne.resolves(null);

            await UserController.updateUserDetails(req, res, next);

            expect(UserStub.findOne.calledWith({ _id: '123' })).to.be.true;
            expect(UserStub.findByIdAndUpdate.notCalled).to.be.true;
            expect(emailStub.notCalled).to.be.true;
            expect(renderUserLayoutStub.notCalled).to.be.true;
            expect(res.status.calledWith(404)).to.be.true;
            expect(res.send.calledWith('User not found.')).to.be.true;
            expect(next.notCalled).to.be.true;
        });

        it('should return 404 if user ID is missing', async () => {
            const req = {
                user: {},
                body: {
                    firstName: 'John',
                    lastName: 'Doe'
                },
                session: {}
            };
            const res = {
                status: sandbox.stub().returnsThis(),
                send: sandbox.spy(),
                redirect: sandbox.spy(),
                render: sandbox.spy()
            };
            const next = sandbox.spy();

            await UserController.updateUserDetails(req, res, next);

            expect(UserStub.findOne.notCalled).to.be.true;
            expect(UserStub.findByIdAndUpdate.notCalled).to.be.true;
            expect(emailStub.notCalled).to.be.true;
            expect(renderUserLayoutStub.notCalled).to.be.true;
            expect(res.status.calledWith(404)).to.be.true;
            expect(res.send.calledWith('User not found.')).to.be.true;
            expect(next.notCalled).to.be.true;
        });
    });
    describe('getUserProfile', () => {
        it('should render user profile with user data and isGoogleAuthenticated flag', async () => {
            const req = {
                user: {
                    id: '123'
                }
            };
            const res = {
                send: sandbox.spy()
            };
            const next = sandbox.spy();

            const mockUserData = { ...mock_user, _id: '123', google_id: '456' };
            UserStub.findById.resolves(mockUserData);

            await UserController.getUserProfile(req, res, next);

            expect(UserStub.findById.calledWith({ _id: '123' })).to.be.true;
            expect(renderUserLayoutStub.calledWith(req, res, 'user_profile', {
                userData: mockUserData,
                isGoogleAuthenticated: true
            })).to.be.true;
            expect(res.send.notCalled).to.be.true;
            expect(next.notCalled).to.be.true;
        });

        it('should send "No user found" error if user not found', async () => {
            const req = {
                user: {
                    id: '123'
                }
            };
            const res = {
                send: sandbox.spy()
            };
            const next = sandbox.spy();

            UserStub.findById.resolves(null);

            await UserController.getUserProfile(req, res, next);

            expect(UserStub.findById.calledWith({ _id: '123' })).to.be.true;
            expect(renderUserLayoutStub.notCalled).to.be.true;
            expect(res.send.calledWith('No user found')).to.be.true;
            expect(next.notCalled).to.be.true;
        });
    });
});
