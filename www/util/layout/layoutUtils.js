function renderAdminLayout(req, res, page, data) {

    res.render('admin/admin_layout', {currentRoute: page, ...data, placeholder: null, auth: req.isLoggedIn, user: req.user});
    //TODO:Change auth, user, role once the admin login is done
    res.render('admin/admin_layout', {currentRoute: page, ...data, placeholder: null, auth: req.isLoggedIn, user:req.user, role:'admin'});
}

function renderAdminLayoutPlaceholder(req, res, page, data, placeholder) {
    res.render('admin/admin_layout', {currentRoute: page, ...data, placeholder, auth: req.isLoggedIn, user:req.user});
}

module.exports = {
    renderAdminLayout,
    renderAdminLayoutPlaceholder
}