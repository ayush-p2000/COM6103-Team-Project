/*
 * This controller should handle any operations related to the marketplace itself
 */

const mockData = require('../../util/mock/mockData')
const { getPaginatedResults } = require("../../model/utils/utils")
const { Device} = require("../../model/schema/device")
const {getUserItems} = require('../../model/mongodb')
const {join} = require("path");
const deviceState =require("../../model/enum/deviceState")
const deviceCategory = require("../../model/enum/deviceCategory")

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
    console.log(req.user)
    const items = await getUserItems(req.user.id)
    items.forEach(item => {
        item.photos[0] = item.photos[0].slice(7)
        console.log(item.photos[0])
    })

    res.render('marketplace/my_items', {items, deviceState, deviceCategory, auth: req.isLoggedIn, user:req.user, role:'user'})
}

module.exports = {
    getMarketplace,
    getMyItems
}