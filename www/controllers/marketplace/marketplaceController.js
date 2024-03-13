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

/**
 * Get User's items to display it in the my-items page, so that the user can see what items they have listed in the application
 * @author Vinroy Miltan Dsouza
 */
async function getMyItems(req, res, next) {
    // TODO: change the id once the session is completed
    const items = await getUserItems(mockData.getMockUserId())
    res.render('marketplace/my_items', {items, auth: true, role: "user"})
}

module.exports = {
    getMarketplace,
    getMyItems
}