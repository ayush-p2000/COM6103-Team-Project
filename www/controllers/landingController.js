/*
 * This controller should be used to handle the landing page of the application.
 */


function getLandingPage(req, res, next) {
    //TODO: auth and role variables used to change the navbar links.
    res.render('index', { title: 'Express', auth:true, role:'user'});
}

module.exports = {
    getLandingPage
}