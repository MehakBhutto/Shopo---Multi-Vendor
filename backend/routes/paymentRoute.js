const express = require("express");
const router = express.Router();
const {
    processPayment,
    getStripeKey,
} = require('../controller/paymentController');

router.post('/process', processPayment);
router.get('/stripeapikey', getStripeKey);
router.get('/stripepikey', getStripeKey);

module.exports = router;
