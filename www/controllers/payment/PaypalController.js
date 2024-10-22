/**
 * PayPal integration method
 * @author Ayush Prajapati <aprajapati1@sheffield.ac.uk>
 */

const paypal = require('paypal-rest-sdk')

const { PAYPAL_MODE, PAYPAL_CLIENT_KEY, PAYPAL_SECRET_KEY } = process.env;

paypal.configure({
    'mode': PAYPAL_MODE, //sandbox or live
    'client_id': PAYPAL_CLIENT_KEY,
    'client_secret': PAYPAL_SECRET_KEY
});

const {updateTransaction} = require('../../model/mongodb')
const transactionState = require('../../model/enum/transactionState')
const {renderUserLayout} = require("../../util/layout/layoutUtils");



/**
 * Get method used to display the gateway to paypal
 * @author Vinroy Miltan Dsouza <vmdsouza1@sheffield.ac.uk> & Ayush Prajapati <aprajapati1@sheffield.ac.uk>
 */
function getPaypal (req, res, next) {

    let extension = 0
    let data = {
        id: req.query.id,
        product: req.query.product,
        total: req.query.total,
        type: req.query.type
    }
    if (req.query.extension) {
        extension = req.query.extension
    }
    let queryString = Object.keys(data).map(key => key + '='+ encodeURIComponent(data[key])).join('&')
    renderUserLayout(req, res, '../payment/paypalGateway', {data:queryString, extension: extension});
}


/**
 * Method used to create a payment session
 * @author Vinroy Miltan Dsouza <vmdsouza1@sheffield.ac.uk> & Ayush Prajapati <aprajapati1@sheffield.ac.uk>
 */
const payProduct = async(req,res)=>{

    try {
        let id = req.query.id
        let product = req.query.product
        let total = req.query.total
        let extension = req.query.extension
        let type = req.query.type
        let sku

        if (!id || !product || !total || !type) {
            res.status(400).send('Missing required parameters');
            return; // Stop further execution in case of missing parameters
        }

        switch (extension) {
            case 0: sku = 1
                break
            case 3: sku = 2
                break
            case 6: sku = 3
                break
            default: sku = 1;
        }
        const create_payment_json = {
            "intent": "sale",
            "payer": {
                "payment_method": "paypal"
            },
            "redirect_urls": {
                "return_url": `${process.env.BASE_URL}:${process.env.PORT}/checkout/complete?id=${id}&method=paypal&total=${total}&extension=${extension}&type=${type}`,
                "cancel_url": `${process.env.BASE_URL}:${process.env.PORT}/checkout/paypal/cancelled?id=${id}&method=paypal&total=${total}&extension=${extension}&type=${type}`
            },
            "transactions": [{
                "item_list": {
                    "items": [{
                        "name": `${product}`,
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
                console.error('Error creating payment:', error);
                return res.status(500).send('Error creating payment');
            } else {
                let approvalUrl = payment.links.find(link => link.rel === 'approval_url');
                if (approvalUrl) {
                    res.redirect(approvalUrl.href);
                } else {
                    res.status(500).send('No approval URL found');
                }
            }
        });

    } catch (error) {
        console.error('Unexpected error in payProduct:', error.message);
        res.status(500).send('Error processing payment');
    }
}

const paypalSuccess = async(req,res)=>{

    try {

        const payerId = req.query.PayerID;
        const paymentId = req.query.paymentId;
        const total = req.query.total

        if (!payerId || !paymentId || !total) {
            return res.status(400).render('error', { message: 'Missing required parameters.' });
        }
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
                // res.render('payment/checkout_complete');
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
const cancelPayment = async(req, res) => {
    try {
        const { id, total, type, extension } = req.query;

        // Check for missing required parameters
        if (!id || !total || !type) {
            return renderUserLayout(req, res, '../payment/error', {
                message: 'Missing required parameters'
            });
        }

        let transaction = {
            deviceId: id,
            value: total,
            state: transactionState['PAYMENT_CANCELLED'],
            paymentMethod: type,
        };
        if (type === 'retrieval_extension') {
            transaction.extension = extension;
        }
        await updateTransaction(transaction);
        renderUserLayout(req, res, '../payment/cancel');

    } catch (error) {
        console.log(error.message);
        renderUserLayout(req, res, '../payment/error', { message: 'Error processing your request' });
    }
}

module.exports = {
    getPaypal,
    payProduct,
    paypalSuccess,
    cancelPayment
}