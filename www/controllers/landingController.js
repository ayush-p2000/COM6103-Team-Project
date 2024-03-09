/*
 * This controller should be used to handle the landing page of the application.
 */


function getLandingPage(req, res, next) {
    res.render('index', { title: 'Express', auth:req.isLoggedIn, role:'user'});
}

module.exports = {
    getLandingPage
}