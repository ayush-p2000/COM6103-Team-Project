/*
 * This controller should handle any operations related to the marketplace itself
 */

const mockData = require('../../util/mock/mockData')

function getMarketplace(req, res, next) {
    // Dummy Data
    const items = mockData.getMockItems()
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