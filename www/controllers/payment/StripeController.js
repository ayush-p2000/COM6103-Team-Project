const {request} = require("express");
const {getMockPurchaseData} = require("../../util/mock/mockData");
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

function getStripe (req, res, next) {
    res.render('payment/StripeGateway', {key:process.env.STRIPE_PUBLISHABLE_KEY});
}

// function stripePayment(req, res, next){
//     stripe.customers.create({
//         email:req.body.stripeEmail,
//         source:req.body.stripeToken,
//         name:'Anonymous',
//         address:{
//             line1:"I live here",
//             postal_code:'S3 7BY',
//             city:'Sheffield',
//             state:'South Yorkshire',
//             country:'England'
//         }
//     })
//         .then((customer) => {
//             return stripe.charges.create({
//                 amount:'7000',
//                 description:'Buy item',
//                 currency:'GBP',
//                 customer:customer.id
//             })
//         })
//         .then((charge) => {
//             console.log(charge)
//             res.render('payment/checkout_complete', {order: getMockPurchaseData()})
//         })
//         .catch((err) => {
//             res.send(err)
//         })
// }

const stripePayment = async (req, res) => {
    const session = await stripe.checkout.sessions.create({
        line_items: [
            {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: 'T-shirt',
                    },
                    unit_amount: 2000,
                },
                quantity: 1,
            },
        ],
        mode: 'payment',
        success_url: `${process.env.BASE_URL}:${process.env.PORT}/checkout/complete`,
        cancel_url: `${process.env.BASE_URL}:${process.env.PORT}/checkout/stripe/cancelled`
    });
    console.log(session)

    res.redirect(303, session.url)
}

module.exports = {
    stripePayment,
    getStripe
}