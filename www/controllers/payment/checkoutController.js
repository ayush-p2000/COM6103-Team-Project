/*
 * This controller should handle any operations related to the checkout process or payment processing
 */

 let method = "";
const {getMockPurchaseData} = require("../../util/mock/mockData");
const {request} = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const {getItemDetail} = require("../../model/mongodb")

let deviceId = ''
let model = ''
let total = ''

function getCheckout(req, res, next) {
    console.log(req.query.total)
    deviceId = req.query.device
    model = req.query.model
    total = req.query.total
    res.render('payment/checkout', {id: deviceId, model: model, total: total})
}

function fetchMethod(req, res, next){
    method = req.body.paymentProvider;
    let data = {
        deviceId: deviceId,
        model: model,
        total: total
    }
    if(method === 'paypal')
    {
        res.redirect('/checkout/paypal')
    }
    else
    {
        let queryString = Object.keys(data).map(key => key + '='+ encodeURIComponent(data[key])).join('&')
        res.redirect('/checkout/stripe?'+queryString)
    }
}

async function getCheckoutCompleted(req, res, next) {
    const sessionId = req.query.sessionId
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    //amount_total,
    console.log(session)
    const deviceId = req.query.id
    let device
    try {
        device = await getItemDetail(deviceId)
    } catch (err) {
        console.log(err)
    }
    console.log(device.model)
    const order = {
        id : sessionId,
        amount: session.amount_total / 100,
        date: new Date(),
        currency: "£",
        paymentMethod: req.query.type,
        product: device.model.name,
        data_retrieval: session.amount_total !== 0

    }
    res.render('payment/checkout_complete', {title: 'Payment Completed', order: order});
}


module.exports = {
    getCheckout,
    getCheckoutCompleted,
    fetchMethod
}
