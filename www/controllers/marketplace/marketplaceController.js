/*
 * This controller should handle any operations related to the marketplace itself
 */

const mockData = require('../../util/mock/mockData')
const {pagination} = require("../../util/pagination/paginationUtils")

function getMarketplace(req, res, next) {
    // Dummy Data
    const items = mockData.getMockItems()

    const {data, start, end, currentPage} = pagination(items,req.params.page, 2);
    res.render('marketplace/marketplace', {items:data, auth: true, role: "user", start,end, currentPage})
}

function getMyItems(req, res, next) {
    const items = mockData.getMockItems()
    res.render('marketplace/my_items', {items, auth: true, role: "user"})
}

module.exports = {
    getMarketplace,
    getMyItems
}