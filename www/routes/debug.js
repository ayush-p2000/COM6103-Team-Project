const express = require('express');
const router = express.Router();

router.get('/routes', function (req, res) {
    let routes = [];
    req.app._router.stack.forEach(function (middleware) {
        if (middleware.route) {
            routes.push(middleware.route.path);
        } else if (middleware.name === 'router') {
            //Extract the base route from the middleware regex
            var root = middleware.regexp.toString().split('|')[0];
            root = root.slice(3, root.length - 1);
            //Remove '?(?=\/' from the string
            root = root.replace('?(?=\\', '');
            root = root.replace('\\/', '');
            //If the root is just a slash, remove it
            if (root === '/') root = '';

            middleware.handle.stack.forEach(function (handler) {
                let route = handler.route;
                route && routes.push(root + route.path);
            });
        }
    });

    //Sort the routes alphabetically
    routes = routes.sort();

    //Remove duplicate routes
    routes = routes.filter(function (item, pos, self) {
        return self.indexOf(item) == pos;
    });

    res.render('debug_links', {routes: routes});
});

module.exports = router;