const roleTypes = require("../../model/enum/roleTypes");

/**
 * Display the admin layout with the provided view embedded inside.
 * The user and auth variables are passed to the view automatically.
 * @param page - The page to be displayed in the admin layout, this should be relative to the admin folder (e.g. 'dashboard' would display the dashboard view [admin/dashboard.ejs])
 * @param data - The data to be passed to the view
 * @author Benjamin Lister
 */
function renderAdminLayout(req, res, page, data) {
    res.render('admin/admin_layout', {currentRoute: page, ...data, placeholder: null, auth: req.isLoggedIn, user:req.user, isAdminRoute: true, roleTypes});
}

/**
 * Display the admin layout with the provided placeholder text displayed inside the view.
 * This function is intended to be used when the view is not yet implemented, but a placeholder is desired.
 * The user and auth variables are passed to the view automatically.
 * @param page - The page to be displayed in the admin layout, this should be relative to the admin folder (e.g. 'dashboard' would display the dashboard view [admin/dashboard.ejs])
 * @param data - The data to be passed to the view
 * @param placeholder - The placeholder text to be displayed inside the view until the view is implemented
 * @author Benjamin Lister
 */
function renderAdminLayoutPlaceholder(req, res, page, data, placeholder) {
    res.render('admin/admin_layout', {currentRoute: page, ...data, placeholder, auth: req.isLoggedIn, user:req.user, isAdminRoute: true, roleTypes});
}

function renderUserLayout(req, res, page, data) {
    res.render('user/dashboard', {currentRoute: page, ...data, placeholder: null, auth: req.isLoggedIn, user:req.user});
}

module.exports = {
    renderAdminLayout,
    renderAdminLayoutPlaceholder,
    renderUserLayout
}