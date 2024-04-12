/*
 * This controller should handle any operations related to the checkout process or payment processing
 */

 let method = "";
const {getMockPurchaseData} = require("../../util/mock/mockData");
const {request} = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const {getItemDetail, addTransaction, updateTransaction, getTransaction} = require("../../model/mongodb")
const transactionState = require('../../model/enum/transactionState')

let deviceId = ''
let model = ''
let total = ''

async function getCheckout(req, res, next) {
    console.log(req.query.total)
    deviceId = req.query.device
    model = req.query.model
    total = req.query.total
    const transactionDetails = {
        deviceId: deviceId,
        value: total,
        state: transactionState['AWAITING_PAYMENT']
    }
    const transaction = await getTransaction(deviceId)
    if (!transaction) {
        await addTransaction(transactionDetails)
    }
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
        let queryString = Object.keys(data).map(key => key + '='+ encodeURIComponent(data[key])).join('&')
        res.redirect('/checkout/paypal?'+queryString)
    }
    else
    {
        let queryString = Object.keys(data).map(key => key + '='+ encodeURIComponent(data[key])).join('&')
        res.redirect('/checkout/stripe?'+queryString)
    }
}

async function getCheckoutCompleted(req, res, next) {
    var sessionId
    var session
    let order = {}
    const deviceId = req.query.id
    let device
    try {
        device = await getItemDetail(deviceId)
    } catch (err) {
        console.log(err)
    }
    if (req.query.type === 'stripe') {
        sessionId = req.query.sessionId
        session = await stripe.checkout.sessions.retrieve(sessionId)
        //amount_total,
        console.log(session)
        order = setTransactionDetails(sessionId, session.amount_total/100, req.query.type, device.model.name)
    } else {
        sessionId = req.query.paymentId
        console.log(sessionId)
        order = setTransactionDetails(sessionId, req.query.total, req.query.type, device.model.name)
    }

    const transactionDetails = {
        deviceId: deviceId,
        value: total,
        state: transactionState['PAYMENT_RECEIVED'],
        paymentMethod: req.query.type
    }
    await updateTransaction(transactionDetails)

    res.render('payment/checkout_complete', {title: 'Payment Completed', order: order});
}

function setTransactionDetails(sessionId, amount, paymentMethod, product) {
    return {
        id: sessionId,
        amount: amount,
        date: new Date(),
        currency: "£",
        paymentMethod: paymentMethod,
        product: product,
        data_retrieval: amount !== 0
    }
}


module.exports = {
    getCheckout,
    getCheckoutCompleted,
    fetchMethod
}
