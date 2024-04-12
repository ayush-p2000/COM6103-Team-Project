const paypal = require('paypal-rest-sdk')

const { PAYPAL_MODE, PAYPAL_CLIENT_KEY, PAYPAL_SECRET_KEY } = process.env;

paypal.configure({
    'mode': PAYPAL_MODE, //sandbox or live
    'client_id': PAYPAL_CLIENT_KEY,
    'client_secret': PAYPAL_SECRET_KEY
});

let method = "";

const {request} = require("express");
const {updateTransaction} = require('../../model/mongodb')
const transactionState = require('../../model/enum/transactionState')

let data = {}
var extension = 0

function getPaypal (req, res, next) {
    data = {
        deviceId: req.query.deviceId,
        model: req.query.model,
        total: req.query.total
    }
    if (req.query.extension) {
        extension = req.query.extension
    }
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
                "return_url": `${process.env.BASE_URL}:${process.env.PORT}/checkout/complete?id=${data.deviceId}&type=paypal&total=${data.total}`,
                "cancel_url": `${process.env.BASE_URL}:${process.env.PORT}/checkout/paypal/cancelled`
            },
            "transactions": [{
                "item_list": {
                    "items": [{
                        "name": `${data.model}`,
                        "price": `${data.total}`,
                        "currency": "GBP",
                        "quantity": 1
                    }]
                },
                "amount": {
                    "currency": "GBP",
                    "total": `${data.total}`
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
                console.log(payment)
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
                    "total": `${data.total}`
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
        let transaction
        if (req.query.extension > 0) {
            console.log(req.query.extension)
            transaction = {
                deviceId: req.query.id,
                value: 0,
                state: transactionState['PAYMENT_CANCELLED'],
                paymentMethod: req.query.type,
                extension: req.query.extension
            }
        } else {
             transaction = {
                deviceId: req.query.id,
                value: 0,
                state: transactionState['PAYMENT_CANCELLED'],
                paymentMethod: req.query.type
            }
        }
        await updateTransaction(transaction)
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