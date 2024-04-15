const express = require('express');
const {getCheckout, getCheckoutCompleted, checkoutToProvider,
} = require("../controllers/payment/checkoutController");
const {getPaypal, payProduct,
    paypalSuccess, Cancel, cancelPayment
} = require("../controllers/payment/PaypalController");
const {stripePayment, getStripe} = require("../controllers/payment/StripeController");

const router = express.Router();

router.get('/checkout', getCheckout);

router.post('/checkout', checkoutToProvider);

router.get('/checkout/complete?', getCheckoutCompleted);

router.get('/checkout/paypal', getPaypal);

router.post('/checkout/paypal/pay?', payProduct);

router.get('/checkout/paypal/success', paypalSuccess);

router.get('/checkout/paypal/cancelled', cancelPayment);

router.get('/checkout/stripe/cancelled?', cancelPayment);

router.get('/checkout/stripe?', getStripe);

router.post('/create-checkout-session?', stripePayment)

module.exports = router;