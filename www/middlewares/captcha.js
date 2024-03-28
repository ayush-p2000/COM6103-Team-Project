/**
 * A Captcha Middleware for Google V3 Captcha Check
 * @author Adrian Urbanczyk <aurbanczyk1@sheffield.ac.uk>
 */

const axios = require("axios");

exports.validateCaptcha = async (req, res, next) => {
    if(req.body.token === undefined || req.body.token === '' || req.body.token === null)
    {
        console.log(req.body)
        return res.json({"responseError" : "something goes to wrong"});
    }
    const secret_key = process.env.CAPTCHA_SECRET;
    const token = req.body.token;
    const captchaApi = `https://www.google.com/recaptcha/api/siteverify?secret=${secret_key}&response=${token}&remoteip=${req.connection.remoteAddress}`

    const captcha = await axios.post(captchaApi)
    if (captcha && captcha.data.success) {
        return next()
    }

    req.session.messages = ["Google ReCaptchaV3 Check Failed!","Please restart your browser or your computer."]
    return res.redirect(req.path)
}
