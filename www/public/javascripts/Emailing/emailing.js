const nodemailer = require("nodemailer");


//Globally usable emailing function within the project
let email = (useremail, subject, textmsg) =>
{
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

    // emailing details of send and receiver, as well as the contents. Can be changed according to necessity.
    const mailOptions = {
        from: {
            name: "ePanda",
            address: process.env.SENDER_EMAIL
        },
        to: useremail,
        subject: subject,
        html: textmsg, // This will be the HTML/text content of your email
    }

    // Making use of email transporter available in nodemailer library
    const sendMail = async (transporter, mailOptions) => {
        try {
            await transporter.sendMail(mailOptions)
            console.log("Email sent")
        } catch (error) {
            console.error(error)
        }
    }

    // calling function to send the email
    sendMail(transporter, mailOptions)
}

module.exports = {
    email
}