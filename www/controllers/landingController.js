/*
 * This controller should be used to handle the landing page of the application.
 */

const {getAllDevices, getCarouselDevices} = require("../model/mongodb");

async function getLandingPage(req, res, next) {
    const imgPerCarousel = 6
    try {
        const items = await getCarouselDevices(imgPerCarousel)
        res.render('index', {title: 'Express', auth: req.isLoggedIn, user: req.user, items, imgPerCarousel});
    } catch (err) {
        console.error(err)
        res.status(500);
        next({message: "Internal Server Error", state: 500})
    }
    // console.log(items)
}

module.exports = {
    getLandingPage
}