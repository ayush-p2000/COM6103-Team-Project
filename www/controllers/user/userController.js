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
    try {
        const {firstName, lastName, phone, addressFirst, addressSecond, postCode, city, county, country} = req.body; // Assuming these fields can be updated

        // Construct an object with the fields that need to be updated
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

        // message being displayed after the successful profile update
        messages = ['Profile Successfully Updated']

        // sample usage of email sending

        //use your email ID to send emails for testing or create an account in the ePanda and dynamically retrieve the email
        const emailid = req.user.email
        const subject = 'Update profile successful'

        // Structure your message/text content the way you want. Note : It should be in 'html', so cover your text using ``.
        const textmsg = `Dear user, <br><br> ${messages} <br><br><br><b>Thanks & Regards,<br><br><p style="color: #2E8B57">Team ePanda</p></b>`;

        email(emailid, subject, textmsg)


        // Find the user by ID and update the specified fields
        const updatedUser = await User.findByIdAndUpdate(req.user.id, updateFields, {new: true});
        
        if (!updatedUser) {
            return res.status(404).send('Server Error'); // Any possible error comes out e.g. Database connection, User unidentified, etc...
        }

        res.render("user/user_profile", {
            messages: messages,
            hasMessages: messages.length > 0,
            user: updatedUser,
            auth: req.isLoggedIn
        });
    }
        // catching error
    catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
}



module.exports = {
    getUserProfile,
    getUserDashboard,
    updateUserDetails
}