/*
 * This controller should handle any operations related to user dashboard and miscellaneous user operations
 */

const {getMockUser} = require("../../util/mock/mockData");
const {User} = require("../../model/schema/user");
const createUser = require("../../model/mongodb")
const crypto = require('crypto');
const {randomBytes, pbkdf2} = require("node:crypto")

function getUserDashboard(req, res, next) {
    //TODO: Add functionality for the user dashboard
    res.render("user/dashboard", {user: getMockUser(), auth: true, role: "user"})
}

async function insertStaffDetails(req,res,next){

    const salt = crypto.randomBytes(12).toString('hex');
    const address ={
        address_1:req.body.addressFirst,
        address_2:req.body.addressSecond,
        postcode:req.body.postCode,
        country:req.body.country,
        county: "Manhattan",
        city:req.body.city
    };

    const user = new User({
        email: req.body.email,
        password: req.body.password,
        first_name: req.body.firstName,
        last_name: req.body.lastName,
        address: address,
        phone_number: req.body.phone,
        salt:salt
    });

    await createUser.createUser(user);

    console.log(req.body);
    res.render("user/dashboard",{user:getMockUser(), auth:true, role:"user"})
}

function getUserProfile(req, res, next) {
    const user = getMockUser()
    res.render("user/user_profile", {user, auth: true, role: "user"})
}

module.exports = {
    getUserProfile,
    getUserDashboard,
    insertStaffDetails
}