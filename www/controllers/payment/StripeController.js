/**
 * Stripe integration method
 * @author Ayush Prajapati <aprajapati1@sheffield.ac.uk>
 * @author Vinroy Miltan Dsouza <vmdsouza1@sheffield.ac.uk>
 */

const {request} = require("express");
const {getMockPurchaseData} = require("../../util/mock/mockData");
const {renderUserLayout} = require("../../util/layout/layoutUtils");
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)


/**
 * Get method used to display the stripe gateway
 * @author Vinroy Miltan Dsouza <vmdsouza1@sheffield.ac.uk> & Ayush Prajapati <aprajapati1@sheffield.ac.uk>
 */
function getStripe (req, res, next) {
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
    renderUserLayout(req, res, '../payment/StripeGateway', {key:process.env.STRIPE_PUBLISHABLE_KEY, data: queryString, extension: extension});
}

/**
 * Method used to create a stripe payment session
 * @author Vinroy Miltan Dsouza <vmdsouza1@sheffield.ac.uk> & Ayush Prajapati <aprajapati1@sheffield.ac.uk>
 */
const stripePayment = async (req, res) => {
    let id = req.query.id
    let product = req.query.product
    let total = req.query.total
    let extension = req.query.extension
    let type = req.query.type
    const session = await stripe.checkout.sessions.create({
        line_items: [
            {
                price_data: {
                    currency: 'gbp',
                    product_data: {
                        name: product,
                    },
                    unit_amount: total*100,
                },
                quantity: 1,
            },
        ],
        mode: 'payment',
        success_url: `${process.env.BASE_URL}:${process.env.PORT}/checkout/complete?sessionId={CHECKOUT_SESSION_ID}&id=${id}&method=stripe&extension=${extension}&type=${type}`,
        cancel_url: `${process.env.BASE_URL}:${process.env.PORT}/checkout/stripe/cancelled?id=${id}&total=${total}&method=stripe&extension=${extension}&type=${type}`
    });

    res.redirect(303, session.url)
}

module.exports = {
    stripePayment,
    getStripe
}