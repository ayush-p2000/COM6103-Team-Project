/*
 * This controller should handle any operations related to user dashboard and miscellaneous user operations
 */

const {User} = require("../../model/models");
const {email} = require("../../public/javascripts/Emailing/emailing");
const {renderUserLayout} = require("../../util/layout/layoutUtils");
const {
    getAllUsers,
    getUserItems,
    getUnknownDeviceHistoryByDevice,
    getAllDevices
} = require("../../model/mongodb");
const deviceCategory = require("../../model/enum/deviceCategory")
const {
    handleUserMissingModel,
    handleMissingModels
} = require("../../util/Devices/devices");


//------------------------------------------------ Rendering user Database -------------------------------------------------------------------------//

/**
 * Get user dashboard, here the user's items and marketplace items can be viewed from the dashboard
 * @author Vinroy Miltan Dsouza <vmdsouza1@sheffield.ac.uk> and Ayush Prajapati <aprajapati1@sheffield.ac.uk>
 */
async function getUserDashboard(req, res, next) {
    try {
        // Check if user is logged in and the user ID is available
        if (!req.user || !req.user.id) {
            res.status(400);
            return next({message: "User ID is missing or invalid."}); // Respond with 400 Bad Request if user ID is missing
        }

        // Fetch user data by ID
        const userData = await User.findById(req.user.id); // Simplified to use req.user.id directly
        if (!userData) {
            return res.status(404).send("User not found."); // Respond with 404 Not Found if user data is not found
        }

        var marketplaceDevices = await getAllDevices({visible: {$ne: false}});
        marketplaceDevices = await handleMissingModels(marketplaceDevices)

        // Get the user's items
        //They are defined as items where the listing_user is the user's ID
        let userItems = marketplaceDevices.filter(device => device.listing_user._id.toString() === req.user.id.toString())

        const userItemsContainsDevices = userItems.length > 0
        const marketContainsDevices = marketplaceDevices.length > 0

        renderUserLayout(req, res, '../marketplace/user_home', {
            userData: userData,
            firstName: firstName,
            devices: userItems,
            marketDevices: marketplaceDevices,
            deviceCategory,
            marketContains: marketContainsDevices,
            userContains: userItemsContainsDevices,
            auth: req.isLoggedIn
        });
    } catch (err) {
        console.error(err);
        res.status(500);
        next(err); // Properly chaining
    }
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
        renderUserLayout(req, res, 'user_profile', {
            userData,
            isGoogleAuthenticated: isGoogleAuthenticated
        });
    } catch (err) {
        res.status(500);
        next(err);
    }
}

//------------------------------------------------ Get User Data from Database -------------------------------------------------------------------------//


async function updateUserDetails(req, res, next) {
    if (req.session.messages && req.session.messages.length > 0) {
        return res.redirect("/profile");
    }

    if (!req.user || !req.user.id) {
        console.error('User ID missing from the request');
        return res.status(400).send('User not found.');
    }

    try {

        const {
            firstName,
            lastName,
            phone,
            addressFirst,
            addressSecond,
            postCode,
            city,
            county,
            country
        } = req.body;
        let updateFields = {};
        const checkUser = await User.findOne({_id: req.user.id});
        if (!checkUser) {
            console.error('User not found with ID:', req.user.id);
            return res.status(404).send('User not found.');
        }
        // Update the names and avatar if necessary
        if (firstName || lastName) {
            if (firstName) updateFields.first_name = firstName;
            if (lastName) updateFields.last_name = lastName;

            if (checkUser.google_id == null && checkUser.facebook_id == null) {
                updateFields.avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(firstName || checkUser.first_name)}+${encodeURIComponent(lastName || checkUser.last_name)}`;
            }
        }

        if (phone) updateFields.phone_number = phone;

        // Consolidate address update logic
        if (addressFirst || addressSecond || postCode || city || county || country) {
            updateFields.address = {
                address_1: addressFirst || req.user.address?.address_1 || '',
                address_2: addressSecond || req.user.address?.address_2 || '',
                postcode: postCode || req.user.address?.postcode || '',
                city: city || req.user.address?.city || '',
                county: county || req.user.address?.county || '',
                country: country || req.user.address?.country || ''
            };
        }

        if (Object.keys(updateFields).length === 0) {
            console.log("No fields to update.");
            // Optionally, redirect or send a response indicating no update was needed.
            return res.redirect("/profile");  // This line can be adjusted based on your application's logic.
        }

        const updatedUser = await User.findByIdAndUpdate(req.user.id, updateFields, { new: true });
        if (!updatedUser) {
            return res.status(400).send('User not found.');
        }

        // Send confirmation email after successful update
        const emailid = req.user.email;
        const subject = 'Update Profile Successful';
        const textmsg = `Dear ${firstName || checkUser.first_name}, <br><br> Profile Successfully Updated. <br><br> Thanks & Regards,<br><p style="color: #2E8B57">Team ePanda</p>`;
        email(emailid, subject, textmsg);

        renderUserLayout(req, res, 'user_profile', {
            messages: ['Profile Successfully Updated.'],
            hasMessages: true,
            userData: updatedUser,
            auth: req.isLoggedIn,
            isGoogleAuthenticated: updatedUser.google_id !== null
        });
    } catch (err) {
        console.error('Error updating user details:', err);
        res.status(500).send('Server error during profile update.');
    }
}


module.exports = {
    getUserProfile,
    getUserDashboard,
    updateUserDetails
}