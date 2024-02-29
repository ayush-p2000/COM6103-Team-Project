const express = require('express');
const {getCheckout, getCheckoutCompleted} = require("../controllers/payment/checkoutController");
const router = express.Router();

router.get('/checkout', getCheckout);

router.get('/checkout/complete', getCheckoutCompleted);

//TODO: Add function to handle /payment route
router.get('/payment', function (req, res, next) {
    res.send('[Payment Route Here, will be for callbacks from payment processor, etc.]')
});

module.exports = router;