/*
 * This controller should be used to handle the landing page of the application.
 */

const {getAllDevices, getCarouselDevices} = require("../model/mongodb");

async function getLandingPage(req, res, next) {
    const imgPerCarousel = 6
    const items = await getCarouselDevices(imgPerCarousel)
    // console.log(items)
    res.render('index', { title: 'Express', auth:req.isLoggedIn, user:req.user, items, imgPerCarousel});
}

module.exports = {
    getLandingPage
}