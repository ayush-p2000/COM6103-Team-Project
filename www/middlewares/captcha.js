const axios = require("axios");

exports.validateCaptcha = async (req, res, next) => {
    const secret_key = process.env.CAPTCHA_SECRET;
    const token = req.body.token;
    const captchaApi = `https://www.google.com/recaptcha/api/siteverify?secret=${secret_key}&response=${token}`;
    const captcha = await axios.post(captchaApi)
    if (captcha && captcha.data.success) {
        return next()
    }
    req.session.messages = ["Google ReCaptchaV3 Check Failed!","Please restart your browser or your computer."]
    return res.redirect(req.path)
}
