/* Middleware to secure routes */
const {STAFF, ADMIN} = require("../model/enum/roleTypes")
const isAuthenticated = (req, res, next) => {
    if(req.isAuthenticated() && req.user){
        next();
    } else {
        res.redirect("/login")
    }
}

const isStaff = (req,res,next) => {
    if(req.user.role < STAFF){
        res.redirect("/dashboard")
    }
    next();
}

const isSuperAdmin = (req,res,next) => {
    if(req.user.role < ADMIN){
        res.redirect("/dashboard")
    }
    next();
}