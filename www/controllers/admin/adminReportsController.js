/*
 * This controller should handle any operations related to reports
 */

const {getMockGraphData, getMockSalesData} = require("../../util/mock/mockData");
const {renderAdminLayout} = require("../../util/layout/layoutUtils");

function getReportsPage(req, res, next) {
    renderAdminLayout(req, res, "reports/reports", {})
}

function getReportPage(req, res, next) {
    const type = req.params.report_type;
    const title = type.charAt(0).toUpperCase() + type.slice(1);
    const data = getMockGraphData();
    renderAdminLayout(req, res, `reports/report`, {
        title: title,
        report: type,
        data: {labels: data.labels, datasets: data.datasets, table: getMockSalesData()}
    });
}

module.exports = {
    getReportsPage,
    getReportPage
}