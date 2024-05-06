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
const {mock_user} = require("../../mocks/user");
const {generateFakeBrand} = require("../../mocks/brand");
const {generateFakeModel} = require("../../mocks/model");
const {generateFakeDeviceType} = require("../../mocks/deviceType");
const {generateFakeQuote} = require("../../mocks/quote");
const {generateFakeProvider} = require("../../mocks/provider");
const rewire = require("rewire");

const sandbox = require('sinon').createSandbox();

let getSalesCountByMonth = sandbox.stub();
let getSalesValueByMonth = sandbox.stub();
let getAllSalesOrderedByDate = sandbox.stub();
let getReferralCountByMonth = sandbox.stub();
let getReferralValueByMonth = sandbox.stub();
let getAllReferralsOrderedByDate = sandbox.stub();
let getDevicesGroupByCategory = sandbox.stub();
let getAllDevices = sandbox.stub();
let getDevicesGroupByState = sandbox.stub();
let getDevicesGroupByType = sandbox.stub();
let getAllDeviceTypes = sandbox.stub();
let getAccountsCountByStatus = sandbox.stub();
let getAllUsers = sandbox.stub();
let getAccountsCountByType = sandbox.stub();
let getQuotesGroupByState = sandbox.stub();
let getAllQuotes = sandbox.stub();

let prepareSalesChart = sandbox.stub();
let prepareReferralsChart = sandbox.stub();
let prepareClassesChart = sandbox.stub();
let prepareCasesChart = sandbox.stub();
let prepareTypesChart = sandbox.stub();
let prepareActiveAccountsChart = sandbox.stub();
let prepareAccountTypesChart = sandbox.stub();
let prepareQuotesChart = sandbox.stub();

