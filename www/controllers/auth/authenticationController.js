/*
 * This controller should handle any operations related to auth such as login, logout, and registration
 */

const {User} = require("../../model/schema/user")
const {randomBytes, pbkdf2} = require("node:crypto")
const {promisify} = require('node:util')
const { validationResult } = require("express-validator")
const pbkdf2Promise = promisify(pbkdf2)

//------------------------------------------------- User Registration Data feeding and Authenticating -------------------------------------------//

const registerUser = async (req, res, next) => {
    let messages;
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
            country
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
            return res.render("authentication/register", {
                messages: messages,
                hasMessages: messages.length > 0,
                auth: req.isLoggedIn,
                user: req.user
            }) // needs refined alert
        }

        let user = new User({
            first_name: firstName,
            last_name: lastName,
            date_of_birth: dateOfBirth,
            phone_number,
            email,
            password: hashedPassword,
            salt,
            address
        });

        if (req.session.messages.length > 0) {
            return res.redirect("/register")
        }

        await user.save()

        req.login(user, err => {
            if (err)
                return next(err)
            res.redirect("/dashboard")
        })
    } catch (err) {
        return next(err)
    }
}

//----------------------------------------------------- Logging Out User -------------------------------------------------------------------------------//

const logoutUser = (req,res,next) => {
    req.logout(err => {
        if(err) return next(err)
        res.redirect("/login")
    })
}

//---------------------------------------------------- Rendering Login Page ----------------------------------------------------------------------------//

function getLoginPage(req, res, next) {
    res.render("authentication/login", {auth: req.isLoggedIn, user:req.user})
}

//---------------------------------------------------- Rendering Register Page ----------------------------------------------------------------------------//


function getRegisterPage(req, res, next) {
    res.render("authentication/register", {auth: req.isLoggedIn, user:req.user})
}


function getForgotPassword(req, res, next){
    res.render('authentication/forgot-password', {auth: req.isLoggedIn, user:req.user})
}


function getResetPasswordPage(req, res, next) {
     res.render('authentication/reset-password', { auth: req.isLoggedIn, user: req.user });
}



async function getForgotUser(req, res, next) {
    const { resetEmail } = req.body;
    const token = generateRandomToken();
    try {
        const user = await User.findOneAndUpdate(
            { email: resetEmail },
            { token: token }
        );
        if(user) {
            console.log("Reset token generated for user:", user);

            // Generate the reset password link
            const link = resetPasswordLink(token);

            // Log the link for debugging purposes
            console.log("Reset password link:", link);

            // You can send the link to the user's email or provide it in the response
            res.send(`Copy the token = ${token} and paste in the link Reset password link: ${link}`);
        }
        else
        {
            res.send('User not found')
        }
    } catch (err) {
        console.error("Error generating reset token:", err);
        res.status(500).send('Error generating reset token');
    }
}

const generateRandomToken = (length = 32) => {
    return randomBytes(length).toString('hex');
};

const resetPasswordLink = (token) => {
    const {BASE_URL, PORT} = process.env
    // Assuming your application is running on localhost:3000, adjust accordingly if not
    const baseUrl = `http://${BASE_URL}:${PORT}`;
    return `${baseUrl}/reset-password?token=${token}`;
};

const resetPassword = async (req, res, next) => {
    try {
        const { token, password, confirmPassword } = req.body;

        // Find the user by the reset token
        const user = await User.findOne({ token });

        if (!user) {
            return res.status(404).send("User not found or invalid token");
        }

        // Check if the provided passwords match
        if (password !== confirmPassword) {
            return res.status(400).send("Passwords do not match");
        }

        // Hash the new password and update user record
        const salt = randomBytes(16);
        const hashedPassword = await pbkdf2Promise(password, salt, 310000, 32, 'sha256');
        await User.findOneAndUpdate(
            { _id: user._id },
            { password: hashedPassword, salt: salt, token: null },
            { new: true }
        );

        // Password reset successful
        res.status(200).send("Password reset successfully");
    } catch (err) {
        console.error("Error resetting password:", err);
        res.status(500).send("Error resetting password");
    }
};


module.exports = {
    getLoginPage,
    getRegisterPage,
    registerUser,
    logoutUser,
    getForgotPassword,
    getForgotUser,
    generateRandomToken,
    resetPassword,
    getResetPasswordPage,
    resetPasswordLink
}

//------------------------------------------------------------------ End of File ----------------------------------------------------------------------------//
