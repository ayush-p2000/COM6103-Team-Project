const nodemailer = require("nodemailer");
const { email } = require('../public/javascripts/Emailing/emailing');

const contactUs = async (req, res, next) => {
    const { name, email: senderEmail, message } = req.body; // Renamed 'email' variable to 'senderEmail' to avoid conflict
    const subject = `Message from ${senderEmail}`;

    const confirm_subject = "Thanks for contacting us!";
    const confirm_message = `Dear ${name}, <br><br> Thank you for contacting us. We confirm that we have received your message. Please for any further query, contact us without hesitation. <br><br> Kind Regards, <br><p style="color:#2E8B57;"> Team ePanda </p>`;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.SENDER_EMAIL,
            pass: process.env.SENDER_PASSWORD
        },
    });

    // Emailing details of sender and receiver, as well as the contents. Can be changed according to necessity.
    const mailOptions = {
        from: {
            name: name,
            address: senderEmail
        },
        to: process.env.CONTACT_RECEIVER_EMAIL,
        subject: subject,
        html: message // This will be the HTML/text content of your email
    };

    // Function to send the email
    const sendMail = async (transporter, mailOptions) => {
        try {
            await transporter.sendMail(mailOptions);
            console.log("Email sent");
        } catch (error) {
            console.error(error);
        }
    };

    // Calling function to send the email
    sendMail(transporter, mailOptions);

    // Calling the 'email' function passing the necessary arguments
    email(senderEmail, confirm_subject, confirm_message);

    const messages = ['Message has been sent. Check your email to find the confirmation email']; // Set up your actual message here

    // Redirect the user to the landing page with the message in the URL query parameters
    res.redirect('/?messages=' + encodeURIComponent(JSON.stringify(messages)));
};

module.exports = contactUs;
