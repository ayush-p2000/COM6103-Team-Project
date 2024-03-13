/*
 * This controller should handle any operations related to the marketplace itself
 */

const mockData = require('../../util/mock/mockData')
const { getPaginatedResults } = require("../../model/utils/utils")
const { Device} = require("../../model/schema/device")
const {getUserItems} = require('../../model/mongodb')

const getMarketplace = async (req, res, next) => {
    const {items, pagination} = await getPaginatedResults(Device, req.params.page, {},{}, 3);

    res.render('marketplace/marketplace', {items, auth: req.isLoggedIn, user:req.user, pagination})
}

/**
 * Get User's items to display it in the my-items page, so that the user can see what items they have listed in the application
 * @author Vinroy Miltan Dsouza
 */
async function getMyItems(req, res, next) {
    // TODO: change the id once the session is completed
    const items = await getUserItems(mockData.getMockUserId())
    res.render('marketplace/my_items', {items, auth: req.isLoggedIn, user:req.user})
}

module.exports = {
    getMarketplace,
    getMyItems
}