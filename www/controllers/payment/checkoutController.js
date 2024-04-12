/*
 * This controller should handle any operations related to the checkout process or payment processing
 */

 let method = "";
const {getMockPurchaseData} = require("../../util/mock/mockData");
const {request} = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const {getItemDetail, addTransaction, updateTransaction, getTransactionByDevice, getTransactionById} = require("../../model/mongodb")
const transactionState = require('../../model/enum/transactionState')

let deviceId = ''
let model = ''
let total = ''
let type = ''
let extension

async function getCheckout(req, res, next) {
    type = req.query.type
    if (type === 'payment_retrieval') {
        deviceId = req.query.device
        model = req.query.model
        total = req.query.total
        const transactionDetails = {
            deviceId: deviceId,
            value: total,
            state: transactionState['AWAITING_PAYMENT']
        }
        const transaction = await getTransactionByDevice(deviceId)
        if (!transaction) {
            await addTransaction(transactionDetails)
        }
    } else {
        const transaction = await getTransactionById(req.query.retrieval_id)
        deviceId = transaction.device
        console.log(deviceId)
        const device = await getItemDetail(deviceId)
        model = device.model.name
        total = req.query.total
        extension = req.query.extension
        const transactionDetails = {
            deviceId: deviceId,
            value: total,
            extension: extension,
            state: transactionState['AWAITING_PAYMENT']
        }
        await updateTransaction(transactionDetails)
    }

    res.render('payment/checkout', {id: deviceId, model: model, total: total, extension: extension})
}

function fetchMethod(req, res, next){
    method = req.body.paymentProvider;
    let data
    if (type === 'payment_retrieval') {
         data = {
            deviceId: deviceId,
            model: model,
            total: total
        }
    } else {
        data = {
            deviceId: deviceId,
            model: model,
            total: total,
            extension: extension
        }
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
    let transactionDetails
    if (extension > 0) {
        console.log(extension)
        transactionDetails = {
            deviceId: deviceId,
            value: total,
            state: transactionState['PAYMENT_RECEIVED'],
            paymentMethod: req.query.type,
            extension: extension
        }
    } else {
        transactionDetails = {
            deviceId: deviceId,
            value: total,
            state: transactionState['PAYMENT_RECEIVED'],
            paymentMethod: req.query.type
        }
    }
    await updateTransaction(transactionDetails)

    res.render('payment/checkout_complete', {title: 'Payment Completed', order: order, extension: extension});
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
