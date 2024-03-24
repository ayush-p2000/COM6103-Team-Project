const {request} = require("express");
const {getMockPurchaseData} = require("../../util/mock/mockData");
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)


function getStripe (req, res, next) {
    res.render('payment/StripeGateway', {key:process.env.STRIPE_PUBLISHABLE_KEY});
}

function stripePayment(req, res, next){
    stripe.customers.create({
        email:req.body.stripeEmail,
        source:req.body.stripeToken,
        name:'Anonymous',
        address:{
            line1:"I live here",
            postal_code:'S3 7BY',
            city:'Sheffield',
            state:'South Yorkshire',
            country:'England'
        }
    })
        .then((customer) => {
            return stripe.charges.create({
                amount:'7000',
                description:'Buy item',
                currency:'GBP',
                customer:customer.id
            })
        })
        .then((charge) => {
            console.log(charge)
            res.render('payment/checkout_complete', {order: getMockPurchaseData()})
        })
        .catch((err) => {
            res.send(err)
        })
}

module.exports = {
    stripePayment,
    getStripe
}