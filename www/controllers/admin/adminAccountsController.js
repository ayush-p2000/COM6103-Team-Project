/*
 * This controller should handle any operations related to account management
 */

const {renderAdminLayout, renderAdminLayoutPlaceholder} = require("../../util/layout/layoutUtils");
const {getAllUsers, getUserById, searchUserAndPopulate} = require("../../model/mongodb");
const {User} = require("../../model/models");
const roleTypes = require("../../model/enum/roleTypes");

async function getAccountsPage(req, res, next) {
    let users = [];
    try {
        users = await getAllUsers();
        renderAdminLayout(req, res, "user_management", {users, roleTypes});
    } catch (e) {
        console.error(e);
        renderAdminLayout(req, res, "user_management", {users, error: "Failed to retrieve user data"});
    }
}

async function getAccountDetailsPage(req, res, next) {
    const user = await searchUserAndPopulate({_id: req.params.id});
    const isGoogleAuthenticated = user.google_id !== null;
    renderAdminLayout(req, res, "user_details", {userDetails: user, isGoogleAuthenticated: isGoogleAuthenticated, roleTypes});
}

function getEditAccountPage(req, res, next) {
    //TODO: Add functionality for editing account details
    renderAdminLayoutPlaceholder(req, res, "edit_user", {}, "Edit Account Details (out of scope)");
}

const createStaff = async (req, res, next) => {
    let unauthorizedAccess = false;
    const {randomBytes, pbkdf2} = require("node:crypto")
    const {promisify} = require("node:util");
    const pbkdf2Promise = promisify(pbkdf2)
    const {User} = require("../../model/schema/user");
    const {getAllUsers} = require("../../model/mongodb");
    const {renderAdminLayout} = require("../../util/layout/layoutUtils");
    const {USER} = require("../../model/enum/roleTypes");
    let user = ""

    let messages;
    req.body;
    try {
        const {
            firstName,
            lastName,
            dateOfBirth,
            email,
            password,
            phone,
            address_1,
            address_2,
            postcode,
            city,
            county,
            country,
            role

        } = req.body

        // These fields should be included in the form and validated appropriately
        // Refer to the bug - TSP-94
        const phone_number = phone;

        const address = {
            address_1: address_1,
            address_2: address_2,
            city: city,
            county: county,
            country: country,
            postcode: postcode
        }


        const salt = randomBytes(16)
        const hashedPassword = await pbkdf2Promise(password, salt, 310000, 32, 'sha256')
        const emailCheck = await User.findOne({email});
        if (emailCheck) {
            res.status(401).send('Email id already exists');
        } else {
            user = new User({
                first_name: firstName,
                last_name: lastName,
                date_of_birth: dateOfBirth,
                phone_number,
                email,
                password: hashedPassword,
                salt,
                address,
                role: role
            });
        }
        if (req.user.role > USER && req.body.role <= req.user.role) {
            try {
                await user.save()
                let users = [];
                users = await getAllUsers();
                renderAdminLayout(req, res, "user_management", {users});
            }catch(error){

            }
        }else{
            res.status(401).send('You do not have access to create this user');
        }



    } catch (err) {
        return next(err)
    }
}

async function deleteUser(req,res,next){
    try {
        const userId = req.body.id;
        const user = {
            email: 'deleted@example.com',
            google_id: null,
            facebook_id: null,
            password:null,
            salt:null,
            active:false,
            isDeleted:true

        };
        const updatedUser = await User.findByIdAndUpdate(userId, user, { new: true });
        let users = [];
        users = await getAllUsers();
        renderAdminLayout(req, res, "user_management", {users});
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
}

module.exports = {
    getAccountsPage,
    getAccountDetailsPage,
    getEditAccountPage,
    createStaff,
    deleteUser
}