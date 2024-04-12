const {request} = require("express");
const {getMockPurchaseData} = require("../../util/mock/mockData");
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)



function getStripe (req, res, next) {
    let extension = 0
    let data = {
        id: req.query.deviceId,
        model: req.query.model,
        total: req.query.total
    }
    if (req.query.extension) {
        extension = req.query.extension
    }
    let queryString = Object.keys(data).map(key => key + '='+ encodeURIComponent(data[key])).join('&')
    res.render('payment/StripeGateway', {key:process.env.STRIPE_PUBLISHABLE_KEY, data: queryString, extension: extension});
}


const stripePayment = async (req, res) => {
    let id = req.query.id
    let model = req.query.model
    let total = req.query.total
    let extension = req.query.extension
    const session = await stripe.checkout.sessions.create({
        line_items: [
            {
                price_data: {
                    currency: 'gbp',
                    product_data: {
                        name: model,
                    },
                    unit_amount: total*100,
                },
                quantity: 1,
            },
        ],
        mode: 'payment',
        success_url: `${process.env.BASE_URL}:${process.env.PORT}/checkout/complete?sessionId={CHECKOUT_SESSION_ID}&id=${id}&type=stripe`,
        cancel_url: `${process.env.BASE_URL}:${process.env.PORT}/checkout/stripe/cancelled?id=${id}&total=${total}&type=stripe&extension=${extension}`
    });

    res.redirect(303, session.url)
}

module.exports = {
    stripePayment,
    getStripe
}