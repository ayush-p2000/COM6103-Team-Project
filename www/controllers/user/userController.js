/*
 * This controller should handle any operations related to user dashboard and miscellaneous user operations
 */

const {User} = require("../../model/models");
const {email} = require("../../public/javascripts/Emailing/emailing");
const {renderUserLayout} = require("../../util/layout/layoutUtils");
const {getAllUsers, getUserItems, getUnknownDeviceHistoryByDevice, getAllDevices} = require("../../model/mongodb");
const deviceCategory = require("../../model/enum/deviceCategory")
const {handleUserMissingModel, handleMissingModels} = require("../../util/Devices/devices");


//------------------------------------------------ Rendering user Database -------------------------------------------------------------------------//


/**
 * Get user dashboard, here the user's items and marketplace items can be viewed from the dashboard
 * @author Vinroy Miltan Dsouza <vmdsouza1@sheffield.ac.uk> and Ayush Prajapati <aprajapati1@sheffield.ac.uk>
 */
async function getUserDashboard(req, res, next) {
    try {
        const userData = await User.findById({_id: req.user.id});
        const firstName = userData.first_name
        var userItems = await getUserItems(req.user.id)
        userItems = await getUnknownDevices(userItems)
        var marketplaceDevices = await getAllDevices()
        marketplaceDevices = await getUnknownDevices(marketplaceDevices)

        const userItemsContainsDevices = userItems.length > 0
        let marketDevices = []
        marketplaceDevices.forEach(devices => {
            if (devices.visible) {
                marketDevices.push(devices)
            }
        })
        const marketContainsDevices = marketDevices.length > 0
        renderUserLayout(req, res, '../marketplace/user_home', {
            user: userData,
            firstName: firstName,
            devices: userItems,
            marketDevices: marketDevices,
            deviceCategory,
            marketContains: marketContainsDevices,
            userContains: userItemsContainsDevices,
            auth: req.isLoggedIn
        })
    } catch (err) {
        console.log(err);
        res.status(500);
        next({message: err, status: 500});
    }
}

/**
 * Get method to retrieve unknown devices from the database needed to be displayed in the web page
 * @author Vinroy Miltan Dsouza <vmdsouza1@sheffield.ac.uk>
 */
async function getUnknownDevices(items) {
     await handleMissingModels(items)
    return items
}

/**
 * Methods for rendering and updating user views
 * @author Ayush Prajapati <aprajapati1@sheffield.ac.uk>
 */

//------------------------------------------------ Get User Data from Database -------------------------------------------------------------------------//

async function getUserProfile(req, res, next) {
    try {
        const userData = await User.findById({_id: req.user.id});
        // Determine if the user has logged in with Google authentication
        const isGoogleAuthenticated = userData.google_id !== null;
        renderUserLayout(req, res, 'user_profile', {userData, isGoogleAuthenticated: isGoogleAuthenticated});
    } catch (err) {
        res.send('No user found');
    }
}

//------------------------------------------------ Get User Data from Database -------------------------------------------------------------------------//


async function updateUserDetails(req, res, next) {
    let messages;
    let checkUser = await User.findOne({_id: req.user.id});
    try {

        const {firstName, lastName, phone, addressFirst, addressSecond, postCode, city, county, country} = req.body; // Assuming these fields can be updated
        // Construct an object with the fields that need to be updated
        let updateFields = {};


        if (req.session.messages.length > 0) {
            return res.redirect("/profile")
        }

        if (firstName) {
            updateFields.first_name = firstName; // Update first name
            if (checkUser.google_id == null && checkUser.facebook_id == null) {
                updateFields.avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(firstName)}+${encodeURIComponent(lastName || req.user.last_name)}`;
            }
        }

        if (lastName) {
            updateFields.last_name = lastName; // Update last name
            if (checkUser.google_id == null && checkUser.facebook_id == null) {
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
        renderUserLayout(req, res, 'user_profile', {
            messages: messages,
            hasMessages: messages.length > 0,
            userData: updatedUser,
            isGoogleAuthenticated: isGoogleAuthenticated,
            auth: req.isLoggedIn
        })
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
}


module.exports = {
    getUserProfile,
    getUserDashboard,
    updateUserDetails
}