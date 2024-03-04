function renderAdminLayout(res, page, data) {
    res.render('admin/admin_layout', {currentRoute: page, ...data, placeholder: null, auth: true, role: 'admin'});
}

function renderAdminLayoutPlaceholder(res, page, data, placeholder) {
    res.render('admin/admin_layout', {currentRoute: page, ...data, placeholder, auth: true, role: 'admin'});
}

module.exports = {
    renderAdminLayout,
    renderAdminLayoutPlaceholder
}