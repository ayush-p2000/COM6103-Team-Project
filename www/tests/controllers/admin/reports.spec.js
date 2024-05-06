const {expect} = require("chai");
const proxyquire = require('proxyquire');
const {
    mockRequest,
    mockResponse
} = require("mock-req-res");
const deviceCategory = require("../../../model/enum/deviceCategory");
const deviceState = require("../../../model/enum/deviceState");
const accountStatus = require("../../../model/enum/accountStatus");
const roleTypes = require("../../../model/enum/roleTypes");
const {quoteState} = require("../../../model/enum/quoteState");
const {generateFakeDevice} = require("../../mocks/device");

const {faker} = require('@faker-js/faker');

const sandbox = require('sinon').createSandbox();

let getSalesCountByMonth = sandbox.stub();
let getSalesValueByMonth = sandbox.stub();
let getAllSalesOrderedByDate = sandbox.stub();
let getReferralCountByMonth = sandbox.stub();
let getReferralValueByMonth = sandbox.stub();
let getAllReferralsOrderedByDate = sandbox.stub();
let getDevicesGroupByCategory = sandbox.stub();
let getAllDevices = sandbox.stub();

let renderAdminLayout = sandbox.spy();
let renderAdminLayoutPlaceholder = sandbox.spy();

let adminReportsController;

let req = {}, res = {}, next = sandbox.spy();

function prepareMonthLabels(months) {
    const expectedLabels = [];
    const currentMonth = new Date().getMonth();

    for (let i = 0; i < months; i++) {
        //Determine the month
        const month = currentMonth - i < 0 ? 12 + (currentMonth - i) : currentMonth - i;
        //Determine the year for the month
        const year = new Date().getFullYear() - (currentMonth - i < 0 ? 1 : 0);

        //Add the short month name and year to the labels array
        expectedLabels.push(new Date(year, month).toLocaleString('default', {month: 'short'}) + " " + year);
    }
    expectedLabels.reverse();
    return expectedLabels;
}

