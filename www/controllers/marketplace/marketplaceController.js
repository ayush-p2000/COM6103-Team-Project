/*
 * This controller should handle any operations related to the marketplace itself
 */

const mockData = require('../../util/mock/mockData')
const {pagination} = require("../../util/pagination/paginationUtils")
const {deviceModel} = require("../../model/mongodb")
async function getMarketplace(req, res, next) {
    // Dummy Data
    // const items = mockData.getMockItems()

    const {items, start, end, currentPage} = await pagination(deviceModel,req.params.page, 3);

    res.render('marketplace/marketplace', {items, auth: true, role: "user", start,end, currentPage})
}

function getMyItems(req, res, next) {
    const items = mockData.getMockItems()
    res.render('marketplace/my_items', {items, auth: true, role: "user"})
}

module.exports = {
    getMarketplace,
    getMyItems
}