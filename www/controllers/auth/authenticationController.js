/*
 * This controller should handle any operations related to auth such as login, logout, and registration
 */

const {User} = require("../../model/models")
const {randomBytes, pbkdf2} = require("node:crypto")
const {promisify} = require('node:util')
const {email} = require("../../public/javascripts/Emailing/emailing");
const passport = require("passport");
const {getUserById, updateUserDob} = require("../../model/mongodb");
const pbkdf2Promise = promisify(pbkdf2)
let token = ""

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

        const userData = await user.save()

        if(userData)
        {
            const messages = ['Verification link has been sent to your email. Please verify email.']
            sendVerifyEmail(req.body.firstName, req.body.email, userData._id)
            console.log(userData._id)

            req.login(user, err => {
                    if (err)
                        return next(err)
                res.render("authentication/login", {auth: req.isLoggedIn, user:req.user, messages: messages,
                    hasMessages: messages.length > 0,})
                })
        }
        else
        {
            res.send("Error in registering")
        }
    } catch (err) {
            return next(err)
    }
}

//----------------------------------------------------- Logging Out User -------------------------------------------------------------------------------//

const logoutUser = (req, res, next) => {
    req.logout(err => {
        if (err) return next(err);
        req.session.destroy(err => {
            if (err) return next(err);
            res.redirect("/login");
        });
    });
};

//---------------------------------------------------- Rendering Login Page ----------------------------------------------------------------------------//

function getLoginPage(req, res, next) {
    res.render("authentication/login", {auth: req.isLoggedIn, user:req.user})
}

//---------------------------------------------------- Rendering Register Page ----------------------------------------------------------------------------//


function getRegisterPage(req, res, next) {
    res.render("authentication/register", {auth: req.isLoggedIn, user:req.user})
}

//---------------------------------------------------- Email Verification ----------------------------------------------------------------------//

const sendVerifyEmail = (name, userEmail, user_id) => {
    const subject = "ePanda Verification"
    const message = `<p>Dear ${name},<br><br> Please click <a href="${process.env.BASE_URL}:${process.env.PORT}/verify?id=${user_id}">here</a> to verify your email. <br><br> Regards,<br><p style="color: #2E8B57">Team Panda</p></p>`
    email(userEmail, subject, message)
}

const verifyEmail = async(req, res) => {
    try {
        const updateInfo = await User.updateOne({_id: req.query.id},
            {
                $set:{verified:true}
            })
        console.log(updateInfo)
        res.render("authentication/verify")
    }
    catch (err){
        console.log(err)
    }
}

/**
 * Methods for authentication features
 * @author Ayush Prajapati <aprajapati1@sheffield.ac.uk>
 */

//-------------------------------------------------- Forgot password flow methods --------------------------------------------------------------//

function getForgotPassword(req, res, next){
    res.render('authentication/forgot-password', {auth: req.isLoggedIn, user:req.user})
}


function getResetPasswordPage(req, res, next) {
     res.render('authentication/reset-password', { auth: req.isLoggedIn, user: req.user });
}


//-------------------------------------------------- Finding user to send reset password link via email --------------------------------------------------------------//
async function getForgotUser(req, res, next) {
    const { resetEmail } = req.body;
    token = generateRandomToken();
    try {
        const user = await User.findOneAndUpdate(
            { email: resetEmail },
            { token: token }
        );
        if(user) {

            // Generate the reset password link
            const link = resetPasswordLink(token);

            // You can send the link to the user's email or provide it in the response
            //res.send(`Copy the token = ${token} and paste in the link Reset password link: ${link}`);
            res.send("Messsage has been sent to your email. Please follow the steps")
            const subject = "Password Reset - ePanda"
            const message = `Reset password link: ${link} <br><br> Regards,<br><p style="color: #2E8B57">Team Panda</p>`
            email(resetEmail, subject, message )
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

//--------------------------------------------------- Creating a token for the reset session --------------------------------------------------------------//
const generateRandomToken = (length = 32) => {
    return randomBytes(length).toString('hex');
};

//--------------------------------------------------- Generating a reset password link --------------------------------------------------------------//
const resetPasswordLink = (token) => {
    const {BASE_URL, PORT} = process.env
    // Assuming your application is running on localhost:3000, adjust accordingly if not
    const baseUrl = `${BASE_URL}:${PORT}`;
    return `${baseUrl}/reset-password?token=${token}`;
};

//--------------------------------------------------- resetting  password --------------------------------------------------------------//
const resetPassword = async (req, res, next) => {
    try {
        const { password, confirmPassword } = req.body;

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
        res.status(200).redirect('/login');
        token = "";
    } catch (err) {
        console.error("Error resetting password:", err);
        res.status(500).send("Error resetting password");
    }
};

//--------------------------------------------------- 3rd Party Authentication methods --------------------------------------------------------------//

const googleAuth = passport.authenticate('google', {scope: ['profile', 'email'] })

const googleAuthCallback = passport.authenticate('google', { failureRedirect: '/login'})

const facebookAuth = passport.authenticate('facebook', {scope: ['public_profile', 'email'] })

const facebookAuthCallback = passport.authenticate('facebook', { failureRedirect: '/login'})


/**
 * Get method to check if the user's date of birth exists
 * If not then redirect to verify dob page for the user to enter their birthdate
 * @author Vinroy Miltan Dsouza <vmdsouza1@sheffield.ac.uk>
 */
async function getAgeGoogle(req, res, next) {
    const user = await getUserById(req.user._id)

    if (user.date_of_birth === null) {
        res.render('authentication/dateOfBirth', {userId: req.user._id})
    } else {
        next()
    }
}


/**
 * Get method to update the date of birth in the database
 * @author Vinroy Miltan Dsouza <vmdsouza1@sheffield.ac.uk>
 */
async function checkAgeGoogle(req, res, next) {
    const {birthday, id} = req.body
    if (req.session.messages.length > 0) {
        res.redirect('/login')
    } else {
        await updateUserDob(id, birthday)
        res.redirect('/auth/google')
    }
}

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
    resetPasswordLink,
    googleAuth,
    googleAuthCallback,
    facebookAuth,
    facebookAuthCallback,
    verifyEmail,
    getAgeGoogle,
    checkAgeGoogle
}

//------------------------------------------------------------------ End of File ----------------------------------------------------------------------------//
