/*
 * This controller should handle any operations related to the admin dashboard and miscellaneous admin operations
 */

const {renderAdminLayout} = require("../../util/layout/layoutUtils");
const {User} = require("../../model/schema/user");
const {getAllUsers, searchUserAndPopulate} = require("../../model/mongodb");

function getAdminDashboard(req, res, next) {
    const route = req.params.contentRoute ?? "dashboard";

    const admin = {
        name: "Chuck",
        lastName: "Norris"
    }

    renderAdminLayout(req, res, "dashboard",{admin, numOfUsers: 11, savedCo2:124.3, numOfFinishedTransactions: 1121})
}

async function insertStaffDetails(req,res,next){

    try {
        const user = await searchUserAndPopulate({_id: req.params.id});
        const {firstName, lastName, phone, addressFirst, addressSecond, postCode, city, county, country, role} = req.body; // Assuming these fields can be updated

        const updateFields = {};

        if (firstName) updateFields.first_name = firstName; //update first name

        if (lastName) updateFields.last_name = lastName; //update last name

        if (phone) updateFields.phone_number = phone; //update phone

        //update address line 1
        if (addressFirst) {
            updateFields.address = updateFields.address || {};
            updateFields.address.address_1 = addressFirst;
        }

        //update address line 2
        if (addressSecond) {
            updateFields.address = updateFields.address || {};
            updateFields.address.address_2 = addressSecond;
        }

        //update city
        if (city) {
            updateFields.address = updateFields.address || {};
            updateFields.address.city = city;
        }

        //update postcode
        if (postCode) {
            updateFields.address = updateFields.address || {};
            updateFields.address.postcode = postCode;
        }

        //update county
        if (county) {
            updateFields.address = updateFields.address || {};
            updateFields.address.county = county;
        }

        //update county
        if (country) {
            updateFields.address = updateFields.address || {};
            updateFields.address.country = country;
        }

        if(role){
            updateFields.role = role;
        }

        const userDetails = await User.findByIdAndUpdate(user, updateFields, {new: true});

        if (!userDetails) {
            return res.status(404).send('Server Error'); // Any possible error comes out e.g. Database connection, User unidentified, etc...
        }
        let users = [];
        users = await getAllUsers();
        renderAdminLayout(req, res, "user_management", {users});
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
}

async function deactivateUser(req,res,next){
    const userId = req.body.id;

    // Use Mongoose to update the document
    const updatedUser = await User.findByIdAndUpdate(userId, { active: false }, { new: true });
    if (!updatedUser) {
        return res.status(404).send('Server Error'); // Any possible error comes out e.g. Database connection, User unidentified, etc...
    }

    let users = [];
    users = await getAllUsers();
    renderAdminLayout(req, res, "user_management", {users});
}

async function activateUser(req,res,next){
    const userId = req.body.id;

    // Use Mongoose to update the document
    const updatedUser = await User.findByIdAndUpdate(userId, { active: true }, { new: true });
    if (!updatedUser) {
        return res.status(404).send('Server Error'); // Any possible error comes out e.g. Database connection, User unidentified, etc...
    }

    let users = [];
    users = await getAllUsers();
    renderAdminLayout(req, res, "user_management", {users});

}

async function error(req,res,next){

}

module.exports = {
    getAdminDashboard,
    insertStaffDetails,
    deactivateUser,
    activateUser
}