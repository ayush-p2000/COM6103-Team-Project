const paypal = require('paypal-rest-sdk')

const { PAYPAL_MODE, PAYPAL_CLIENT_KEY, PAYPAL_SECRET_KEY } = process.env;

paypal.configure({
    'mode': PAYPAL_MODE, //sandbox or live
    'client_id': PAYPAL_CLIENT_KEY,
    'client_secret': PAYPAL_SECRET_KEY
});

let method = "";

const {request} = require("express");

function getPaypal (req, res, next) {
    res.render('payment/paypalGateway', {});
}

const payProduct = async(req,res)=>{

    try {

        const create_payment_json = {
            "intent": "sale",
            "payer": {
                "payment_method": "paypal"
            },
            "redirect_urls": {
                "return_url": `${process.env.BASE_URL}:${process.env.PORT}/checkout/complete`,
                "cancel_url": `${process.env.BASE_URL}:${process.env.PORT}/checkout/paypal/cancelled`
            },
            "transactions": [{
                "item_list": {
                    "items": [{
                        "name": "Book",
                        "sku": "001",
                        "price": "50.00",
                        "currency": "GBP",
                        "quantity": 1
                    }]
                },
                "amount": {
                    "currency": "GBP",
                    "total": "50.00"
                },
                "description": "Anything"
            }]
        };

        paypal.payment.create(create_payment_json, function (error, payment) {
            if (error) {
                throw error;
            } else {
                for(let i = 0;i < payment.links.length;i++){
                    if(payment.links[i].rel === 'approval_url'){
                        res.redirect(payment.links[i].href);
                    }
                }
            }
        });

    } catch (error) {
        console.log(error.message);
    }

}

const paypalSuccess = async(req,res)=>{

    try {

        const payerId = req.query.PayerID;
        const paymentId = req.query.paymentId;

        const execute_payment_json = {
            "payer_id": payerId,
            "transactions": [{
                "amount": {
                    "currency": "GBP",
                    "total": "50.00"
                }
            }]
        };

        paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
            if (error) {
                console.log(error.response);
                throw error;
            } else {
                console.log(JSON.stringify(payment));
                res.render('payment/checkout_complete');
            }
        });

    } catch (error) {
        console.log(error.message);
    }

}

const cancelPayment = async(req,res)=>{

    try {

        res.render('payment/cancel');

    } catch (error) {
        console.log(error.message);
    }

}

module.exports = {
    getPaypal,
    payProduct,
    paypalSuccess,
    cancelPayment
}