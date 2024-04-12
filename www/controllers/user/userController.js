/*
 * This controller should handle any operations related to user dashboard and miscellaneous user operations
 */

//const {getMockUser} = require("../../util/mock/mockData");
const {User} = require("../../model/schema/user");
const {email} = require("../../public/javascripts/Emailing/emailing");

const {getAllUsers} = require("../../model/mongodb");

//------------------------------------------------ Rendering user Database -------------------------------------------------------------------------//


async function getUserDashboard(req, res, next) {
    const userData = await User.findById({_id: req.user.id});
    res.render("user/dashboard", {user: userData, auth: req.isLoggedIn})
}

//------------------------------------------------ Get User Data from Database -------------------------------------------------------------------------//

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

//------------------------------------------------ Get User Data from Database -------------------------------------------------------------------------//


async function updateUserDetails(req, res, next){
    let messages;
    let checkUser = await User.findOne({_id: req.user.id})
    try {

        const {firstName, lastName, phone, addressFirst, addressSecond, postCode, city, county, country} = req.body; // Assuming these fields can be updated
        // Construct an object with the fields that need to be updated
        const updateFields = {};

        if (firstName) {
            updateFields.first_name = firstName; // Update first name
            if( checkUser.google_id == null && checkUser.facebook_id == null ){
                updateFields.avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(firstName)}+${encodeURIComponent(lastName || req.user.last_name)}`;
            }
        }


        if (lastName) {
            updateFields.last_name = lastName; // Update last name
            if( checkUser.google_id == null && checkUser.facebook_id == null ) {
                updateFields.avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(firstName || req.user.first_name)}+${encodeURIComponent(lastName)}`;
            }
        }

        if (phone) updateFields.phone_number = phone; // Update phone

        // Update address fields
        if (addressFirst || addressSecond || postCode || city || county || country) {
            updateFields.address = {
                address_1: addressFirst || req.user.address.address_1,
                address_2: addressSecond || req.user.address.address_2,
                postcode: postCode || req.user.address.postcode,
                city: city || req.user.address.city,
                county: county || req.user.address.county,
                country: country || req.user.address.country
            };
        }

        // Message displayed after the successful profile update
        messages = ['Profile Successfully Updated.'];

        // Sample usage of email sending
        const emailid = req.user.email;
        const subject = 'Update profile successful';
        const textmsg = `Dear ${checkUser.first_name}, <br><br> ${messages} <br><br><br><b>Thanks & Regards,<br><br><p style="color: #2E8B57">Team ePanda</p></b>`;

        email(emailid, subject, textmsg);

        // Find the user by ID and update the specified fields
        const updatedUser = await User.findByIdAndUpdate(req.user.id, updateFields, {new: true});

        if (!updatedUser) {
            return res.status(404).send('Server Error');
        }
        res.render("user/user_profile", {
            messages: messages,
            hasMessages: messages.length > 0,
            user: updatedUser,
            auth: req.isLoggedIn
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
}

async function getTermsAndCondition(req, res, next) {
    const userData = await User.findById({_id: req.user.id});
    res.render("user/T&C.ejs", {user: userData,auth: req.isLoggedIn})
}




module.exports = {
    getUserProfile,
    getUserDashboard,
    updateUserDetails,
    getTermsAndCondition
}