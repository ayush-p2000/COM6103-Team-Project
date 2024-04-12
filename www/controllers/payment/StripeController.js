const {request} = require("express");
const {getMockPurchaseData} = require("../../util/mock/mockData");
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

let data = {}

function getStripe (req, res, next) {
    data = {
        deviceId: req.query.deviceId,
        model: req.query.model,
        total: req.query.total
    }
    res.render('payment/StripeGateway', {key:process.env.STRIPE_PUBLISHABLE_KEY});
}


const stripePayment = async (req, res) => {
    const session = await stripe.checkout.sessions.create({
        line_items: [
            {
                price_data: {
                    currency: 'gbp',
                    product_data: {
                        name: data.model,
                    },
                    unit_amount: data.total*100,
                },
                quantity: 1,
            },
        ],
        mode: 'payment',
        success_url: `${process.env.BASE_URL}:${process.env.PORT}/checkout/complete?sessionId={CHECKOUT_SESSION_ID}&id=${data.deviceId}&type=stripe`,
        cancel_url: `${process.env.BASE_URL}:${process.env.PORT}/checkout/stripe/cancelled?id=${data.deviceId}&type=stripe`
    });

    res.redirect(303, session.url)
}

module.exports = {
    stripePayment,
    getStripe
}