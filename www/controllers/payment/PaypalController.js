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



/**
 * Get method used to display the gateway to paypal
 * @author Vinroy Miltan Dsouza <vmdsouza1@sheffield.ac.uk> & Ayush Prajapati <aprajapati1@sheffield.ac.uk>
 */
function getPaypal (req, res, next) {

    let extension = 0
    let data = {} = {
        id: req.query.id,
        model: req.query.model,
        total: req.query.total
    }
    if (req.query.extension) {
        extension = req.query.extension
    }
    let queryString = Object.keys(data).map(key => key + '='+ encodeURIComponent(data[key])).join('&')
    res.render('payment/paypalGateway', {data:queryString, extension: extension});
}


/**
 * Method used to create a payment session
 * @author Vinroy Miltan Dsouza <vmdsouza1@sheffield.ac.uk> & Ayush Prajapati <aprajapati1@sheffield.ac.uk>
 */
const payProduct = async(req,res)=>{

    try {
        let id = req.query.id
        let model = req.query.model
        let total = req.query.total
        let extension = req.query.extension
        let sku
        switch (extension) {
            case 0: sku = 1
                break
            case 3: sku = 2
                break
            case 6: sku = 3
                break
        }
        const create_payment_json = {
            "intent": "sale",
            "payer": {
                "payment_method": "paypal"
            },
            "redirect_urls": {
                "return_url": `${process.env.BASE_URL}:${process.env.PORT}/checkout/complete?id=${id}&type=paypal&total=${total}&extension=${extension}`,
                "cancel_url": `${process.env.BASE_URL}:${process.env.PORT}/checkout/paypal/cancelled?id=${id}&type=paypal&total=${total}&extension=${extension}`
            },
            "transactions": [{
                "item_list": {
                    "items": [{
                        "name": `${model}`,
                        "price": `${total}`,
                        "currency": "GBP",
                        "quantity": 1,
                        "sku": `${sku}`
                    }]
                },
                "amount": {
                    "currency": "GBP",
                    "total": `${total}`
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
        const total = req.query.total

        const execute_payment_json = {
            "payer_id": payerId,
            "transactions": [{
                "amount": {
                    "currency": "GBP",
                    "total": `${total}`
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

/**
 * Method used to display the cancel payment page and update the transaction in the database
 * @author Vinroy Miltan Dsouza <vmdsouza1@sheffield.ac.uk> & Ayush Prajapati <aprajapati1@sheffield.ac.uk>
 */
const cancelPayment = async(req,res)=>{

    try {
        let transaction = {
            deviceId: req.query.id,
            value: req.query.total,
            state: transactionState['PAYMENT_CANCELLED'],
            paymentMethod: req.query.type,
        }
        if (req.query.extension > 0) {
            transaction = {
                extension: req.query.extension
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