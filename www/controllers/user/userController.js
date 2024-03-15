/*
 * This controller should handle any operations related to user dashboard and miscellaneous user operations
 */

//const {getMockUser} = require("../../util/mock/mockData");
const {User} = require("../../model/schema/user");

async function getUserDashboard(req, res, next) {
    const userData = await User.findById({_id: req.user.id});
    res.render("user/dashboard", {user: userData, auth: req.isLoggedIn})
}

async function getUserProfile(req, res, next) {
    // TODO Fetch Full data of the user from the database
    try {
        const userData = await User.findById({_id: req.user.id});
        console.log(userData)
        res.render("user/user_profile", {user: userData, auth: req.isLoggedIn})

    } catch (err) {
        res.send('No user found')
    }

}

async function updateUserDetails(req, res, next){
    try {
        const user = await User.findById({_id: req.user.id});
        user.first_name = req.body.firstName || user.first_name

        user.save();

        res.render("user/user_profile", {user: user, auth: req.isLoggedIn})
    }
    catch (err){
        res.send(err)
    }
}

module.exports = {
    getUserProfile,
    getUserDashboard,
    updateUserDetails
}