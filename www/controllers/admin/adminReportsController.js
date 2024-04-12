/*
 * This controller should handle any operations related to reports
 */

const {getMockGraphData, getMockSalesData} = require("../../util/mock/mockData");
const {renderAdminLayout} = require("../../util/layout/layoutUtils");
const {
    getDevicesGroupByCategory,
    getAllDevices,
    getDevicesGroupByState,
    getDevicesGroupByType,
    getAllDeviceTypes, getAccountsCountByStatus, getAllUsers, getAccountsCountByType, getAllSalesOrderedByDate,
    getSalesCountByMonth, getSalesValueByMonth
} = require("../../model/mongodb");
const deviceCategory = require("../../model/enum/deviceCategory");
const deviceState = require("../../model/enum/deviceState");
const accountStatus = require("../../model/enum/accountStatus")
const roleTypes = require("../../model/enum/roleTypes")

async function getReportsPage(req, res, next) {
    const classes = await prepareClassesData();
    const cases = await prepareCasesData();
    const types = await prepareTypesData();
    const accounts = await prepareActiveAccountsData()
    const account_types = await prepareAccountTypesData()
    const sales = await prepareSalesData();
    renderAdminLayout(req, res, "reports/reports",
        {
            classes: classes,
            cases: cases,
            types: types,
            accounts,
            account_types,
            sales,
            deviceCategory,
            deviceState,
            accountStatus,
            roleTypes
        }
    );
}

async function getReportPage(req, res, next) {
    const type = req.params.report_type;
    const title = type.charAt(0).toUpperCase() + type.slice(1);
    let data;

    switch (type) {
        case "classes":
            data = await prepareClassesData();
            break;
        case "cases":
            data = await prepareCasesData();
            break;
        case "types":
            data = await prepareTypesData();
            break;
        case "accounts":
            data = await prepareActiveAccountsData();
            break;
        case "account_types":
            data = await prepareAccountTypesData();
            break;
        case "sales":
            data = await prepareSalesData();
            break;
        default:
            data = {...getMockGraphData(), table: getMockSalesData()}
    }

    renderAdminLayout(req, res, `reports/report`, {
        title: title,
        report: type,
        data: {labels: data.labels, datasets: data.datasets, table: data.table},
        deviceCategory,
        deviceState,
        accountStatus,
        roleTypes
    });
}

/**
 * Prepare the data for the classes report
 * @returns {Promise<{datasets: any[][], table: *[], labels: *[]}>}
 */
async function prepareClassesData() {
    const deviceGroups = await getDevicesGroupByCategory();
    const devices = await getAllDevices();
    const deviceCategoryIntegers = deviceCategory.getList();
    const labels = [];
    deviceCategoryIntegers.forEach(value => labels.push(deviceCategory.deviceCategoryToString(value)));

    const data = Array(labels.length).fill(0);

    deviceGroups.forEach(group => {
        const index = deviceCategoryIntegers.indexOf(group._id);
        data[index] = group.total;
    });

    const table = [];

    devices.forEach(device => {
        table.push({
            name: `${device.brand?.name ?? "Unbranded"} ${device.model?.name ?? "Unknown Model"}`,
            category: device.category,
            state: device.state,
            date_added: device.createdAt.toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "numeric",
                minute: "numeric"
            }),
            user: device.listing_user,
            device_id: device._id,
        });
    });

    return {labels: labels, datasets: [data], table: table};

}

/**
 * Prepare the data for the cases report
 * @returns {Promise<{datasets: any[][], table: *[], labels: *[]}>}
 */
async function prepareCasesData() {
    const deviceGroups = await getDevicesGroupByState();
    const devices = await getAllDevices();
    const deviceStatesIntegers = deviceState.getList();
    const labels = [];
    deviceStatesIntegers.forEach(value => labels.push(deviceState.deviceStateToString(value)));

    const data = Array(labels.length).fill(0);

    deviceGroups.forEach(group => {
        const index = deviceStatesIntegers.indexOf(group._id);
        data[index] = group.total;
    });

    const table = [];

    devices.forEach(device => {
        table.push({
            name: `${device.brand?.name ?? "Unbranded"} ${device.model?.name ?? "Unknown Model"}`,
            category: device.category,
            state: device.state,
            date_added: device.createdAt.toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "numeric",
                minute: "numeric"
            }),
            user: device.listing_user,
            device_id: device._id,
        });
    });

    return {labels: labels, datasets: [data], table: table};

}

/**
 * Prepare the data for the classes report
 * @returns {Promise<{datasets: any[][], table: *[], labels: *[]}>}
 */
