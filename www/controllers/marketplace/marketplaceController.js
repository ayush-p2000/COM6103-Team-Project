/*
 * This controller should handle any operations related to the marketplace itself
 */

const mockData = require('../../util/mock/mockData')
const { getPaginatedResults } = require("../../model/utils/utils")
const { Device} = require("../../model/schema/device")

const getMarketplace = async (req, res, next) => {
    const {items, pagination} = await getPaginatedResults(Device, req.params.page, {},{}, 3);

    res.render('marketplace/marketplace', {items, auth: req.isLoggedIn, user:req.user})
}

function getMyItems(req, res, next) {
    const items = mockData.getMockItems()
    res.render('marketplace/my_items', {items, auth: req.isLoggedIn, user:req.user})
}

module.exports = {
    getMarketplace,
    getMyItems
}