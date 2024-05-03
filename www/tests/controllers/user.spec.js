const { expect } = require("chai");
const proxyquire = require('proxyquire');
const sinon = require('sinon');

const { mock_user } = require("../mocks/user");

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
        it('should handle errors while fetching user items', async () => {
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
        it('should update all user details and send email', async () => {
            const req = {
                user: { id: '123', email: 'test@example.com', first_name: 'OldName', last_name: 'OldLast', address: {} },
                body: {
                    firstName: 'NewName', lastName: 'NewLast', phone: '1234567890',
                    addressFirst: '123 Main St', addressSecond: 'Apt 4', postCode: '12345',
                    city: 'Town', county: 'County', country: 'Country'
                },
                session: { messages: [] }
            };
            const res = { redirect: sandbox.spy(), status: sandbox.stub().returnsThis(), send: sandbox.spy() };

            UserStub.findOne.resolves({ google_id: null, facebook_id: null });
            UserStub.findByIdAndUpdate.resolves({});

            await UserController.updateUserDetails(req, res, sinon.spy());

            sinon.assert.calledWith(emailStub, 'test@example.com', sinon.match.string, sinon.match.string);
            expect(res.redirect.calledOnceWith("/profile")).to.be.false;
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
