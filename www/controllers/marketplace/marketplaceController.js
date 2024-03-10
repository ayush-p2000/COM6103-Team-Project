/*
 * This controller should handle any operations related to the marketplace itself
 */

const mockData = require('../../util/mock/mockData')
const {getUserItems} = require('../../model/mongodb')

function getMarketplace(req, res, next) {
    // Dummy Data
    const items = mockData.getMockItems()
    res.render('marketplace/marketplace', {items, auth: true, role: "user"})
}

async function getMyItems(req, res, next) {
    // TODO: change the id once the session is completed
    const items = await getUserItems(mockData.getMockUserId())
    res.render('marketplace/my_items', {items, auth: true, role: "user"})
}

module.exports = {
    getMarketplace,
    getMyItems
}