/*
 * This controller should be used to handle the landing page of the application.
 */

const { getCarouselDevices } = require("../model/mongodb");

async function getLandingPage(req, res, next) {
    const imgPerCarousel = 6;
    let messages = [];

    // Check if there are messages in the query parameters
    if (req.query.messages) {
        messages = JSON.parse(decodeURIComponent(req.query.messages));
    }
    try {
        // Get carousel devices
        const items = await getCarouselDevices(imgPerCarousel);

        // Render the template with data and messages
        res.render('index', {
            title: 'Express',
            auth: req.isLoggedIn,
            user: req.user,
            items: items,
            imgPerCarousel: imgPerCarousel,
            messages: messages // Pass messages to the template
        });
    }
    catch (err){
        console.error(err)
        res.status(500);
        next({message: "Internal Server Error", state: 500})
    }
    // console.log(items)
}

module.exports = {
    getLandingPage
};