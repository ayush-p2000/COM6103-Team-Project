/*
 * This controller should handle any operations related to reports
 */

const {getMockGraphData, getMockSalesData} = require("../../util/mock/mockData");
const {renderAdminLayout} = require("../../util/layout/layoutUtils");
const {getDevicesGroupByCategory, getAllDevices} = require("../../model/mongodb");
const deviceCategory = require("../../model/enum/deviceCategory");
const deviceState = require("../../model/enum/deviceState");

async function getReportsPage(req, res, next) {
    const classes = await prepareClassesData();
    renderAdminLayout(req, res, "reports/reports",
        {
            classes: classes,
            deviceCategory,
            deviceState
        }
    );
}

async function getReportPage(req, res, next) {
    const type = req.params.report_type;
    const title = type.charAt(0).toUpperCase() + type.slice(1);
    let data;

    switch (type) {
        case "sales":
            data = {...getMockGraphData(), table: getMockSalesData()};
            break;
        case "classes":
            data = await prepareClassesData();
            break;
        default:
            data = {...getMockGraphData(), table: getMockSalesData()}
    }

    renderAdminLayout(req, res, `reports/report`, {
        title: title,
        report: type,
        data: {labels: data.labels, datasets: data.datasets, table: data.table},
        deviceCategory,
        deviceState
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

module.exports = {
    getReportsPage,
    getReportPage
}