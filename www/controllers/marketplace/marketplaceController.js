/*
 * This controller should handle any operations related to the marketplace itself
 */

const mockData = require('../../util/mock/mockData')
const { getPaginatedResults } = require("../../model/utils/utils")
const { Device} = require("../../model/schema/device")
async function getMarketplace(req, res, next) {
    const {items, pagination} = await getPaginatedResults(Device, req.params.page, {},{}, 3);

    res.render('marketplace/marketplace', {items, auth: true, role: "user", pagination})
}

function getMyItems(req, res, next) {
    const items = mockData.getMockItems()
    res.render('marketplace/my_items', {items, auth: true, role: "user"})
}

module.exports = {
    getMarketplace,
    getMyItems
}