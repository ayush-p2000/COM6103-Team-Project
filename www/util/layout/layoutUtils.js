function renderAdminLayout(req, res, page, data) {
    //TODO:Change auth, user, role once the admin login is done
    res.render('admin/admin_layout', {currentRoute: page, ...data, placeholder: null, auth: true, user:'admin', role:'admin'});
}

function renderAdminLayoutPlaceholder(req, res, page, data, placeholder) {
    res.render('admin/admin_layout', {currentRoute: page, ...data, placeholder, auth: req.isLoggedIn, user:req.user});
}

module.exports = {
    renderAdminLayout,
    renderAdminLayoutPlaceholder
}