describe('Test Admin Reports Controller', () => {
    beforeEach(() => {
        req = mockRequest();
        res = mockResponse();

        req.session = {};

        next = sandbox.spy();
    });

    describe('Test getReportsPage', () => {
        beforeEach(() => {
            renderAdminLayout = sandbox.spy();

            adminReportsController = proxyquire('../../../controllers/admin/adminReportsController', {
                '../../util/layout/layoutUtils': {
                    renderAdminLayout
                }
            });
        });

        it('should render the reports page', async () => {
            // Arrange
            // This page takes no live data as it is loaded via Axios

            // Act
            await adminReportsController.getReportsPage(req, res, next);

            // Assert
            expect(renderAdminLayout.calledOnce).to.be.true;
            expect(renderAdminLayout.calledWith(req, res, "reports/reports", {
                deviceCategory,
                deviceState,
                accountStatus,
                roleTypes,
                quoteState
            }));
        });
    });

    describe('Test getReportPage', () => {
        beforeEach(() => {
            renderAdminLayout = sandbox.spy();

            adminReportsController = proxyquire('../../../controllers/admin/adminReportsController', {
                '../../util/layout/layoutUtils': {
                    renderAdminLayout
                }
            });

        });

        it('should render the report page', async () => {
            // Arrange
            req.params = {
                report_type: "sales"
            };

            // Act
            await adminReportsController.getReportPage(req, res, next);

            // Assert
            expect(renderAdminLayout.calledOnce).to.be.true;
            expect(renderAdminLayout.calledWith(req, res, "reports/report", {
                title: "Sales",
                report: "sales",
                deviceCategory,
                deviceState,
                accountStatus,
                roleTypes,
                quoteState,
                quoteStateToColour: quoteState.stateToColour,
                quoteStateToString: quoteState.stateToString
            }));
        });
    });

    describe('Test getReportChartData', () => {

    });

    describe('Test getReportTableData', () => {

    });

    describe('Test prepareSalesData', () => {
        beforeEach(() => {
            getSalesCountByMonth = sandbox.stub();
            getSalesValueByMonth = sandbox.stub();
            getAllSalesOrderedByDate = sandbox.stub();

            adminReportsController = proxyquire('../../../controllers/admin/adminReportsController', {
                '../../model/mongodb': {
                    getSalesCountByMonth,
                    getSalesValueByMonth,
                    getAllSalesOrderedByDate
                }
            });
        });

        it('should prepare the data for the sales report', async () => {
            // Arrange
            let date = new Date();
            date.setMonth(date.getMonth() - 3);


            getSalesCountByMonth.resolves([{
                _id: {
                    month: date.getMonth(),
                    year: date.getFullYear()
                },
                total: 5
            }]);

            getSalesValueByMonth.resolves([{
                _id: {
                    month: date.getMonth(),
                    year: date.getFullYear()
                },
                value: 100
            }]);

            const salesData = [{
                date: date,
                device: generateFakeDevice(),
                value: 100,
                purchase_type: 0
            }];

            getAllSalesOrderedByDate.resolves(salesData);

            const expectedLabels = prepareMonthLabels(12);
            const expectedCounts = [0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0];
            const expectedValues = [0, 0, 0, 0, 0, 0, 0, 100, 0, 0, 0, 0];
            const expectedTable = [{
                date: date.toLocaleString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric'
                }),
                user: salesData[0].device.listing_user,
                product: salesData[0].device,
                sale_value: salesData[0].value,
                purchase_type: salesData[0].purchase_type
            }]

            // Act
            const data = await adminReportsController.prepareSalesData();

            // Assert
            expect(data.labels).to.eql(expectedLabels);
            expect(data.datasets[0]).to.eql(expectedCounts);
            expect(data.datasets[1]).to.eql(expectedValues);
            expect(data.table).to.eql(expectedTable);
        });
    });

    describe('Test prepareReferralsData', () => {
        beforeEach(() => {
            getReferralCountByMonth = sandbox.stub();
            getReferralValueByMonth = sandbox.stub();
            getAllReferralsOrderedByDate = sandbox.stub();

            adminReportsController = proxyquire('../../../controllers/admin/adminReportsController', {
                '../../model/mongodb': {
                    getReferralCountByMonth,
                    getReferralValueByMonth,
                    getAllReferralsOrderedByDate
                }
            });
        });

        it('should prepare the data for the referrals report', async () => {
            // Arrange
            let date = new Date();
            date.setMonth(date.getMonth() - 3);

            getReferralCountByMonth.resolves([{
                _id: {
                    month: date.getMonth()
                },
                month: date.getMonth(),
                year: date.getFullYear(),
                total: 3
            }]);

            getReferralValueByMonth.resolves([{
                _id: {
                    month: date.getMonth(),
                },
                month: date.getMonth(),
                year: date.getFullYear(),
                value: 50
            }]);

            const referralsData = [{
                confirmation_details: {
                    final_price: 100,
                    receipt_date: date
                },
                state: quoteState.CONVERTED,
                device: generateFakeDevice(),

                provider: {
                    name: faker.company.name(),
                    logo: faker.image.url()
                }
            }];

            getAllReferralsOrderedByDate.resolves(referralsData);

            const expectedLabels = prepareMonthLabels(12);
            const expectedCounts = [0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0];
            const expectedValues = [0, 0, 0, 0, 0, 0, 0, 50, 0, 0, 0, 0];
            const expectedTable = [{
                date_of_referral: date.toLocaleString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric'
                }),
                user: referralsData[0].device.listing_user,
                product: referralsData[0].device,

                state: quoteState.CONVERTED,
                state_string: quoteState.stateToString(quoteState.CONVERTED),
                state_colour: quoteState.stateToColour(quoteState.CONVERTED),

                referral_amount: referralsData[0].confirmation_details.final_price,
                provider: referralsData[0].provider.name,
                provider_logo: referralsData[0].provider.logo,
            }];

            // Act
            const data = await adminReportsController.prepareReferralsData();

            // Assert
            expect(data.labels).to.eql(expectedLabels);
            expect(data.datasets[0]).to.eql(expectedCounts);
            expect(data.datasets[1]).to.eql(expectedValues);
            expect(data.table).to.eql(expectedTable);
        });
    });

    describe('Test prepareClassesData', () => {
        beforeEach(() => {
            getDevicesGroupByCategory = sandbox.stub();
            getAllDevices = sandbox.stub();

            adminReportsController = proxyquire('../../../controllers/admin/adminReportsController', {
                '../../model/mongodb': {
                    getDevicesGroupByCategory,
                    getAllDevices
                }
            });
        });

        it('should prepare the data for the classes report', async () => {
            // Arrange
            getDevicesGroupByCategory.resolves([{
                _id: deviceCategory.CURRENT,
                total: 2
            }, {
                _id: deviceCategory.RARE,
                total: 3
            }]);

            const deviceData = [
                generateFakeDevice(faker.database.mongodbObjectId(), deviceCategory.CURRENT),
                generateFakeDevice(faker.database.mongodbObjectId(), deviceCategory.CURRENT),
                generateFakeDevice(faker.database.mongodbObjectId(), deviceCategory.RARE),
                generateFakeDevice(faker.database.mongodbObjectId(), deviceCategory.RARE),
                generateFakeDevice(faker.database.mongodbObjectId(), deviceCategory.RARE)
            ];

            deviceData.forEach(device => {
                device.listing_user = generateFakeUser();
            })

            getAllDevices.resolves(deviceData);

            const expectedLabels = ["Current", "Rare", "Recycle", "Unknown"];
            const expectedData = [2, 3, 0, 0];
            const expectedTable = deviceData.map(device => {
                return {
                    name: device.brand.name + " " + device.model.name,

                    category: device.category,
                    category_string: deviceCategory.deviceCategoryToString(device.category),
                    category_colour: deviceCategory.deviceCategoryToColour(device.category),

                    state: device.state,
                    state_string: deviceState.deviceStateToString(device.state),
                    state_colour: deviceState.deviceStateToColour(device.state),

                    date_added: device.createdAt.toLocaleString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric'
                    }),

                    user: device.listing_user,

                    device_id: device._id
                }
            });

            // Act
            const data = await adminReportsController.prepareClassesData();

            // Assert
            expect(data.labels).to.eql(expectedLabels);
            expect(data.datasets[0]).to.eql(expectedData);
            expect(data.table).to.eql(expectedTable);
        });
    });

    describe('Test prepareCasesData', () => {

    });
});