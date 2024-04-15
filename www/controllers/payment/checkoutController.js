/*
 * This controller should handle any operations related to the checkout process or payment processing
 */

const {getMockPurchaseData} = require("../../util/mock/mockData");
const {request} = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const {getItemDetail, addTransaction, updateTransaction, getTransactionByDevice, getTransactionById, updateDeviceState} = require("../../model/mongodb")
const transactionState = require('../../model/enum/transactionState')
const deviceState = require('../../model/enum/deviceState')
const paymentMethod = require('../../model/enum/paymentMethod')


/**
 * Get method used to display the product information before checking out for payment
 * here the method checks if the transaction is for data retrieval or for extension
 * @author Vinroy Miltan Dsouza <vmdsouza1@sheffield.ac.uk> & Ayush Prajapati <aprajapati1@sheffield.ac.uk>
 */
async function getCheckout(req, res, next) {
    let id = req.query.id
    let total = req.query.total
    let extension = 0
    let type = req.query.type.toLowerCase()
    let product = ''
    let transactionDetails
    let transaction
    //Check if the device is for recycling
    if (total === '0') {
        let model = req.query.model
        const state = deviceState.RECYCLED
        await updateDeviceState(id, state)
        const order = setTransactionDetails(id, total, 'Not Available', model, extension)
        res.render('payment/checkout_complete', {title: 'Payment Completed', order: order, extension: extension})
    } else {
        //Check to determine if the payment is for retrieval or for extending the retrieval time
        switch (type) {
            case 'payment_retrieval':
                product = 'Data Retrieval'
                transaction = await getTransactionByDevice(id)
                if (!transaction) {
                    transactionDetails = {
                        deviceId: id,
                        value: total,
                        state: transactionState['AWAITING_PAYMENT']
                    }
                    const newTransaction = await addTransaction(transactionDetails)
                    id = newTransaction._id
                } else {
                    id =  transaction._id
                }

                break
            case 'retrieval_extension':
                product = 'Data Retrieval Extension'
                transaction = await getTransactionById(id)
                const deviceId = transaction.device._id
                const device = await getItemDetail(deviceId)
                extension = req.query.extension
                transactionDetails = {
                    id: transaction._id,
                    value: total,
                    extension: extension,
                    state: transactionState['AWAITING_PAYMENT']
                }
                await updateTransaction(transactionDetails)
                break
        }

        res.render('payment/checkout', {id: id, total: total, extension: extension, product: product})
    }

}

/**
 * Method used to redirect to the payment page based on the payment method checked
 * @author Vinroy Miltan Dsouza <vmdsouza1@sheffield.ac.uk> & Ayush Prajapati <aprajapati1@sheffield.ac.uk>
 */
function checkoutToProvider(req, res, next){
    let method = req.body.paymentProvider;
    let type = req.query.type.toLowerCase()
    let id = req.body.transactionId
    let total = req.query.total
    let extension = req.query.extension
    let product = 'Data Retrieval'

    let data = {
        id: id,
        product: product,
        total: total,
        type: type
    }

    if (type === 'retrieval_extension') {
        data.extension = extension
        data.product = 'Data Retrieval Extension'
    }

    let queryString = Object.keys(data).map(key => key + '='+ encodeURIComponent(data[key])).join('&')
    res.redirect(`/checkout/${method}?${queryString}`)

}

/**
 * Get method used to display the payment success page
 * @author Vinroy Miltan Dsouza <vmdsouza1@sheffield.ac.uk> & Ayush Prajapati <aprajapati1@sheffield.ac.uk>
 */
async function getCheckoutCompleted(req, res, next) {
    var sessionId
    let order = {}
    let id = req.query.id
    let total = 0
    let extension = req.query.extension
    let product = 'Data Retrieval'
    let type = req.query.type

    //Check if the payment is done through stripe or paypal and  get the payment id for the same
    switch (req.query.method) {
        case 'stripe':
            sessionId = req.query.sessionId
            let session = await stripe.checkout.sessions.retrieve(sessionId)
            total = session.amount_total / 100
            break
        case 'paypal':
            sessionId = req.query.paymentId
            total = parseFloat(req.query.total)
            break
        default:
            sessionId = 0
            total = 0
    }
    let transactionDetails = {
        id: id,
        value: total,
        state: transactionState['PAYMENT_RECEIVED'],
        paymentMethod: paymentMethod[req.query.method.toUpperCase()]
    }
    if (type === 'retrieval_extension') {
        product = 'Data Retrieval Extension'
        transactionDetails.extension = extension
    }
    order = setTransactionDetails(sessionId, total, req.query.method, product, extension)

    await updateTransaction(transactionDetails)

    res.render('payment/checkout_complete', {title: 'Payment Completed', order: order, extension: extension});
}

/**
 * Set method used to intilialize the transaction details
 * @author Vinroy Miltan Dsouza <vmdsouza1@sheffield.ac.uk>
 */
function setTransactionDetails(sessionId, amount, paymentMethod, product, extension) {
    return {
        id: sessionId,
        amount: amount,
        date: new Date(),
        currency: "£",
        paymentMethod: paymentMethod,
        product: product,
        data_retrieval: extension
    }
}


module.exports = {
    getCheckout,
    getCheckoutCompleted,
    checkoutToProvider
}
