/*
 * This controller should handle any operations related to the checkout process or payment processing
 */

const {getMockPurchaseData} = require("../../util/mock/mockData");

function getCheckout(req, res, next) {
    res.render('payment/checkout', {})
}

function getCheckoutCompleted (req, res, next) {
    res.render('payment/checkout_complete', {title: 'Payment Completed', order: getMockPurchaseData()});
}

module.exports = {
    getCheckout,
    getCheckoutCompleted
}