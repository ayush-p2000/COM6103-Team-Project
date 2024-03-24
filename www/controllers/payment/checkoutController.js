/*
 * This controller should handle any operations related to the checkout process or payment processing
 */

 let method = "";
const {getMockPurchaseData} = require("../../util/mock/mockData");
const {request} = require("express");

function getCheckout(req, res, next) {
    console.log(req.query.total)
    res.render('payment/checkout', {})
}

function fetchMethod(req, res, next){
    method = req.body.paymentProvider;
    if(method === 'paypal')
    {
        res.redirect('/checkout/paypal')
    }
    else
    {
        res.redirect('/checkout/stripe')
    }
}

function getCheckoutCompleted (req, res, next) {
    res.render('payment/checkout_complete', {title: 'Payment Completed', order: getMockPurchaseData()});
}


module.exports = {
    getCheckout,
    getCheckoutCompleted,
    fetchMethod
}