let prepareSalesTable = sandbox.stub();
let prepareReferralsTable = sandbox.stub();
let prepareClassesTable = sandbox.stub();
let prepareCasesTable = sandbox.stub();
let prepareTypesTable = sandbox.stub();
let prepareActiveAccountsTable = sandbox.stub();
let prepareAccountTypesTable = sandbox.stub();
let prepareQuotesTable = sandbox.stub();

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
        beforeEach(() => {
            adminReportsController = rewire('../../../controllers/admin/adminReportsController');

            prepareSalesChart = sandbox.stub();
            prepareReferralsChart = sandbox.stub();
            prepareClassesChart = sandbox.stub();
            prepareCasesChart = sandbox.stub();
            prepareTypesChart = sandbox.stub();
            prepareActiveAccountsChart = sandbox.stub();
            prepareAccountTypesChart = sandbox.stub();
            prepareQuotesChart = sandbox.stub();

            adminReportsController.__set__('prepareSalesChart', prepareSalesChart);
            adminReportsController.__set__('prepareReferralsChart', prepareReferralsChart);
            adminReportsController.__set__('prepareClassesChart', prepareClassesChart);
            adminReportsController.__set__('prepareCasesChart', prepareCasesChart);
            adminReportsController.__set__('prepareTypesChart', prepareTypesChart);
            adminReportsController.__set__('prepareActiveAccountsChart', prepareActiveAccountsChart);
            adminReportsController.__set__('prepareAccountTypesChart', prepareAccountTypesChart);
            adminReportsController.__set__('prepareQuotesChart', prepareQuotesChart);
        });

        it('should call the correct function for the sales report', async () => {
            req.params = {
                report_type: "sales"
            }

            prepareSalesChart.resolves({});

            const data = await adminReportsController.getReportChartData(req, res, next);

            expect(prepareSalesChart.calledOnce).to.be.true;
            expect(res.json.calledOnce).to.be.true;
            expect(res.json.calledWith(data));
        });

        it('should call the correct function for the referrals report', async () => {
            req.params = {
                report_type: "referrals"
            }

            prepareReferralsChart.resolves({});

            const data = await adminReportsController.getReportChartData(req, res, next);

            expect(prepareReferralsChart.calledOnce).to.be.true;
            expect(res.json.calledOnce).to.be.true;
            expect(res.json.calledWith(data));
        });

        it('should call the correct function for the classes report', async () => {
            req.params = {
                report_type: "classes"
            }

            prepareClassesChart.resolves({});

            const data = await adminReportsController.getReportChartData(req, res, next);

            expect(prepareClassesChart.calledOnce).to.be.true;
            expect(res.json.calledOnce).to.be.true;
            expect(res.json.calledWith(data));
        });

        it('should call the correct function for the cases report', async () => {
            req.params = {
                report_type: "cases"
            }

            prepareCasesChart.resolves({});

            const data = await adminReportsController.getReportChartData(req, res, next);

            expect(prepareCasesChart.calledOnce).to.be.true;
            expect(res.json.calledOnce).to.be.true;
            expect(res.json.calledWith(data));
        });

        it('should call the correct function for the types report', async () => {
            req.params = {
                report_type: "types"
            }

            prepareTypesChart.resolves({});

            const data = await adminReportsController.getReportChartData(req, res, next);

            expect(prepareTypesChart.calledOnce).to.be.true;
            expect(res.json.calledOnce).to.be.true;
            expect(res.json.calledWith(data));
        });

        it('should call the correct function for the active accounts report', async () => {
            req.params = {
                report_type: "accounts"
            }

            prepareActiveAccountsChart.resolves({});

            const data = await adminReportsController.getReportChartData(req, res, next);

            expect(prepareActiveAccountsChart.calledOnce).to.be.true;
            expect(res.json.calledOnce).to.be.true;
            expect(res.json.calledWith(data));
        });

        it('should call the correct function for the account types report', async () => {
            req.params = {
                report_type: "account_types"
            }

            prepareAccountTypesChart.resolves({});

            const data = await adminReportsController.getReportChartData(req, res, next);

            expect(prepareAccountTypesChart.calledOnce).to.be.true;
            expect(res.json.calledOnce).to.be.true;
            expect(res.json.calledWith(data));
        });

        it('should call the correct function for the quotes report', async () => {
            req.params = {
                report_type: "quotes"
            }

            prepareQuotesChart.resolves({});

            const data = await adminReportsController.getReportChartData(req, res, next);

            expect(prepareQuotesChart.calledOnce).to.be.true;
            expect(res.json.calledOnce).to.be.true;
            expect(res.json.calledWith(data));
        });

        it('should return a 400 status code if the report type is invalid', async () => {
            req.params = {
                report_type: "invalid"
            }

            await adminReportsController.getReportChartData(req, res, next);

            expect(res.status.calledOnce).to.be.true;
            expect(res.status.calledWith(400));
        });

        it('should return a 400 status code if the report type is not provided', async () => {
            await adminReportsController.getReportChartData(req, res, next);

            expect(res.status.calledOnce).to.be.true;
            expect(res.status.calledWith(400));
        });

        it('should return a 500 status code if an error occurs', async () => {
            req.params = {
                report_type: "sales"
            }

            prepareSalesChart.rejects();

            await adminReportsController.getReportChartData(req, res, next);

            expect(res.status.calledOnce).to.be.true;
            expect(res.status.calledWith(500));
        });
    });

    describe('Test getReportTableData', () => {
        beforeEach(() => {
            adminReportsController = rewire('../../../controllers/admin/adminReportsController');

            prepareSalesTable = sandbox.stub();
            prepareReferralsTable = sandbox.stub();
            prepareClassesTable = sandbox.stub();
            prepareCasesTable = sandbox.stub();
            prepareTypesTable = sandbox.stub();
            prepareActiveAccountsTable = sandbox.stub();
            prepareAccountTypesTable = sandbox.stub();
            prepareQuotesTable = sandbox.stub();

            adminReportsController.__set__('prepareSalesTable', prepareSalesTable);
            adminReportsController.__set__('prepareReferralsTable', prepareReferralsTable);
            adminReportsController.__set__('prepareClassesTable', prepareClassesTable);
            adminReportsController.__set__('prepareCasesTable', prepareCasesTable);
            adminReportsController.__set__('prepareTypesTable', prepareTypesTable);
            adminReportsController.__set__('prepareActiveAccountsTable', prepareActiveAccountsTable);
            adminReportsController.__set__('prepareAccountTypesTable', prepareAccountTypesTable);
            adminReportsController.__set__('prepareQuotesTable', prepareQuotesTable);
        });

        it('should call the correct function for the sales report', async () => {
            req.params = {
                report_type: "sales"
            }

            prepareSalesTable.resolves({});

            const data = await adminReportsController.getReportTableData(req, res, next);

            expect(prepareSalesTable.calledOnce).to.be.true;
            expect(res.json.calledOnce).to.be.true;
            expect(res.json.calledWith(data));
        });

        it('should call the correct function for the referrals report', async () => {
            req.params = {
                report_type: "referrals"
            }

            prepareReferralsTable.resolves({});

            const data = await adminReportsController.getReportTableData(req, res, next);

            expect(prepareReferralsTable.calledOnce).to.be.true;
            expect(res.json.calledOnce).to.be.true;
            expect(res.json.calledWith(data));
        });

        it('should call the correct function for the classes report', async () => {
            req.params = {
                report_type: "classes"
            }

            prepareClassesTable.resolves({});

            const data = await adminReportsController.getReportTableData(req, res, next);

            expect(prepareClassesTable.calledOnce).to.be.true;
            expect(res.json.calledOnce).to.be.true;
            expect(res.json.calledWith(data));
        });

        it('should call the correct function for the cases report', async () => {
            req.params = {
                report_type: "cases"
            }

            prepareCasesTable.resolves({});

            const data = await adminReportsController.getReportTableData(req, res, next);

            expect(prepareCasesTable.calledOnce).to.be.true;
            expect(res.json.calledOnce).to.be.true;
            expect(res.json.calledWith(data));
        });

        it('should call the correct function for the types report', async () => {
            req.params = {
                report_type: "types"
            }

            prepareTypesTable.resolves({});

            const data = await adminReportsController.getReportTableData(req, res, next);

            expect(prepareTypesTable.calledOnce).to.be.true;
            expect(res.json.calledOnce).to.be.true;
            expect(res.json.calledWith(data));
        });

        it('should call the correct function for the active accounts report', async () => {
            req.params = {
                report_type: "accounts"
            }

            prepareActiveAccountsTable.resolves({});

            const data = await adminReportsController.getReportTableData(req, res, next);

            expect(prepareActiveAccountsTable.calledOnce).to.be.true;
            expect(res.json.calledOnce).to.be.true;
            expect(res.json.calledWith(data));
        });

        it('should call the correct function for the account types report', async () => {
            req.params = {
                report_type: "account_types"
            }

            prepareAccountTypesTable.resolves({});

            const data = await adminReportsController.getReportTableData(req, res, next);

            expect(prepareAccountTypesTable.calledOnce).to.be.true;
            expect(res.json.calledOnce).to.be.true;
            expect(res.json.calledWith(data));
        });

        it('should call the correct function for the quotes report', async () => {
            req.params = {
                report_type: "quotes"
            }

            prepareQuotesTable.resolves({});

            const data = await adminReportsController.getReportTableData(req, res, next);

            expect(prepareQuotesTable.calledOnce).to.be.true;
            expect(res.json.calledOnce).to.be.true;
            expect(res.json.calledWith(data));
        });

        it('should return a 400 status code if the report type is invalid', async () => {
            req.params = {
                report_type: "invalid"
            }

            await adminReportsController.getReportTableData(req, res, next);

            expect(res.status.calledOnce).to.be.true;
            expect(res.status.calledWith(400));
        });

        it('should return a 400 status code if the report type is not provided', async () => {
            await adminReportsController.getReportTableData(req, res, next);

            expect(res.status.calledOnce).to.be.true;
            expect(res.status.calledWith(400));
        });

        it('should return a 500 status code if an error occurs', async () => {
            req.params = {
                report_type: "sales"
            }

            prepareSalesTable.rejects();

            await adminReportsController.getReportTableData(req, res, next);

            expect(res.status.calledOnce).to.be.true;
            expect(res.status.calledWith(500));
        });

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

            const deviceData = [generateFakeDevice(faker.database.mongodbObjectId(), deviceCategory.CURRENT), generateFakeDevice(faker.database.mongodbObjectId(), deviceCategory.CURRENT), generateFakeDevice(faker.database.mongodbObjectId(), deviceCategory.RARE), generateFakeDevice(faker.database.mongodbObjectId(), deviceCategory.RARE), generateFakeDevice(faker.database.mongodbObjectId(), deviceCategory.RARE)];

            deviceData.forEach(device => {
                device.listing_user = mock_user;
                device.brand = generateFakeBrand();
                device.model = generateFakeModel();
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

                    user: device.listing_user.toJSON(),

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
        beforeEach(() => {
            getAllDevices = sandbox.stub();
            getDevicesGroupByState = sandbox.stub();

            adminReportsController = proxyquire('../../../controllers/admin/adminReportsController', {
                '../../model/mongodb': {
                    getAllDevices,
                    getDevicesGroupByState
                }
            });
        });

        it('should prepare the data for the cases report', async () => {
            // Arrange
            getDevicesGroupByState.resolves([{
                _id: deviceState.IN_REVIEW,
                total: 2
            }, {
                _id: deviceState.HAS_QUOTE,
                total: 3
            }]);

            const deviceData = [generateFakeDevice(faker.database.mongodbObjectId(), deviceCategory.CURRENT), generateFakeDevice(faker.database.mongodbObjectId(), deviceCategory.CURRENT), generateFakeDevice(faker.database.mongodbObjectId(), deviceCategory.RARE), generateFakeDevice(faker.database.mongodbObjectId(), deviceCategory.RARE), generateFakeDevice(faker.database.mongodbObjectId(), deviceCategory.RARE)];

            deviceData.forEach(device => {
                device.listing_user = mock_user;
                device.brand = generateFakeBrand();
                device.model = generateFakeModel();
            })

            getAllDevices.resolves(deviceData);

            const expectedLabels = ["Draft", "In Review", "Listed", "Has Quote", "Sold", "Recycled", "Auction", "Data Recovery", "Closed", "Hidden", "Rejected"];
            const expectedData = [0, 2, 0, 3, 0, 0, 0, 0, 0, 0, 0];
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

                    user: device.listing_user.toJSON(),

                    device_id: device._id
                }
            });

            // Act
            const data = await adminReportsController.prepareCasesData();

            // Assert
            expect(data.labels).to.eql(expectedLabels);
            expect(data.datasets[0]).to.eql(expectedData);
            expect(data.table).to.eql(expectedTable);
        });
    });

    describe('Test prepareTypesData', () => {
        beforeEach(() => {
            getAllDevices = sandbox.stub();
            getDevicesGroupByType = sandbox.stub();
            getAllDeviceTypes = sandbox.stub();

            adminReportsController = proxyquire('../../../controllers/admin/adminReportsController', {
                '../../model/mongodb': {
                    getAllDevices,
                    getDevicesGroupByType,
                    getAllDeviceTypes
                }
            });
        });

        it('should prepare the data for the types report', async () => {
            // Arrange
            getDevicesGroupByType.resolves([{
                _id: faker.database.mongodbObjectId(),
                name: "Laptop",
                total: 2
            }, {
                _id: faker.database.mongodbObjectId(),
                name: "Phone",
                total: 3
            }]);

            getAllDeviceTypes.resolves([{
                _id: faker.database.mongodbObjectId(),
                name: "Laptop"
            }, {
                _id: faker.database.mongodbObjectId(),
                name: "Phone"
            }]);

            const deviceData = [
                generateFakeDevice(faker.database.mongodbObjectId(), deviceCategory.CURRENT),
                generateFakeDevice(faker.database.mongodbObjectId(), deviceCategory.CURRENT),
                generateFakeDevice(faker.database.mongodbObjectId(), deviceCategory.RARE),
                generateFakeDevice(faker.database.mongodbObjectId(), deviceCategory.RARE),
                generateFakeDevice(faker.database.mongodbObjectId(), deviceCategory.RARE)];

            deviceData.forEach(device => {
                device.listing_user = mock_user;
                device.brand = generateFakeBrand();
                device.model = generateFakeModel();
                device.device_type = generateFakeDeviceType();
            })

            getAllDevices.resolves(deviceData);

            const expectedLabels = ["Laptop", "Phone"];
            const expectedData = [2, 3];
            const expectedTable = deviceData.map(device => {
                return {
                    name: device.brand.name + " " + device.model.name,
                    device_type: device.device_type.name,

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

                    user: device.listing_user.toJSON(),

                    device_id: device._id
                }
            });

            // Act
            const data = await adminReportsController.prepareTypesData();

            // Assert
            expect(data.labels).to.eql(expectedLabels);
            expect(data.datasets[0]).to.eql(expectedData);
            expect(data.table).to.eql(expectedTable);
        });
    });

    describe('Test prepareActiveAccountsData', () => {
        beforeEach(() => {
            getAccountsCountByStatus = sandbox.stub();
            getAllUsers = sandbox.stub();

            adminReportsController = proxyquire('../../../controllers/admin/adminReportsController', {
                '../../model/mongodb': {
                    getAccountsCountByStatus,
                    getAllUsers
                }
            });
        });

        it('should prepare the data for the active accounts report', async () => {
            // Arrange
            getAccountsCountByStatus.resolves([{
                _id: true,
                count: 2
            }, {
                _id: false,
                count: 3
            }]);

            const accountData = [mock_user, mock_user];
            accountData.forEach(account => {
                account.role = roleTypes.USER;
                account.active = true;
            });

            getAllUsers.resolves(accountData);

            const expectedLabels = ["Active", "Inactive"];
            const expectedData = [2, 3];
            const expectedTable = accountData.map(account => {
                return {
                    name: account.first_name + " " + account.last_name,
                    id: account._id,
                    active: account.active,

                    role: account.role,
                    role_string: roleTypes.roleTypeToString(account.role),
                    role_colour: roleTypes.roleTypeToColour(account.role),

                    email: account.email,
                    date_added: account.createdAt.toLocaleString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric'
                    }),
                }
            });

            // Act
            const data = await adminReportsController.prepareActiveAccountsData();

            // Assert
            expect(data.labels).to.eql(expectedLabels);
            expect(data.datasets[0]).to.eql(expectedData);
            expect(data.table).to.eql(expectedTable);
        });
    });

    describe('Test prepareAccountTypesData', () => {
        beforeEach(() => {
            getAccountsCountByType = sandbox.stub();
            getAllUsers = sandbox.stub();

            adminReportsController = proxyquire('../../../controllers/admin/adminReportsController', {
                '../../model/mongodb': {
                    getAccountsCountByType,
                    getAllUsers
                }
            });
        });

        it('should prepare the data for the account types report', async () => {
            // Arrange
            getAccountsCountByType.resolves([{
                _id: roleTypes.USER,
                count: 2
            }, {
                _id: roleTypes.ADMIN,
                count: 3
            }]);

            const accountData = [mock_user, mock_user];
            accountData.forEach(account => {
                account.role = roleTypes.USER;
                account.active = true;
            });

            getAllUsers.resolves(accountData);

            const expectedLabels = ["User", "Admin"];
            const expectedData = [2, 3];
            const expectedTable = accountData.map(account => {
                return {
                    name: account.first_name + " " + account.last_name,
                    id: account._id,
                    active: account.active,

                    role: roleTypes.roleTypeToString(account.role),
                    role_colour: roleTypes.roleTypeToColour(account.role),

                    email: account.email,
                    date_added: account.createdAt.toLocaleString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric'
                    }),
                }
            });

            // Act
            const data = await adminReportsController.prepareAccountTypesData();

            // Assert
            expect(data.labels).to.eql(expectedLabels);
            expect(data.datasets[0]).to.eql(expectedData);
            expect(data.table).to.eql(expectedTable);
        });
    });

    describe('Test prepareQuotesData', () => {
        beforeEach(() => {
            getQuotesGroupByState = sandbox.stub();
            getAllQuotes = sandbox.stub();

            adminReportsController = proxyquire('../../../controllers/admin/adminReportsController', {
                '../../model/mongodb': {
                    getQuotesGroupByState,
                    getAllQuotes
                }
            });
        });

        it('should prepare the data for the quotes report', async () => {
            // Arrange
            getQuotesGroupByState.resolves([
                {
                    _id: quoteState.ACCEPTED,
                    total: 2
                },
                {
                    _id: quoteState.REJECTED,
                    total: 3
                }
            ]);

            const quoteData = [
                generateFakeQuote(),
                generateFakeQuote(),
                generateFakeQuote()
            ];

            quoteData.forEach(quote => {
                quote.device = generateFakeDevice();
                quote.device.listing_user = mock_user;
                quote.device.brand = generateFakeBrand();
                quote.device.model = generateFakeModel();
                quote.provider = generateFakeProvider();
            });

            getAllQuotes.resolves(quoteData);

            const expectedLabels = [
                "New", "Saved", "Rejected", "Accepted", "Converted", "Expired"];
            const expectedData = [0, 0, 3, 2, 0, 0];
            const expectedTable = quoteData.map(quote => {
                return {
                    name: quote.device.model.name,
                    provider: quote.provider.name,

                    state: quote.state,
                    state_string: quoteState.stateToString(quote.state),
                    state_colour: quoteState.stateToColour(quote.state),

                    logo: quote.provider.logo,
                    date_added: quote.createdAt.toLocaleString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric'
                    }),

                    user: quote.device.listing_user.toJSON(),
                    quote_id: quote._id,
                    device_id: quote.device._id
                }
            });

            // Act
            const data = await adminReportsController.prepareQuotesData();

            // Assert
            expect(data.labels).to.eql(expectedLabels);
            expect(data.datasets[0]).to.eql(expectedData);
            expect(data.table).to.eql(expectedTable);
        });
    });
});