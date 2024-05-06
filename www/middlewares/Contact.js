const nodemailer = require("nodemailer");
const { email } = require('../public/javascripts/Emailing/emailing');

const contactUs = async (req, res, next) => {
    const { name, email: senderEmail, message } = req.body; // Destructuring with renaming

    // Check if any of the required fields are missing
    if (!name || !senderEmail || !message) {
        const missingParamError = 'Missing required parameters';
        console.error(missingParamError);
        res.redirect('/?messages=' + encodeURIComponent(JSON.stringify([missingParamError])));
        return; // Stop execution if there are missing parameters
    }

    const subject = `Message from ${senderEmail}`;
    const confirm_subject = "Thanks for contacting us!";
    const confirm_message = `Dear ${name}, <br><br> Thank you for contacting us. We have received your message and will be in touch shortly. <br><br> Best Regards, <br>Your Team`;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.SENDER_EMAIL,
            pass: process.env.SENDER_PASSWORD
        }
    });

    const mailOptions = {
        from: senderEmail,
        to: process.env.CONTACT_RECEIVER_EMAIL,
        subject: subject,
        html: message
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("Email sent to contact receiver");
        await email(senderEmail, confirm_subject, confirm_message); // Assuming this function is promisified and handles sending emails
        console.log("Confirmation email sent to sender");
    } catch (error) {
        console.error("Failed to send email:", error);
        res.redirect('/?messages=' + encodeURIComponent(JSON.stringify(['Error sending message'])));
        return;
    }

    const successMessage = 'Message has been sent. Check your email to find the confirmation email';
    res.redirect('/?messages=' + encodeURIComponent(JSON.stringify([successMessage])));
};

module.exports = contactUs;