async function prepareTypesData() {
    const deviceGroups = await getDevicesGroupByType();
    const devices = await getAllDevices();
    const deviceTypes = await getAllDeviceTypes();

    //Create a list of labels for the chart
    const labels = [];
    deviceTypes.forEach(type => labels.push(type.name));

    const data = Array(labels.length).fill(0);

    deviceGroups.forEach(group => {
        const index = labels.indexOf(group.name);
        data[index] = group.total;
    });

    const table = [];

    devices.forEach(device => {
        table.push({
            name: `${device.brand?.name ?? "Unbranded"} ${device.model?.name ?? "Unknown Model"}`,
            device_type: device.device_type?.name,
            category: device.category,
            state: device.state,
            date_added: device.createdAt.toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "numeric",
                minute: "numeric"
            }),
            user: device.listing_user,
            device_id: device._id,
        });
    });

    return {labels: labels, datasets: [data], table: table};

}

/**
 * Prepare the data for the active accounts report
 * @returns {Promise<{datasets: any[][], table: *[], labels: *[]}>}
 * @author Adrian Urbanczyk
 */
const prepareActiveAccountsData = async () => {
    const accountCount = await getAccountsCountByStatus()
    const users = await getAllUsers()
    const labels = accountCount.map(item => item._id ? "Active" : "Inactive")
    const data = accountCount.map(item => item.count)
    const table = []

    users.forEach(user => {
        table.push({
            name: `${user.first_name} ${user.last_name}`,
            id: user._id,
            active: user.active,
            role: user.role,
            email: user.email,
            date_added: user.createdAt.toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "numeric",
                minute: "numeric"
            }),
        });
    });

    return {labels, datasets: [data], table: table};

}

/**
 * Prepare the data for the active accounts report
 * @returns {Promise<{datasets: any[][], table: *[], labels: *[]}>}
 * @author Adrian Urbanczyk
 */
const prepareAccountTypesData = async () => {
    const accountCount = await getAccountsCountByType()
    const users = await getAllUsers()
    const labels = accountCount.map(item => roleTypes.roleTypeToString(item._id))
    const data = accountCount.map(item => item.count)
    const table = []

    users.forEach(user => {
        table.push({
            name: `${user.first_name} ${user.last_name}`,
            id: user._id,
            active: user.active,
            role: user.role,
            email: user.email,
            date_added: user.createdAt.toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "numeric",
                minute: "numeric"
            }),
        });
    });

    return {labels, datasets: [data], table: table};

}

const SALES_PREV_MONTHS = 12;

const prepareSalesData = async () => {
    //Labels is an array of strings, each representing a month from the current month, going back 6 months
    const labels = [];
    const currentMonth = new Date().getMonth();

    const monthMappping = {};

    for (let i = 0; i < SALES_PREV_MONTHS; i++) {
        //Determine the month
        const month = currentMonth - i < 0 ? 12 + (currentMonth - i) : currentMonth - i;
        //Determine the year for the month
        const year = new Date().getFullYear() - (currentMonth - i < 0 ? 1 : 0);

        //Add the short month name and year to the labels array
        labels.push(new Date(year, month).toLocaleString('default', {month: 'short'}) + " " + year);

        monthMappping[`${month}-${year}`] = i;
    }
    labels.reverse();
    for (let i = 0; i < labels.length; i++) {
        const monthYear = labels[i].split(" ");
        //Convert the month name to a number
        const map = `${new Date(`${monthYear[0]} 1, 2021`).getMonth()}-${monthYear[1]}`;

        monthMappping[map] = i;
    }


    const count_data = await getSalesCountByMonth(SALES_PREV_MONTHS);
    const value_data = await getSalesValueByMonth(SALES_PREV_MONTHS);

    const referrals_count_data = Array(SALES_PREV_MONTHS).fill(0);
    const referrals_value_data = Array(SALES_PREV_MONTHS).fill(0);

    count_data.forEach(item => {
        //The month retrieved from the database is in the format of {month: 1, year: 2021}
        //We need to convert this to an index in the labels array
        //Months in the map are 0 indexed, so we need to subtract 1 from the month
        const index = monthMappping[`${item._id.month - 1}-${item._id.year}`];

        referrals_count_data[index] = item.total;
    });

    value_data.forEach(item => {
        //The month retrieved from the database is in the format of {month: 1, year: 2021}
        //We need to convert this to an index in the labels array
        //Months in the map are 0 indexed, so we need to subtract 1 from the month
        const index = monthMappping[`${item._id.month - 1}-${item._id.year}`];

        referrals_value_data[index] = item.value;
    });

    //Get all converted sales ordered by date
    const table = [];

    const sales = await getAllSalesOrderedByDate(SALES_PREV_MONTHS);
    sales.forEach(referral => {
        table.push({
            date: referral.date.toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "numeric",
                minute: "numeric"
            }),
            user: referral.device?.listing_user,
            product: referral.device,
            sale_value: referral.value,
            purchase_type: referral.purchase_type,
        });
    });

    return {labels, datasets: [referrals_count_data, referrals_value_data], table};
}

module.exports = {
    getReportsPage,
    getReportPage
}