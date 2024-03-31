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


const createStaff = async (req, res, next) => {

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
            messages = ['User email already exists']
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
            await user.save()
        }

        let users = [];
        users = await getAllUsers();
        renderAdminLayout(req, res, "user_management", {users});


    } catch (err) {
        return next(err)
    }
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

module.exports = {
    getAdminDashboard,
    createStaff,
    insertStaffDetails
}