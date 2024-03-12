function renderAdminLayout(req, res, page, data) {
    res.render('admin/admin_layout', {currentRoute: page, ...data, placeholder: null, auth: req.isLoggedIn, user:req.user});
}

function renderAdminLayoutPlaceholder(req, res, page, data, placeholder) {
    res.render('admin/admin_layout', {currentRoute: page, ...data, placeholder, auth: req.isLoggedIn, user:req.user});
}

module.exports = {
    renderAdminLayout,
    renderAdminLayoutPlaceholder
}